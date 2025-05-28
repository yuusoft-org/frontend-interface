import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  items: [
    {
      id: "1",
      label: "Text",
      icon: "text",
      mode: "text",
    },
    {
      id: "2",
      label: "Background",
      icon: "background",
      mode: "background",
    },
  ],
});

const toViewData = ({ state }) => {
  return {
    items: state.items,
  };
};

const selectItems = ({ state }) => {
  return state.items;
};

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: { ...initialState },
    actions: {},
    selectors: {
      toViewData,
      selectItems,
    },
  };
};

export default transformStore(createStore);
