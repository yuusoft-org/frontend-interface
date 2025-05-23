import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  items: [
    {
      title: "Project",
      slug: "/projects/projectid",
    },
    {
      title: "Resources",
      slug: "/projects/projectid/resources",
    },
    {
      title: "Scenes",
      slug: "/projects/projectid/scenes",
    },
    {
      title: "Settings",
      slug: "/projects",
    },
  ],
});

const toViewData = (state) => {
  return {
    ...state,
    itemsEncoded: encodeURIComponent(JSON.stringify(state.items)),
  };
};

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: { ...initialState },
    actions: {
    },
    selectors: {
      toViewData,
    },
  };
};

export default transformStore(createStore());
