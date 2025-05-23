import { Subject } from "rxjs";

/**
 * A custom subject that can be used to dispatch actions and subscribe to them
 * You can think of this as a bus for all frontend events and communication
 *
 * Example:
 * const subject = new CustomSubject();
 *
 * const subscription = subject.subscribe(({ action, payload }) => {
 *   console.log(action, payload);
 * });
 *
 * subject.dispatch("action", { payload: "payload" });
 *
 * subscription.unsubscribe();
 */
export class CustomSubject {
  _subject = new Subject();
  pipe = (...args) => {
    return this._subject.pipe(...args);
  };
  dispatch = (action, payload) => {
    this._subject.next({
      action,
      payload: payload || {},
    });
  };
  dispatchCall = (action, payload) => {
    return () => this.dispatch(action, payload || {});
  };
}

const getQueryParamsObject = () => {
  const queryParams = new URLSearchParams(window.location.search + "");
  const paramsObject = {};

  for (const [key, value] of queryParams.entries()) {
    paramsObject[key] = value;
  }

  return paramsObject;
};

class LayoutOptions {
  constructor(params) {
    this._isTouchLayout = params?.isTouchLayout || false;
  }

  get isTouchLayout() {
    return this._isTouchLayout;
  }

  setIsTouchLayout = (isTouchLayout) => {
    this._isTouchLayout = isTouchLayout;
  };
}

const matchPaths = (path, pattern) => {
  // Normalize paths by removing trailing slashes
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const normalizedPattern = pattern.endsWith("/") ? pattern.slice(0, -1) : pattern;

  // Convert pattern segments with parameters like [id] to regex patterns
  const regexPattern = normalizedPattern
    .split("/")
    .map((segment) => {
      // Check if segment is a parameter (enclosed in square brackets)
      if (segment.startsWith("[") && segment.endsWith("]")) {
        // Extract parameter name and create a capturing group
        return "([^/]+)";
      }
      // Regular segment, match exactly
      return segment;
    })
    .join("/");

  // Create regex with start and end anchors
  const regex = new RegExp(`^${regexPattern}$`);

  // Test if path matches the pattern
  return regex.test(normalizedPath);
};

export class SsrRouter {
  _getPathName;

  constructor({ routes, html, getPathname }) {
    this._getPathName = getPathname;
  }

  getPathName = () => this._getPathName();

  getCurrentRouteOptions = () => {
    return {
      hideNav: true,
    };
  };

  renderCurrentRoute = () => {
    return null;
  };
}

export class WebRouter {
  // _routes;
  routerType = "web";

  // getCurrentRouteOptions = () => {
  //   const route =
  //     this._routes.find(
  //       (route) => matchPaths(this.getPathName(), route.path) || route.path === this.getPathName()
  //     ) || this._routes[0];
  //   return route;
  // };

  // renderCurrentRoute = ({ isTouchLayout }) => {
  //   const route =
  //     this._routes.find(
  //       (route) => matchPaths(this.getPathName(), route.path) || route.path === this.getPathName()
  //     ) || this._routes[0];
  //   return this._html`
  //     ${route?.uhtml({
  //       isTouchLayout,
  //     })}
  //   `;
  // };

  getPathName = () => {
    return window.location.pathname;
  };

  getPayload = () => {
    return getQueryParamsObject();
  };

  setPayload = (payload) => {
    // update query params without reloading the page
    const newQueryParams = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      newQueryParams.set(key, value);
    });
    if (newQueryParams.toString()) {
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${newQueryParams.toString()}`
      );
    } else {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  redirect = (path, payload) => {
    let finalPath = path;
    if (payload) {
      let qs = "";
      if (payload) {
        qs = `?${new URLSearchParams(payload).toString()}`;
      }
      finalPath = `${path}${qs}`;
    }
    window.history.pushState({}, "", finalPath);
  };

  replace = (path, payload) => {
    let finalPath = path;
    if (payload) {
      let qs = "";
      if (payload) {
        qs = `?${new URLSearchParams(payload).toString()}`;
      }
      finalPath = `${path}${qs}`;
    }
    window.history.replaceState({}, "", finalPath);
  };

  back = () => {
    window.history.back();
  };

  get stack() {
    return [];
  }
}

export class NativeRouter {
  routerType = "native";
  _routes;
  _html;

  constructor({ initialPath = "/", routes, html }) {
    this._routes = routes({ html });
    this._html = html;
    this._stack = [
      {
        path: initialPath,
        payload: {},
      },
    ];
  }

  renderCurrentRoute = ({ isTouchLayout }) => {
    const frames = this.stack.map(({ path, payload }, index) => {
      const foundRoute = this._routes.find(
        (route) => matchPaths(path, route.path) || route.path === path
      );
      return this._html`
        ${
          index !== 0
            ? this._html`<style>
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px); /* Small upward motion */
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .fade-in {
                animation: fadeIn 0.2s ease-out;
              }
            </style>`
            : null
        }
        <rtgl-view class="fade-in" bgc="su" pos="fix" top="0" left="0" w="100vw" h="100vh">
          ${foundRoute?.uhtml({
            isTouchLayout,
          })}
        </rtgl-view>
      `;
    });
    return frames;
  };

  getPathName = () => {
    return this._stack[this._stack.length - 1].path;
  };

  getPayload = () => {
    return this._stack[this._stack.length - 1].payload;
  };

  setPayload = (payload) => {
    this._stack[this._stack.length - 1].payload = payload;
  };

  redirect = (path, payload = {}, reset) => {
    if (reset) {
      this._stack = [
        {
          path,
          payload,
        },
      ];
      return;
    }
    this._stack.push({
      path,
      payload,
    });
  };

  replace = (path, payload = {}, reset) => {
    if (reset) {
      this._stack = [
        {
          path,
          payload,
        },
      ];
      return;
    }
    this._stack[this._stack.length - 1] = {
      path,
      payload,
    };
  };

  back = () => {
    if (this._stack.length === 1) {
      return;
    }
    this._stack.pop();
  };

  get stack() {
    return this._stack;
  }
}

export const createClientWebDepdendencies = ({
  httpClient,
  render,
  html,
  globalStore,
  platform,
  router,
  ...rest
}) => {
  const dependencies = {
    isSsr: false,
    ssrMap: new Map(Object.entries(window.__SSR_DATA__ || {})),
    subject: new CustomSubject(),
    httpClient,
    // BaseElement: createWebComponentBaseElement({ render }),
    render,
    html,
    getPathName: () => window.location.pathname,
    getWindow: () => window,
    globalStore,
    layoutOptions: new LayoutOptions({ isTouchLayout: window.innerWidth < 768 }),
    router,
    platform,
    env: window.env,
    ...rest
  };
  return dependencies;
};

class Request {
  _authToken;

  constructor(baseUrl, authToken, headers) {
    this._baseUrl = baseUrl;
    this._authToken = authToken;
    this._headers = headers;
  }

  setAuthToken(token) {
    this._authToken = token;
  }

  async request(name, payload, options) {
    const headers = {
      "Content-Type": "application/json",
      ...this._headers,
    };
    if (this._authToken) {
      headers.Authorization = `Bearer ${this._authToken}`;
    }

    const response = await fetch(`${this._baseUrl}/${name}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
      credentials: options?.includeCredentials ? "include" : undefined,
    });

    return response.json();
  }
}

/**
 * @typedef {Object} ApiEndpointConfig
 * @property {boolean} [includeCredentials] - Whether to include credentials in the request
 */

/**
 * Creates an HTTP client with a flexible JSON configuration.
 * The generated client provides typed methods for each API endpoint based on the configuration.
 *
 * @param {Object} config - The client configuration
 * @param {string} config.baseUrl - Base URL for all API requests
 * @param {Object} [config.headers={}] - Default headers for all requests
 * @param {Object.<string, Object.<string, ApiEndpointConfig>>} [config.apis={}] - API configuration object
 * @returns {Object} The configured HTTP client with API methods
 */
export function createHttpClient(config) {
  const { baseUrl, apis = {}, headers = {} } = config;
  const requests = new Map();

  const httpClient = {};

  // Create request instances and client structure from configuration
  Object.entries(apis).forEach(([apiName, endpoints]) => {
    const apiBaseUrl = `${baseUrl}/${apiName}`;
    const request = new Request(apiBaseUrl, undefined, headers);
    requests.set(apiName, request);

    // Create API namespace on the client
    httpClient[apiName] = {};

    // Create methods for each endpoint
    Object.entries(endpoints).forEach(([endpointName, options]) => {
      httpClient[apiName][endpointName] = (body) => {
        return request.request(endpointName, body, options);
      };
    });
  });

  // Add setAuthToken method to the client
  httpClient.setAuthToken = (token) => {
    for (const request of requests.values()) {
      request.setAuthToken(token);
    }
  };

  return httpClient;
}
