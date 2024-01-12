/**
 * A module that creates a NavBar using React. Depending on what user role you have, the navbar will contain different links
 * @module NavBar
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Container, Navbar, Nav } from "react-bootstrap";
import logo from "./logo192.png";

/**
 * A function that lays out and returns a React component for the navbar
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The HTML for the React Component
 */
function NavBar(props) {
    // State Management
    const [loggedIn, setLoggedIn] = useState(false);
    const [manager, setManagerNav] = useState(false);
    const [cashier, setCashierNav] = useState(false);
    const [user, setUserNav] = useState(false);
    const [screenText, setScreenText] = useState({"Menu": "Menu", "Bag": "Bag", "Settings":"Settings", "Help":"Help", "Process Orders":"Process Orders"});

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
            setManagerNav(false);
            setCashierNav(false);
        }
        if (props.auth.user.role === "cashier") {
            setCashierNav(true);
            setUserNav(false);
            setManagerNav(false);
        }
        if (props.auth.user.role === "manager") {
            setManagerNav(true);
            setCashierNav(false);
            setUserNav(false);
        }
        if (props.auth.user.role === "user"){
            setUserNav(true);
            setManagerNav(false);
            setCashierNav(false);
        }

        if(localStorage.getItem("translation") != null){
            setScreenText(JSON.parse(localStorage.getItem("translation")));
        }else{
            setScreenText(props.auth.user.screenText);
        }        

    }, [props.auth, props.auth.isAuthenticated]);

    const onLogoutClick = (e) => {
        e.preventDefault();
        props.logoutUser();
        setLoggedIn(false);
    };

    return (
        <div className="Navbar shadow-sm">
            <Navbar collapseOnSelect expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img
                            alt="logo"
                            src={logo}
                            width="auto"
                            height="30"
                            className="d-inline-block align-top mr-2"
                        />
                        Panda Express POS
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                        {!cashier && !manager && !user &&
                        <React.Fragment>
                            {<Nav.Link href="/menu">Menu</Nav.Link>}
                            {<Nav.Link href="/findStore">Find Store</Nav.Link>}
                            {loggedIn && <Nav.Link href="/settings">Settings</Nav.Link>}
                        </React.Fragment>
                        }
                        {user && 
                        <React.Fragment>
                            {!loggedIn && <Nav.Link href="/menu">Menu</Nav.Link>}
                            {!loggedIn && <Nav.Link href="/findStore">Find Store</Nav.Link>}
                            {loggedIn && <Nav.Link href="/menu">{screenText["Menu"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/bag">{screenText["Bag"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/settings">{screenText["Settings"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/help">{screenText["Help"]}</Nav.Link>}
                        </React.Fragment>
                        }
                        {cashier &&
                        <React.Fragment>
                            {!loggedIn && <Nav.Link href="/menu">Menu</Nav.Link>}
                            {!loggedIn && <Nav.Link href="/findStore">Find Store</Nav.Link>}
                            {loggedIn && <Nav.Link href="/processOrders">{screenText["Process Orders"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/settings">{screenText["Settings"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/help">{screenText["Help"]}</Nav.Link>}
                        </React.Fragment>
                        }
                        {manager &&
                        <React.Fragment>
                            {!loggedIn && <Nav.Link href="/menu">Menu</Nav.Link>}
                            {!loggedIn && <Nav.Link href="/findStore">Find Store</Nav.Link>}
                            {loggedIn && <Nav.Link href="/processOrders">{screenText["Process Orders"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/adjustMenu">{screenText["Adjust Menu"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/addMenuItem">{screenText["Add Menu Item"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/reports">{screenText["Reports"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/settings">{screenText["Settings"]}</Nav.Link>}
                            {loggedIn && <Nav.Link href="/help">{screenText["Help"]}</Nav.Link>}
                        </React.Fragment>
                        }

                            
                        </Nav>
                        <Nav>
                            {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
                            {!loggedIn && <Nav.Link href="/register">Register</Nav.Link>}
                            {loggedIn && <Nav.Link onClick={onLogoutClick}>{screenText["Logout"]}</Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

NavBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(NavBar);
