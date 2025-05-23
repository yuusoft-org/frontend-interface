
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  isDragging: false,
  selectedItemId: undefined,

  // -2 means no target drag index
  targetDragIndex: -2,

  itemRects: {},

  items: [{
    id: '1',
    name: 'Hello there',
    level: 0
  }, {
    id: '2',
    name: 'Wallo there',
    level: 0
  }, {
    id: '3',
    name: 'Ok there',
    level: 1,
  }, {
    id: '4',
    name: 'Ok there',
    level: 1,
  }, {
    id: '5',
    name: 'Ok there',
    level: 2,
  }]
});

const startDragging = (state, { id, itemRects }) => {
  state.isDragging = true;
  state.selectedItemId = id;
  state.itemRects = itemRects;
}

const stopDragging = (state) => {
  state.isDragging = false;
  state.selectedItemId = undefined;
  state.targetDragIndex = -2;
  state.itemRects = {};
}

const setTargetDragIndex = (state, index) => {
  state.targetDragIndex = index;
}

const selectTargetDragIndex = (state) => {
  return state.targetDragIndex;
}

const selectItemRects = (state) => {
  return state.itemRects;
}

const selectIsDragging = (state) => {
  return state.isDragging;
}

const selectSelectedItemId = (state) => {
  return state.selectedItemId;
}

const toViewData = (state) => {
  console.log('state', state)
  return state;
}

const createStore = (initialState = INITIAL_STATE) => {
  return {
    state: {...initialState},
    actions: {
      startDragging,
      stopDragging,
      setTargetDragIndex,
    },
    selectors: {
      toViewData,
      selectIsDragging,
      selectSelectedItemId,
      selectItemRects,
      selectTargetDragIndex,
    }
  };
};

export default transformStore(createStore());
