/**
 * Module to create a card that displays items needed to be restocked
 * @module restockReportCard
 */

import { Card } from "react-bootstrap";


/**
 * A function that creates and return a React Card with an item that needs to be restocked
 * @param {Object} itemProps - an Object containing the item and how many more of that item remain in stock
 * @returns A React Card element
 */
function RestockReportCard(itemProps) {
  let num = 0.25;

  return (
    <Card style={{width: 90+"%", margin: 3+"%", color: "#000000"}}>
        <Card.Body>
            <Card.Title style={{}}>{itemProps.item}</Card.Title>
            <Card.Text style={{fontWeight: "bold", margin: num+"%"}}>Percent of Stock Sold: {itemProps.percent}%</Card.Text>
            <Card.Text style={{fontWeight: "bold", margin: num+"%"}}>Stock Remaining: {itemProps.stock}</Card.Text>
        </Card.Body>
    </Card>
  )
}

export default RestockReportCard;