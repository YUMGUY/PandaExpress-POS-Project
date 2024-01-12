/**
 * A module to determine if there are errors withing the state
 * @module errorReducers
 */
import { GET_ERRORS } from "../actions/types";

const initialState = {};

/**
 * A function to detect and return any errors
 * @param {Object} state - a user's default state 
 * @param {Object} action - an Object of with the erros 
 * @returns Encrypted user data
 */
export default function errorReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
