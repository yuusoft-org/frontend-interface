import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  selectedStepId: undefined,
});


const setSelectedStepId = (state, selectedStepId) => {
  state.selectedStepId = selectedStepId;
}

const toViewData = ({ state, props }) => {
  return {
    steps: props.steps || [],
    selectedStepId: state.selectedStepId,
  }
}

const createStore = (initialState = INITIAL_STATE, props) => {
  return {
    props,
    state: {...initialState},
    actions: {
      setSelectedStepId,
    },
    selectors: {
      toViewData,
    }
  };
};

export default transformStore(createStore);
