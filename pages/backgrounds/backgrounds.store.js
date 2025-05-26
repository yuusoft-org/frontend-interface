
import { transformStore } from "../../framework.js";

const INITIAL_STATE = Object.freeze({
  // items: [],
  // relationships: [],
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
  // items: [{
  //   id: 'awef',
  //   type: 'folder',
  //   label: 'Folder 1',
  //   children: [{
  //     id: 'awef2',
  //     type: 'file',
  //     label: 'File 1',
  //   }, {
  //     id: 'awef3',
  //     type: 'file',
  //     label: 'File 2',
  //   }, {
  //     id: 'folder2',
  //     type: 'folder',
  //     label: 'Folder 1-2',
  //     children: [{
  //       id: 'awef4',
  //       type: 'file',
  //       label: 'File 2',
  //     }, {
  //       id: 'awef5',
  //       type: 'file',
  //       label: 'File 3',
  //     }]
  //   }]
  // }, {
  //   id: 'awdfaeef3',
  //   type: 'folder',
  //   label: 'Folder 2',
  //   children: [{
  //     id: 'awef4',
  //     type: 'file',
  //     label: 'File 2',
  //   }]
  // }]
});

const addItem = (state, item) => {
  state.items.push(item)
}

const toViewData = ({ state, props }) => {
  return {
    // items: [],
    ...state,
    ...props
  };
}

const createStore = (initialState = INITIAL_STATE, props) => {
  return {
    props,
    state: {...initialState},
    actions: {
      addItem,
    },
    selectors: {
      toViewData,
    }
  };
};

export default transformStore(createStore);
