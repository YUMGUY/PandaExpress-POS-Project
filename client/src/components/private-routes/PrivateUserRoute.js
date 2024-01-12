/**
 * @file PrivateUserRoute.js - a file that restricts anyone below user from being able to access certain pages
 */

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 * A definition for a route that only users, cashiers, and managers can use
 * Object
 */
const PrivateUserRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated === true && (auth.user.role === "user" || auth.user.role === "cashier" || auth.user.role === "manager") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

PrivateUserRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateUserRoute);
