/**
 * A module that creates a React Card for each menu item passed in
 * @module MenuItem
 */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Spinner, Table, Card, Button, CardGroup, Modal } from "react-bootstrap";
import bowl from "./images/bowlnobg.png";
import plate from "./images/pandaPlate.png";
import eggroll from "./images/eggrolls.png";
import drinkImg from './images/drinks.png';
import bigger from './images/biggerplate.png';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import UserCard from '../Cards/userCard';


import axios from "axios";
import React from "react";

/**
 * A function that creates and returns a React Card element that a user can use to increment or decrement items they wish to add to their bag.
 * @param {Object} props - An Object with information about a menu item 
 * @returns {Object} - an Object with the react html for the card
 */
function MenuItem(props) {
    const [count, setCount] = useState(0);
    const [dis, setDisabled] = useState(false);

    const dec = () => {
        if (count - 1 > -1) {

            setCount(count - 1);
            props.function(props.current - 1);
            

            
        }
    }
    const inc = () => {
        
        setCount(count + 1);
        props.function(props.current + 1);
        setDisabled(props.current > props.max);
        props.setbag([...props.bag, props.item]);
        props.setprice([...props.price, props.itemPrice])
    }
    useEffect(() => {
        setDisabled((props.current >= props.max));
        console.log(props.bag);
      }, [props.current]);
    

    return (
        <div>
            <Card body>
                <div style={{float: 'left'}}>
                    {props.item}
                </div>
                <div style={{float: 'right', width: '100px'}}>
                    <Button onClick={() => dec()} style={{marginRight: '10px'}}>
                        -
                    </Button>
                    
                    {count}
                    
                    
                    <Button onClick={() => inc()} disabled={dis} style={{marginLeft: '10px'}}>
                        +
                    </Button>
                </div>
                
            </Card>
        </div>
    );
}

MenuItem.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(MenuItem);
