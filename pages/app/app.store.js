import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  currentRoute: '/projects',
});

const selectShowSidebar = (state) => {
  const currentRoutePattern = selectCurrentRoutePattern(state);
  const routesWithNavBar = ["/projects/:projectId", "/projects/:projectId/resources"];
  console.log({
    currentRoutePattern,
    routesWithNavBar,
  })
  return routesWithNavBar.includes(currentRoutePattern);
}

const selectCurrentRoutePattern = (state) => {
  const routePatterms = ["/projects", "/projects/:projectId", "/projects/:projectId/resources"]
  const currentRoute = state.currentRoute;
  const matchPaths = (path, pattern) => {
    const pathParts = path.split('/');
    const patternParts = pattern.split('/');

    if (pathParts.length !== patternParts.length) {
      return false;
    }

    return pathParts.every((part, index) => {
      const patternPart = patternParts[index];
      // Check if the pattern part is a parameter (e.g., :id or {paramName})
      return patternPart === part || patternPart.startsWith(':');
    });
  }
  const routePattern = routePatterms.find(pattern => matchPaths(currentRoute, pattern));
  return routePattern;
}

const setCurrentRoute = (state, payload) => {
  state.currentRoute = payload;
  return state;
}

const toViewData = (state) => {
  return {
    ...state,
    currentRoutePattern: selectCurrentRoutePattern(state),
    showSidebar: selectShowSidebar(state),
  };
}

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: {
      ...initialState,
    },
    actions: {
      setCurrentRoute,
    },
    selectors: {
      toViewData,
      selectCurrentRoutePattern,
    }
  };
};

export default transformStore(createStore());
