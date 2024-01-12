/**
 * A module to switch the state of a user during authentication
 * @module authReducers
 */
import { SET_CURRENT_USER, USER_LOADING } from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
};

/**
 * A function to authenticate a users status when logged in
 * @param {Object} state - the default state of a user
 * @param {Object} action - the different types of actions a user go through
 * @returns Object with encrypted user data
 */
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
