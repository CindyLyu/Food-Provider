import * as ActionTypes from '../actionTypes';

const state = {
  activeItem: '',
};

const navbar = (globalState = state, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_ACTIVE_ITEM:
      return {
        ...globalState,
        activeItem: action.activeItem,
      };
    default:
      return globalState;
  }
};

export default navbar;
