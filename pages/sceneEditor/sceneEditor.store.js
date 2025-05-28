
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  currentSteps: [],
  selectedStepId: undefined,
  currentInstructions: [{
    id: '1',
    instructions: {
      presentationInstructions: {},
    }
  }],
  mode: 'steps-editor',
});

const setCurrentSteps = (state, steps) => {  
  state.currentSteps = steps
}

const setSelectedStepId = (state, selectedStepId) => {
  state.selectedStepId = selectedStepId;
}

const setMode = (state, mode) => {
  state.mode = mode;
}

const toViewData = ({ state }) => {
  const currentStep = selectSelectedStep({ state })
  return {
    currentSteps: state.currentSteps,
    currentInstructions: state.currentInstructions,
    currentStep: currentStep,
    background: currentStep?.presentation?.background,
    mode: state.mode,
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

const selectSelectedStep = ({ state }) => {
  return state.currentSteps.find(step => step.id === state.selectedStepId);
}

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: {...initialState},
    actions: {
      setCurrentSteps,
      setSelectedStepId,
      setMode,
    },
    selectors: {
      toViewData,
      selectStepIdIndex,
      selectPreviousStepId,
      selectNextStepId,
      selectSelectedStep,
    }
  };
};

export default transformStore(createStore);
