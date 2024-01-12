/**
 * Module to create a card that displays items a cashier has added to the receipt
 * @module orderItemCard
 */

import { Container, Button, Card } from "react-bootstrap";

/**
 * A function that creates and return a React Card element with an item's name, price, and a button to remove the item
 * @param {Object} itemProps - the menu items name, price
 * @returns A React Card element
 */
function OrderItemCard(itemProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  return (
    <Card style={{width: 90+"%", margin: 3+"%", color: "#000000"}}>
        <Card.Body>
          <div style={{width: 50+"%", float: "left", margin: 1+"%", borderRadius: 7+"px", textAlign: "left"}}>
            <Card.Title style={{}}>{itemProps.name}</Card.Title>
            <Card.Subtitle style={{}}>{formatter.format(itemProps.cost)}</Card.Subtitle>
          </div>
          <Button style={{width: 45+"%", float: "right", margin: 1+"%", borderRadius: 7+"px"}} variant="danger" onClick={() => itemProps.removeFromOrder(itemProps)}>X</Button>
        </Card.Body>
    </Card>
  )
}

export default OrderItemCard;