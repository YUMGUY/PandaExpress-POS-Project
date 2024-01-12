/**
 * A Module that creates a React component for managers to use to create new menu items in the database
 * @module addMenuItem
 */

import { Container, Button, Nav, CardGroup, Card, Spinner, Form, Table, Row, Col, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * A function that organizes and returns the React component that is used to create new menu items
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The html for the react component
 */
function AddMenuItem(props){
    const [isLoading, setLoading] = useState([]);
    
    const [itemName, setItemName] = useState("Default");
    const [itemPrice, setItemPrice] = useState(0);
    const [itemStock, setItemStock] = useState(0);
    const [itemType, setItemType] = useState("entree");
    const [screenText, setScreenText] = useState({});
    
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

    const createItem = () => {
        axios.post("/menu/createItem", {
            params: {
                itemName: itemName,
                itemPrice: itemPrice,
                itemStock: itemStock,
                itemType: itemType,
            }
        }).then((res) => {
            window.location.reload();
        });
    };

    useEffect(() => {
        if(localStorage.getItem("translation") != null){
            setScreenText(JSON.parse(localStorage.getItem("translation")));
          }else{
            setScreenText(props.auth.user.screenText);
          }
        setLoading(false);
    }, [props.auth.user.id]);
  
    return (
        <div className="Reports">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <React.Fragment>
                <br></br>
                <h2 className="display-8 text-center">{screenText["Item Creator"]}</h2>
                <br></br>
                <fieldset class="form-group">
                    <form style={{width: 50+"%", float: "left"}}>
                        <div class="form-group row">
                            <label for="itemName" class="col-sm-2 col-form-label" align="right">{screenText["Item Name"]}:</label>
                            <div class="col-sm-3">
                                <input type="itemName" class="form-control" id="itemName" placeholder={screenText["Enter Item Name"]}
                                onChange={(e) => setItemName(e.target.value)}
                                >
                                </input>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="itemPrice" class="col-sm-2 col-form-label" align="right">{screenText["Price"]}:</label>
                            <div class="col-sm-3">
                                <input type="itemPrice" class="form-control" id="itemPrice" placeholder={screenText["Enter Item Price"]}
                                onChange={(e) => setItemPrice(e.target.value)}
                                >
                                </input>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="itemStock" class="col-sm-2 col-form-label" align="right">{screenText["Stock"]}:</label>
                            <div class="col-sm-3">
                                <input type="itemStock" class="form-control" id="itemStock" placeholder={screenText["Enter Item Stock"]}
                                onChange={(e) => setItemStock(e.target.value)}
                                >
                                </input>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="inputPassword3" class="col-sm-2 col-form-label" align="right">{screenText["Item Type"]}:</label>
                            <div class="col-sm-3">
                                <Form.Select
                                aria-label={screenText["Item Type"]}
                                value={itemType}
                                onChange={(e) => {
                                setItemType(e.target.value);
                                }}
                                >
                                    <option value="entree">Entree</option>
                                    <option value="appetizer">Appetizer</option>
                                    <option value="side">Side</option>
                                    <option value="drink">Drink</option>
                                    <option value="size">Size</option>
                                </Form.Select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-sm-3" align="center">
                                <button type="submit" class="btn btn-primary" onClick={() => createItem()}>{screenText["Create"]}</button>
                            </div>
                        </div>
                    </form>
                </fieldset>
            </React.Fragment>
        )
      }
      </div>
      );
  
  
  }
  
AddMenuItem.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  
  export default connect(mapStateToProps)(AddMenuItem);