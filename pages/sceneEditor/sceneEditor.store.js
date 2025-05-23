
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
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
