/**
 * @file PrivateCashierRoute.js - a file that restricts anyone below cashier from being able to access certain pages
 */

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 * A definition for a route that only cashiers or managers can use
 * Object
 */
const PrivateCashierRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated === true &&
      (auth.user.role === "manager" || auth.user.role === "cashier") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

PrivateCashierRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateCashierRoute);
