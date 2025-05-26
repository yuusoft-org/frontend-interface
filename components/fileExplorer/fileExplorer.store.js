
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  isDragging: false,
  selectedItemId: undefined,

  // -2 means no target drag index
  targetDragIndex: -2,
  itemRects: {},
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
  console.log('setTargetDragIndex, state', state.targetDragIndex)
}

const selectTargetDragIndex = ({ state, props }) => {
  return state.targetDragIndex;
}

const selectItemRects = ({ state, props }) => {
  return state.itemRects;
}

const selectIsDragging = ({ state, props }) => {
  return state.isDragging;
}

const selectSelectedItemId = ({ state, props }) => {
  return state.selectedItemId;
}

const toViewData = ({ state, props}) => {
  return {
    ...state,
    items: props.items || []
  };
}

const createStore = (initialState = INITIAL_STATE, props) => {
  return {
    props,
    state: {...initialState},
    toViewData,
    actions: {
      startDragging,
      stopDragging,
      setTargetDragIndex,
    },
    selectors: {
      selectIsDragging,
      selectSelectedItemId,
      selectItemRects,
      selectTargetDragIndex,
    }
  };
};

export default transformStore(createStore);
