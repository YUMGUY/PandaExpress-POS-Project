/**
 * Creates functions that authenticate a user to the application
 * @module authActions
 */

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// Register User
/**
 * Dispatches a payload to the database that regisers a user
 * @param {Object} userData - an Object containing encrypted user data 
 * @param {Object} history - an Object that redirects the users window
 * @returns void
 */
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/users/register", userData)
    .then((res) => history.push("/login")) // re-direct to login on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Login - get user token
/**
 * Takes in user login information and matches it against saved encrypted data to authenticate a user to the application. Sets tokens and cookies being used in the program
 * @param {Object} userData - an object containing a user's encrypted login information
 * @returns void
 */
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/users/login", userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      // console.log(res);
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);
      
      if(decoded.language === "English"){
        localStorage.setItem("currentLanguage", "English");
        localStorage.setItem("translation", JSON.stringify(decoded.screenText));
      }
      

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Set logged in user
/**
 * A function to set the current user in their token
 * @param {Object} decoded - decrypted information relative to setting the user
 * @returns void
 */
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading
/**
 * A function to set a user to loading
 * @returns void
 */
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

// Log user out
/**
 * A function to remove all cookies and tokens from the browser
 * @returns void
 */
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("translation");
  localStorage.removeItem("currentLanguage");

  // Remove auth header for future requests
  setAuthToken(false);

  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
