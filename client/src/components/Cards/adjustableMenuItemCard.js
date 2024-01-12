/**
 * Module to create a card that can adjust items on our menu
 * @module adjustableMenuItemCard
 */
import { Container, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * A function that creates and return a React Card element with an item's price, stock, and update fields for each
 * @param {Object} props - An Object with all relevant information about a menu item
 * @returns React Card element
 */
function AdjustableMenuItemCard(props) {

  const [itemPrice, newPrice] = useState(0);
  const [itemStock, newStock] = useState(0);

  const updatePrice = () => {
    axios.post("/menu/updatePrice", {
      params: {
        price: itemPrice,
        name: props.name,
      }
    })
    .then((res) => {
      // console.log(res.data)
      window.location.reload();
    })
  }

  const updateStock = () => {
    axios.post("/menu/updateStock", {
      params: {
        stock: itemStock,
        name: props.name,
      }
    })
    .then((res) => {
      // console.log(res.data)
      window.location.reload();
    })
  }

  const removeItem = () => {
    axios.post("/menu/removeItem", {
      params: {
        itemToRemove: props.name
      }
    })
    .then((res) => {
      window.location.reload();
    })
  }

    return (
  <div className="AdjustableMenuItemCard">
      <Container>
        <Card
          border={"success"}
          style={{ borderWidth: "5px" }}
          className="p-2 m-2 rounded shadow"
        >
          <Card.Body>
            <Card.Title>{props.name}</Card.Title>
            <br></br>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">$</span>
              </div>
              <input type="text" class="form-control" placeholder={props.cost} id="cost" aria-describedby="basic-addon1" onChange={(e) => newPrice(e.target.value)}>
              </input>
              <div class="input-group-append">
                <Button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => updatePrice()}>Update</Button>
              </div>
            </div>
            <br></br>

            <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Amount</span>
                </div>
              <input type="text" class="form-control" placeholder={props.amount} aria-describedby="basic-addon1" onChange={(e) => newStock(e.target.value)}>
              </input>
              <div class="input-group-append">
                <Button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => updateStock()}>Update</Button>
              </div>
            </div>
            <br></br>

            <div class="input-group-append">
                <Button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => removeItem()}>Remove Item</Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default AdjustableMenuItemCard;