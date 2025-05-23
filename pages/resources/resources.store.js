
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  assets: [{
    label: 'Background'
  }, {
    label: 'CG',
  }, {
    label: 'Character'
  }, {
    label: 'Bacgkround Music'
  }, {
    label: 'Sound Effects'
  }, {
    label: 'Animation Effects'
  }, {
    label: 'Positions'
  }, {
    label: 'Visuals'
  }, {
    label: 'Videos'
  }],
  ui: [{
    label: 'Design Tokens',
  }, {
    label: 'Components'
  }, {
    label: 'Screens'
  }, {
    label: 'Choices'
  }, {
    label: 'Dialogue'
  }],
  system: [{
    label: 'Variables'
  }, {
    label: 'Presets'
  }]
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
