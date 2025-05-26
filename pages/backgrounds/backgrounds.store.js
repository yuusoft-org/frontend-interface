
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  items: []
});

const addItem = (state, item) => {
  state.items.push(item)
}

const setItems = (state, items) => {
  state.items = items
}

const toViewData = ({ state, props }) => {
  return {
    items: state.items,
  };
}

const createStore = (initialState = INITIAL_STATE, props) => {
  return {
    props,
    state: {...initialState},
    actions: {
      addItem,
      setItems,
    },
    selectors: {
      toViewData,
    }
  };
};

export default transformStore(createStore);
