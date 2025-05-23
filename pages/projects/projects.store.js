
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  title: "Projects",
  createButtonText: "Create Project",
  projects: [
    {
      id: "1",
      name: "Project 1",
      description: "Project 1 description",
    },
    {
      id: '2',
      name: 'Project 2',
      description: 'Project 2 description'
    }
  ],
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
