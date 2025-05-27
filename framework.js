import { produce } from "immer";
import { parseView } from "./parser.js";

/**
 * Subscribes to all observables and returns a functionthat will unsubscribe
 * from all observables when called
 * @param {*} observables
 * @returns
 */
const subscribeAll = (observables) => {
  // Subscribe to all observables and store the subscription objects
  const subscriptions = observables.map((observable) => observable.subscribe());

  // Return a function that will unsubscribe from all observables when called
  return () => {
    for (const subscription of subscriptions) {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    }
  };
};

/**
 * Creates a read-only proxy object that only allows access to specified properties from the source object
 * @param {Object} source - The source object to create a proxy from
 * @param {string[]} allowedKeys - Array of property names that are allowed to be accessed
 * @returns {Proxy} A read-only proxy object that only allows access to the specified properties
 * @throws {Error} When attempting to modify the proxy object
 */
function createProps(source, allowedKeys) {
  // return source;
  const allowed = new Set(allowedKeys);
  return new Proxy({}, {
    get(_, prop) {
      if (allowed.has(prop)) {
        return source[prop];
      }
      return undefined;
    },
    set() {
      throw new Error('Cannot assign to read-only proxy');
    },
    defineProperty() {
      throw new Error('Cannot define properties on read-only proxy');
    },
    deleteProperty() {
      throw new Error('Cannot delete properties from read-only proxy');
    },
    has(_, prop) {
      return allowed.has(prop);
    },
    ownKeys() {
      return [...allowed];
    },
    getOwnPropertyDescriptor(_, prop) {
      if (allowed.has(prop)) {
        return {
          configurable: true,
          enumerable: true,
          get: () => source[prop]
        };
      }
      return undefined;
    }
  });
}

export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.renderTarget = document.createElement("div");
    this.renderTarget.style.cssText = "display: contents;";

    this.transformedHandlers = {};
  }

  store;
  props;
  propsSchema;
  template;
  handlers;
  transformedHandlers = {};
  refs;
  refIds = {};
  patch;
  _unmountCallback;
  _oldVNode;
  deps;

  get viewData() {
    return this.store.toViewData({
      state: this.store.getState(),
      props: this.props,
      globalStore: this.deps.globalStore,
    });
  }

  connectedCallback() {
    if (!this.renderTarget.parentNode) {
      this.appendChild(this.renderTarget);
    }
    this.style.display = "contents";

    const deps = {
      ...this.deps,
      refIds: this.refIds,
      getRefIds: () => this.refIds,
      dispatchEvent: this.dispatchEvent.bind(this),
    };

    // TODO don't include onmount, subscriptions, etc in transformedHandlers
    Object.keys(this.handlers || {}).forEach((key) => {
      this.transformedHandlers[key] = (payload) => {
        const result = this.handlers[key](payload, deps);
        return result;
      };
    });

    if (this.handlers?.subscriptions) {
      this.unsubscribeAll = subscribeAll(this.handlers.subscriptions(deps));
    }

    if (this.handlers?.handleOnMount) {
      this._unmountCallback = this.handlers?.handleOnMount(deps);
    }

    requestAnimationFrame(() => {
      this.render();
    });
  }

  disconnectedCallback() {
    if (this._unmountCallback) {
      this._unmountCallback();
    }
    if (this.unsubscribeAll) {
      this.unsubscribeAll();
    }
  }

  render = () => {
    if (!this.patch) {
      console.error("Patch function is not defined!");
      return;
    }

    if (!this.template) {
      console.error("Template is not defined!");
      return;
    }

    try {
      const parseStart = performance.now();
      const vDom = parseView(
        this.template,
        this.viewData,
        this.refs,
        this.transformedHandlers,
        this.propsSchema
      );

      // parse through vDom and recursively find all elements with id
      const ids = {};
      const findIds = (vDom) => {
        if (vDom.data.attrs && vDom.data.attrs.id) {
          ids[vDom.data.attrs.id] = vDom;
        }
        if (vDom.children) {
          vDom.children.forEach(findIds);
        }
      };
      findIds(vDom);
      this.refIds = ids;

      const parseTime = performance.now() - parseStart;
      console.log(`parseView took ${parseTime.toFixed(2)}ms`);

      console.log("vDom", vDom);

      const patchStart = performance.now();
      if (!this._oldVNode) {
        this._oldVNode = this.patch(this.renderTarget, vDom);
      } else {
        this._oldVNode = this.patch(this._oldVNode, vDom);
      }
      const patchTime = performance.now() - patchStart;
      console.log(`patch took ${patchTime.toFixed(2)}ms`);
    } catch (error) {
      console.error("Error during patching:", error);
    }
  };
}

export const createMyComponent = (
  { handlers, template, createStore, refs, patch, propsSchema },
  deps
) => {
  class MyComponent extends BaseComponent {
    constructor() {
      super();
      this.propsSchema = propsSchema;
      this.props = propsSchema ? createProps(this, Object.keys(propsSchema.properties)) : {};
      this.store = createStore(undefined, this.props);
      this.template = template;
      this.handlers = handlers;
      this.refs = refs;
      this.patch = patch;
      this.deps = {
        ...deps,
        store: this.store,
        globalStore: deps.globalStore,
        render: this.render,
        handlers,
      };
      // this.globalStore = globalStore;
    }
  }
  return MyComponent;
};

/**
 * Turns function from (state, payload) => state to (payload) => state
 * Maintains updated state between action calls
 * @param {*} storeObj
 * @returns
 */
export const transformStore = (createStore) => {
  return (initialState, props) => {
    const storeObj = createStore(undefined, props);
    // return () => {
      const { state, actions, selectors, toViewData } = storeObj;

      // Create a mutable reference to the current state
      let currentState = state;

      // Create action handlers that update the current state
      const transformedActions = Object.entries(actions).reduce(
        (acc, [key, actionFn]) => {
          acc[key] = (payload) => {
            // Apply the action and get the new state
            currentState = produce(currentState, (draft) => {
              return actionFn(draft, payload);
            });

            // Return the new state (useful for chaining)
            return currentState;
          };
          return acc;
        },
        {}
      );

      // Create selector functions that use the current state
      const transformedSelectors = Object.entries(selectors || {}).reduce(
        (acc, [key, selectorFn]) => {
          acc[key] = (...args) => selectorFn({
            state: currentState,
            props,
          }, ...args);
          return acc;
        },
        {}
      );

      // Return the store API with actions and selectors
      return {
        props,
        getState: () => currentState,
        state: currentState,
        toViewData: storeObj.toViewData,
        ...transformedActions,
        ...transformedSelectors,
      };
    // };
  };
};
