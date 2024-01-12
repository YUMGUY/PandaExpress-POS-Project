/**
 * Module to create a card that displays items generate in a manager sells together report
 * @module reportItemCard
 */

import { Container, Button, Card } from "react-bootstrap";

/**
 * A function that creates and return a React Card with an item and all other items that have sold with it given a time period
 * @param {Object} itemProps - an Object containing the item and all items that have been sold with it given a time period
 * @returns A React Card element
 */
function ReportItemCard(itemProps) {
  return (
    <Card style={{width: 90+"%", margin: 3+"%", color: "#000000"}}>
        <Card.Body>
            <Card.Title style={{}}>{itemProps.name}</Card.Title>
            <Card.Text style={{margin: 0+"%"}}>{itemProps.detail}</Card.Text>
        </Card.Body>
    </Card>
  )
}

export default ReportItemCard;