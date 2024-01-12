/**
 * A module to combine all reducers
 * @module indexReducers
 */
import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";

/**
 * An Object with each reducer
 * Object
 */
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
});
