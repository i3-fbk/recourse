// reducers.js
import { combineReducers } from "redux";
import { UPDATE_INPUT_VALUE } from "../action/action";
import { UPDATE_SCALER_VALUE } from "../action/action";
import { SAVE_USER_ID } from "../action/action";
import { SAVE_USER_INFORMATION } from "../action/action";

const initialState = {
  inputValue: "",
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      return { ...state, inputValue: action.payload };
    case UPDATE_SCALER_VALUE:
      return { ...state, scalerValue: action.payload };
    case SAVE_USER_ID:
      return { ...state, id: action.payload };
    case SAVE_USER_INFORMATION:
      return { ...state, initData: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  rootReducer,
});
