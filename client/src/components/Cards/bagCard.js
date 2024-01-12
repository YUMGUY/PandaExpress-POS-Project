/**
 * Module to create a card that displays items a user has added to their bag
 * @module bagCard
 */

import axios from "axios";
import { useReducer } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";
import popupMenu from "../User/menu"

/**
 * A function that creates and return a React Card element with an item's name, price, and any cascading elements
 * @param {Object} itemProps - the menu items name, price, and cascading elements
 * @returns A React Card element
 */
function bagCard(itemProps) {
  // this gets called every single time a bag is made
  const loopOrder = () => {
    const list = [];
    itemProps.item.forEach((i) => {
      list.push(i);
    })
    return list;
  }

  const foodItems = () => {
    let string = "";
    let j = 0;
    itemProps.item.forEach((i) => {
      if (j != 0) {   
        if (string === "") {
          string += i;
        }    
        else {
          string = string + ", " + i;
        }
        
        j++;
      }
      else {
        j++;
      }
      
    })
    return string;
  }

  const AddBagItem = (item) => {
    // just like remove bag item function
    axios.post("/users/addUserItem", {
      params: {
        fullOrder_semi: itemProps.fullOrder,
        bagItem: item,
        employeeID: itemProps.userid,
      }
    }).then((res) => {
      console.log(res.data);
      console.log("added item")
      window.location.reload();
    });
  }
  const removeBagItem = (item) => {
    axios.post("/users/removeUserItem", {
      params: {
        fullOrder_semi: itemProps.fullOrder,
        bagItem: item,
        employeeID: itemProps.userid,
      }

    }).then((res) => {
      console.log(res.data);
      console.log("removed item")
      window.location.reload();
    });
  }
  const getPrice = () => {
    let totalPrice = 0;
    itemProps.cost.forEach((p) => {
      if(p != ""){
        totalPrice += parseFloat(p);
      }
    })
    return totalPrice;
  }

  const ShowPopUpMenu = () => {
    console.log("Edit Bag Menu Opened")
  }

  return (
    <Card style={{ width: '50rem', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', marginBottom: '40px', justifyContent: 'center' }}>
        <Card.Body>
          <Card.Title  className = "display-10 text-center">{itemProps.name}</Card.Title>
          <Card.Subtitle style={{float: 'right'}}>${getPrice()}</Card.Subtitle>
          
          <Card.Text style={{fontSize: '20px', fontWeight: '500'}}>{(loopOrder()).at(0)}</Card.Text>  
          <Card.Text>{foodItems()}</Card.Text>
            
          <div style={{float: 'right'}}>
            {/* add a button to edit bowl/plate/bigger plate, and other menu items*/}

            {/* add a button to delete items */}
            <Button style={{marginRight: '10px'}} variant="primary" type="submit" onClick={() => removeBagItem(itemProps.item)}> - </Button>

            {/* add a button to add the item we selected */}
            <Button variant="primary" type="submit" onClick={() => AddBagItem(itemProps.item)}> + </Button>
          </div>
          

          
        </Card.Body>
    </Card>
  )
}

export default bagCard;