
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  currentSteps: [],
  currentInstructions: [{
    id: '1',
    instructions: {
      presentationInstructions: {},
    }
  }]
});

const setCurrentSteps = (state, steps) => {  
  state.currentSteps = steps
}

const toViewData = ({ state }) => {
  console.log('state.currentSteps', state.currentSteps)
  return {
    currentSteps: state.currentSteps,
    currentInstructions: state.currentInstructions
  };
}

const selectStepIdIndex = ({ state }, stepId) => {
  return state.currentSteps.findIndex(step => step.id === stepId);
}

const selectPreviousStepId = ({ state }, stepId) => {
  const stepIndex = state.currentSteps.findIndex(step => step.id === stepId);
  if (stepIndex === 0) {
    return stepId;
  }
  return state.currentSteps[stepIndex - 1]?.id;
}

const selectNextStepId = ({ state }, stepId) => {
  const stepIndex = state.currentSteps.findIndex(step => step.id === stepId);
  if (stepIndex === state.currentSteps.length - 1) {
    return stepId;
  }
  return state.currentSteps[stepIndex + 1]?.id;
}

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: {...initialState},
    actions: {
      setCurrentSteps
    },
    selectors: {
      toViewData,
      selectStepIdIndex,
      selectPreviousStepId,
      selectNextStepId,
    }
  };
};

export default transformStore(createStore);
