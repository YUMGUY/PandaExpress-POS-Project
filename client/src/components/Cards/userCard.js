/**
 * Module to create a React Card element that has a picture of the different items a user can order
 * @module userCard
 */

import { Card } from "react-bootstrap";
import './userCardStyle.css';

/**
 * A function that creates and return a React Card with an item that can be ordered
 * @param {Object} props - an Object containing the item name and an image
 * @returns A React Card element
 */
const UserCard = (props) => {

    return (
        <Card className="user-card" onClick={() => props.onClick(props.type)} >
            <Card.Img variant="top" src={props.image} />
            <Card.Title style={{textAlign: "center"}}>{props.title}</Card.Title>
            <Card.Text style={{textAlign: "center"}}>{props.text}</Card.Text>
        </Card>
    )
}

export default UserCard;
