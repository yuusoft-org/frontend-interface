import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  currentRoute: "/projects",
});

const selectShowSidebar = ({ state, props }) => {
  const currentRoutePattern = selectCurrentRoutePattern({ state, props });
  const routesWithNavBar = [
    "/projects/:projectId",
    "/projects/:projectId/resources",
    "/projects/:projectId/cgs",
    "/projects/:projectId/backgrounds",
    "/projects/:projectId/scenes",
    "/projects/:projectId/scenes/:sceneId/editor",
  ];
  console.log({
    currentRoutePattern,
    routesWithNavBar,
  });
  return routesWithNavBar.includes(currentRoutePattern);
};

const selectCurrentRoutePattern = ({ state, props }) => {
  const routePatterms = [
    "/projects",
    "/projects/:projectId",
    "/projects/:projectId/resources",
    "/projects/:projectId/cgs",
    "/projects/:projectId/backgrounds",
    "/projects/:projectId/scenes",
    "/projects/:projectId/scenes/:sceneId/editor",
  ];
  const currentRoute = state.currentRoute;
  const matchPaths = (path, pattern) => {
    const pathParts = path.split("/");
    const patternParts = pattern.split("/");

    if (pathParts.length !== patternParts.length) {
      return false;
    }

    return pathParts.every((part, index) => {
      const patternPart = patternParts[index];
      // Check if the pattern part is a parameter (e.g., :id or {paramName})
      return patternPart === part || patternPart.startsWith(":");
    });
  };
  const routePattern = routePatterms.find((pattern) =>
    matchPaths(currentRoute, pattern)
  );
  return routePattern;
};

const setCurrentRoute = (state, payload) => {
  state.currentRoute = payload;
  return state;
};

const toViewData = ({ state, props }) => {
  return {
    ...state,
    currentRoutePattern: selectCurrentRoutePattern({ state, props }),
    showSidebar: selectShowSidebar({ state, props }),
  };
};

const createStore = (initialState = INITIAL_STATE, props) => {
  return {
    props,
    state: {
      ...initialState,
    },
    actions: {
      setCurrentRoute,
    },
    selectors: {
      toViewData,
      selectCurrentRoutePattern,
    },
  };
};

export default transformStore(createStore);
