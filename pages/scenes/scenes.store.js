
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
});

const toViewData = ({ state }) => {
  return state;
}

const createStore = (initialState = INITIAL_STATE, props) => {
  return {
    state: {...INITIAL_STATE},
    props,
    actions: {
    },
    selectors: {
      toViewData,
    }
  };
};

export default transformStore(createStore);
