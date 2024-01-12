/**
 * A module that creates and returns React HTML that greets whomever is viewing the page and encourages them to explore the other pages
 * @module landing
 */

import { Container, Button, Nav, Spinner } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { loginUser } from "../../actions/authActions";
import axios from "axios";

/**
 * A function that lays out and returns a React component for the landing page
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The HTML for the React Component
 */
function Landing(props) {

  const [isLoading2, setLoading2] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenText, setScreenText] = useState({});

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      setLoggedIn(true);

      if(localStorage.getItem("translation") !== null){
        setScreenText(JSON.parse(localStorage.getItem("translation")))
        setLoading2(false);
      }else{
        translateText(props.auth.user.language);
      }
      
    } else {
      setLoggedIn(false);
    }
  }, [props.auth, props.auth.isAuthenticated]);

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 100,
  });

  const continueAsGuest = () => {
    const userData = {
      username: "guest",
      password: "guestPassword",
    };
    props.loginUser(userData);
  }

  const translateText = async (lang) => {
    console.log("translating");
    axios.get("/translator/translateText", {
      params: {
        screenText: Object.keys(props.auth.user.screenText),
        language: lang,
      }
    }).then((res) => {
      console.log(res.data);
      const translationData = res.data;
      console.log(translationData)
      localStorage.setItem("currentLanguage", lang);

      localStorage.setItem("translation", JSON.stringify(translationData) );
      window.location.reload();
      setLoading2(false);
    })
    
  }

  return (
    <div className="Landing">
      <Container>
        {!loggedIn ? (
          <React.Fragment>
            <br></br><br></br><br></br>
            <h2 className="display-8 text-center">
              Please <a href="/login">Log In</a> or <a href="/register">Register</a>!
            </h2>
            <br></br><br></br>
          </React.Fragment>
        ): (
          <React.Fragment>
            {isLoading2 ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" />
              </div>
            ):(
              <React.Fragment>
                <br></br><br></br><br></br>
                  <h2 className="display-3 text-center">
                    {screenText["Welcome to Panda Express"]} {props.auth.user.fname}!
                  </h2>
                  <br></br>
                  <h2 className="display-15 text-center">{screenText["Click 'Menu' above to start your order!"]}</h2>
                  <br></br>
                  <h2 className="display-15 text-center">{screenText["If you need any help, click 'Help' above"]}</h2>
              </React.Fragment>
            )}
          
          </React.Fragment>
        )}
        
      </Container>
    </div>
  );
}

Landing.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Landing);
