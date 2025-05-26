import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  assets: [
    {
      id: "background",
      label: "Background",
      route: "/projects/:projectId/backgrounds",
    },
    {
      id: "cg",
      label: "CG",
      route: "/projects/:projectId/cgs",
    },
    {
      id: "character",
      label: "Character",
    },
    {
      id: "background-music",
      label: "Bacgkround Music",
    },
    {
      id: "sound-effects",
      label: "Sound Effects",
    },
    {
      id: "animation-effects",
      label: "Animation Effects",
    },
    {
      id: "positions",
      label: "Positions",
    },
    {
      id: "visuals",
      label: "Visuals",
    },
    {
      id: "videos",
      label: "Videos",
    },
  ],
  ui: [
    {
      id: "design-tokens",
      label: "Design Tokens",
    },
    {
      id: "components",
      label: "Components",
    },
    {
      id: "screens",
      label: "Screens",
    },
    {
      id: "choices",
      label: "Choices",
    },
    {
      id: "dialogue",
      label: "Dialogue",
    },
  ],
  system: [
    {
      id: "variables",
      label: "Variables",
    },
    {
      id: "presets",
      label: "Presets",
    },
  ],
});

const selectResourceRoute = (state, resourceId, projectId) => {
  const resources = state.assets.concat(state.ui).concat(state.system);
  const resource = resources.find((resource) => resource.id === resourceId);
  if (!resource) {
    throw new Error(`Resource ${resourceId} not found`);
  }
  return resource.route.replace(":projectId", projectId);
};

const toViewData = ({ state }) => {
  return state;
};

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: { ...initialState },
    actions: {},
    selectors: {
      toViewData,
      selectResourceRoute,
    },
  };
};

export default transformStore(createStore);
