/**
 * Module to create a card that displays items generate in a manager sales report
 * @module OrderReportCard
 */

import { Card } from "react-bootstrap";

/**
 * A function that creates and return a React Card with an order, its total price, and who created the order
 * @param {Object} itemProps - an Object containing the items sold, price, and employee id of who processed the order
 * @returns A React Card element
 */
function OrderReportCard(itemProps) {
  let num = 0.25;

  return (
    <Card style={{width: 90+"%", margin: 3+"%", color: "#000000"}}>
        <Card.Body>
            <Card.Title style={{}}>{itemProps.title}</Card.Title>
            <Card.Text style={{fontWeight: "bold", margin: num+"%"}}>Items: </Card.Text>
            <Card.Text style={{margin: num+"%"}}>{itemProps.items}</Card.Text>
            <Card.Text style={{fontWeight: "bold", margin: num+"%"}}>Total: </Card.Text>
            <Card.Text style={{margin: num+"%"}}>{itemProps.total}</Card.Text>
            <Card.Text style={{fontWeight: "bold", margin: num+"%"}}>Order Created By: {itemProps.soldBy}</Card.Text>
        </Card.Body>
    </Card>
  )
}

export default OrderReportCard;