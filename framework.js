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

export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.renderTarget = document.createElement("div");
    this.renderTarget.style.cssText = "display: contents;";

    this.transformedHandlers = {};
  }

  store;
  template;
  handlers;
  transformedHandlers = {};
  refs;
  patch;
  _unmountCallback;
  _oldVNode;
  // globalStore;
  deps;

  get viewData() {
    return this.store.toViewData(this.deps.globalStore);
  }

  connectedCallback() {
    if (!this.renderTarget.parentNode) {
      this.appendChild(this.renderTarget);
    }
    this.style.display = "contents";

    // const deps = {
    //   render: this.render,
    //   store: this.store,
    // }

    // TODO don't include onmount, subscriptions, etc in transformedHandlers
    Object.keys(this.handlers || {}).forEach((key) => {
      this.transformedHandlers[key] = (payload) => {
        const result = this.handlers[key](payload, this.deps);
        // this.render();
        return result;
      };
    });

    if (this.handlers?.subscriptions) {
      this.unsubscribeAll = subscribeAll(
        this.handlers.subscriptions(this.deps)
      );
    }

    if (this.handlers?.handleOnMount) {
      this._unmountCallback = this.handlers?.handleOnMount(this.deps);
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
        this.transformedHandlers
      );
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
  { handlers, template, createStore, refs, patch },
  deps
  // { globalStore, subject, httpClient, BaseComponent }
) => {
  class MyComponent extends BaseComponent {
    constructor() {
      super();
      this.store = createStore();
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
export const transformStore = (storeObj) => {
  return () => {
    const { state: initialState, actions, selectors } = storeObj;

    // Create a mutable reference to the current state
    let currentState = initialState;

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
        acc[key] = (...args) => selectorFn(currentState, ...args);
        return acc;
      },
      {}
    );

    // Return the store API with actions and selectors
    return {
      ...transformedActions,
      ...transformedSelectors,
    };
  };
};
