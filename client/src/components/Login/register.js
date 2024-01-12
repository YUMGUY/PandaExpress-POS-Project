/**
 * A module that creates and returns a React component that users use to register for an account.
 * @module Register
 */

import { useState, useEffect } from "react";
import { useHistory, Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import classnames from "classnames";

/**
 * A function that formats and returns a React component for people to use as they register for their accounts.
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The html for the react component
 */
function Register(props) {
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      history.push("/");
    }
  }, [history, props.auth, props.auth.isAuthenticated]);

  useEffect(() => {
    setError(props.errors);
  }, [props.errors]);

  const onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      fname: fname,
      lname: lname,
      email: email,
      username: username,
      password: password,
      password2: password2,
    };
    props.registerUser(newUser, history);
  };

  return (
    <div className="Register">
      <Container>
        <h2 className="display-2 text-center">Register</h2>
        <Form noValidate onSubmit={onSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>First name</b>
                </Form.Label>
                <Form.Control
                  onChange={(e) => setfName(e.target.value)}
                  required
                  value={fname}
                  isInvalid={error.name}
                  id="fname"
                  type="text"
                  className={classnames("", {
                    invalid: error.name,
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {error.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>Last name</b>
                </Form.Label>
                <Form.Control
                  onChange={(e) => setlName(e.target.value)}
                  required
                  value={lname}
                  isInvalid={error.name}
                  id="lname"
                  type="text"
                  className={classnames("", {
                    invalid: error.name,
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {error.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Email Address</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              isInvalid={!!error.registerEmail}
              id="email"
              type="email"
              className={classnames("", {
                invalid: error.registerEmail,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerEmail}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Username</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setUsername(e.target.value)}
              required
              value={username}
              isInvalid={!!error.registerUsername}
              id="username"
              type="text"
              className={classnames("", {
                invalid: error.registerUsername,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerUsername}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Password</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              isInvalid={error.registerPassword}
              id="password"
              type="password"
              className={classnames("", {
                invalid: error.registerPassword,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Confirm Password</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setPassword2(e.target.value)}
              value={password2}
              isInvalid={error.registerPassword2}
              id="password2"
              type="password"
              className={classnames("", {
                invalid: error.registerPassword2,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerPassword2}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <div className="text-center">
          <p className="fs-5">
            Already have an account? <Link to="/login">Login here!</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
