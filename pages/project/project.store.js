
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  project: 
    {
      id: "1",
      name: "Project",
      description: "Project 1 description",
      imageUrl: "/public/project_logo_placeholder.png"
    },
});

const toViewData = (state) => {
  return state;
}

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: {...initialState},
    actions: {
    },
    selectors: {
      toViewData,
    }
  };
};

export default transformStore(createStore());
