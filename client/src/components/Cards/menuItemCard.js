/**
 * Module to create a card that displays items a user can add to their bag
 * @module menuItemCard
 */

import { Container, Button, Card } from "react-bootstrap";

/**
 * A function that creates and return a React Card element with an item's name, price, and any cascading elements
 * @param {Object} itemProps - the menu items name, price, and cascading elements
 * @returns A React Card element
 */
function MenuItemCard(itemProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  return (
    <Card style={{ width: 31+"%", margin: 1+"%", textAlign: "center", float: "left", color: "#000000"}}>
        <Card.Body>
          <Card.Title style={{height: 3+"em"}}>{itemProps.name}</Card.Title>
          <Card.Subtitle style={{}}>{formatter.format(itemProps.cost)}</Card.Subtitle>
          <Button style={{width: 100+"%", float: "left", marginTop: 5+"%", borderRadius: 7+"px"}} variant="dark" onClick={() => itemProps.addToOrder(itemProps)}>+</Button>
        </Card.Body>
    </Card>
  )
}

export default MenuItemCard;