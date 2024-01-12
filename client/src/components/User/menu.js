/**
 * A module that creates a React component which visualizes all the different items a user can order. The component allows users to select items to add to their bag for checkout.
 * @module UserMenu
 */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Spinner, Card, Button, CardGroup, Modal, Alert } from "react-bootstrap";
import bowl from "./images/bowlnobg.png";
import plate from "./images/pandaPlate.png";
import eggroll from "./images/eggrollsnobg.png";
import drinkImg from './images/drinksnobg.png';
import bigger from './images/biggerplate.png';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import UserCard from '../Cards/userCard';
import MenuItem from './menuItem';
import { useHistory } from "react-router-dom";

import axios from "axios";
import React from "react";

/**
 * A function that creates the React component using menuItemCards. Each card is selectable and can be used to add a menu item to the user's bag.
 * @param {Object} props - decoded user payload information
 * @returns {Object} - the html for the React Component
 */
function Menu(props) {
    const history = useHistory();
    const [tempEntrees, setTempEntrees] = useState([]);
    const [tempSize, setTempSize] = useState("");
    const [tempSides, setTempSides] = useState([]);
    const [tempDrinks, setTempDrinks] = useState([]);
    const [tempApps, setTempApps] = useState([]);
    
    const [show, setShow] = useState(false);

    const [isLoading, setLoading] = useState(true);
    const [sides, setSides] = useState([]);
    const [entrees, setEntrees] = useState([]);
    const [title, setTitle] = useState("N/A");
    const [drinks, setDrinks] = useState([]);
    const [appetizers, setAppetizers] = useState([]);
    
    const [numAllowed, setNumAllowed] = useState(0);

    // new version
    const [entreecount, setEntreeCount] = useState(0);
    const [drinkcount, setDrinkCount] = useState(0);
    const [appcount, setAppCount] = useState(0);
    const [sidecount, setSideCount] = useState(0);
    const [entreePrice, setEntreePrice] = useState([]);
    const [drinkPrice, setDrinkPrice] = useState([]);
    const [sidePrice, setSidePrice] = useState([]);
    const [appPrice, setAppPrice] = useState([]);
    const [sizePrice, setSizePrice] = useState("");
    const [loggedIn, setLogin] = useState(false);

    const [screenText, setScreenText] = useState({});

    let list = [];
    const [message, setMessage] = useState("");
    const [total, setTotal] = useState(0.0);
    const [canOrder, setCanOrder] = useState(false);

    const handleClose = () => {
        setShow(false);
        setNumAllowed(0);
        setEntreeCount(0);
        setDrinkCount(0);
        setAppCount(0);
        setSideCount(0);
        setTempSides([]);
        setTempEntrees([]);
        setTempSize("");
        setTempDrinks([]);
        setTempApps([]);
        setEntreePrice([]);
        setDrinkPrice([]);
        setAppPrice([]);
        setSidePrice([]);
        setSizePrice("");
    }

    const Submit = () => {
        let drink = (tempDrinks.join(', ') === "" ? "" : tempDrinks.join(', '))
        let app = (tempApps.join(', ') === "" ? "" : tempApps.join(', ')) 
        let entree = (tempSize === "" ? "" : tempSize) + (tempEntrees.join('; ') === "" ? "" : "; " + tempEntrees.join('; ')) + (tempSides.join('; ') === "" ? "" : "; " + tempSides.join('; '))
        let order = (entree === "" ? "" : entree) + (app === "" ? "" : app) + (drink === "" ? "" : drink)
        let price = (sizePrice === "" ? "" : sizePrice) + (entreePrice.join('; ') === "" ? "" : "; " + entreePrice.join('; ')) + (sidePrice.join('; ') === "" ? "" : "; " + sidePrice.join('; ')) + (appPrice.join(', ') === "" ? "" : appPrice.join(', ')) + (drinkPrice.join(', ') === "" ? "" : drinkPrice.join(', '));

        axios.post("/orders/SubmitToBag", {
            params: {
              order: order,
              price: price,
              employeeID: props.auth.user.id
            }
          })
          .then((res) => {
            setOrder([]);
          })
        order = ""; 
        setMessage({message: tempSize + " has been added to order.", variant:"success"})
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        handleClose();
    }

    const openModal = (type) => {
        
        setTitle(type);
        if (type === screenText["Bowl"]) {
            setNumAllowed(1);
            setTempSize("Bowl");
            setSizePrice("7.5");
        }
        else if (type === screenText["Plate"]) {

            setNumAllowed(2);
            setTempSize("Plate");
            setSizePrice("9");
        }
        else if (type === screenText["Bigger Plate"]) {
            setNumAllowed(3);
            setTempSize("Bigger Plate");
            setSizePrice("10.5");
        }
        else {
            setSizePrice("");
        }
        
        setShow(true);
    }

    const names = [
        {title: screenText["Bowl"], text: screenText["1 side & 1 entree"], image: bowl, link: "/mainCourse"}, 
        {title: screenText["Plate"], text: screenText["1 side & 2 entrees"], image: plate, link: "/mainCourse"}, 
        {title: screenText["Bigger Plate"], text: screenText["1 side & 3 entrees"], image: bigger, link: "/mainCourse"},
        {title: screenText["Drinks"], text: screenText["Add a drink"], image: drinkImg, link: "", type: 1},
        {title: screenText["Appetizers"], text: screenText["Start your meal with something small"], image: eggroll, link: ""},
    ]

    useEffect(() => {
        if(history.location.state){
            if(history.location.state.message){
              setMessage({
                message: history.location.state.message,
                variant: history.location.state.variant,
              })
              setTimeout(() => {
                setMessage(null);
                history.replace(location.state, {});
              }, 6500);
            }
          }

        if(localStorage.getItem("translation") != null){
            setScreenText(JSON.parse(localStorage.getItem("translation")));
        }else{
            if(props.auth.user.screenText){
                setScreenText(props.auth.user.screenText);
            }else{
                setScreenText({"Menu":"Menu", "Bowl":"Bowl", "1 side & 1 entree":"1 side & 1 entree", "Plate":"Plate",
                               "1 side & 2 entrees":"1 side & 2 entrees", "Bigger Plate":"Bigger Plate", "1 side & 3 entrees":"1 side & 3 entrees",
                               "Drinks":"Drinks", "Add a drink":"Add a drink", "Appetizers":"Appetizers",
                               "Start your meal with something small":"Start your meal with something small", "Choose a Side":"Choose a Side", 
                               "Choose":"Choose", "Entrees":"Entrees", "Cancel":"Cancel", "Add to Bag":"Add to Bag", "Total":"Total", "Go to Bag":"Go to Bag"  });
            }
            
        } 
        
        axios.get("/menu/getSides").then(res => {
            setSides(res.data);
        });
        axios.get("/menu/getEntrees").then(res => {
            setEntrees(res.data);
        });
        axios.get("/menu/getDrinks").then(res => {
            setDrinks(res.data);
        });
        axios.get("/menu/getAppetizer").then(res => {
            setAppetizers(res.data);
        })
        if (props.auth.user.id > 0) {
            setLogin(true);
            if(props.auth.user.role !== "online-user"){
                setCanOrder(true);
            }
        }
        else {
            setLogin(false);
            setCanOrder(false);
        }
        
        setLoading(false);
    }, [props.auth.user.id]);

    useEffect(async () => {
        if(props.auth.user.role === "user"){
            await axios.get("/orders/getOrderPrice", {params:{userID: props.auth.user.id}}).then(res => {
                    let price = res.data.current_order_price.split(", ");
                    let totalPrice = 0;
                    price.forEach((p) => {
                        if (p != "") {
                            totalPrice += parseFloat(p);
                        }
                    })
                    setTotal(totalPrice);
                }) 
        }
        
    });

    

    return (
        <div className="Menu">
            
            {message && (
                <React.Fragment>
                    <Alert className="text-center" variant={message.variant}>
                    {message.message}
                    </Alert>
                    <br></br>
                </React.Fragment>
            )}
            <Container>
                {
                    isLoading
                        ? (
                            <div className="d-flex justify-content-center">
                                <Spinner animation="border" />
                            </div>
                        )
                        : (
                            <React.Fragment>
                                {(!props.auth.user.role || props.auth.user.role === "online-user") && 
                                    <React.Fragment>
                                        <br></br>
                                        <Alert className="text-center" variant="danger">{"Online ordering is not currently supported, please come in to place an order!"}</Alert>
                                    </React.Fragment>
                                }
                                
                                <h2 className="display-4 text-center">
                                    {screenText["Menu"]}
                                </h2>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                    <Modal.Title>{title}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            
                                            {numAllowed == 0 ? (
                                                null
                                            ) : (
                                                <React.Fragment>
                                                    <Form.Label>{screenText["Choose a Side"]}</Form.Label>
                                                    {sides.map((obj, idx) => (
                                                        <MenuItem key={idx} item={obj.item} max={2} current={sidecount} function={setSideCount} setbag={setTempSides} bag={tempSides}  setprice={setSidePrice} price={sidePrice} itemPrice={obj.cost}/>
                                                    ))}
                                                    <Form.Label>{screenText["Choose"]} {numAllowed} {screenText["Entrees"]}</Form.Label>
                                                    {entrees.map((obj, idx) => (
                                                        <MenuItem key={idx} item={obj.item} max={numAllowed} current={entreecount} function={setEntreeCount} setbag={setTempEntrees} bag={tempEntrees} setprice={setEntreePrice} price={entreePrice} itemPrice={obj.cost}/>
                                                    ))}
                                                </React.Fragment>
                                            )}
                                            {title == screenText["Drinks"] ? (
                                                <>
                                                    <Form.Label>{screenText["Choose a Drink"]}</Form.Label>
                                                    {drinks.map((obj, idx) => (
                                                        <MenuItem key={idx} item={obj.item} max={999} current={drinkcount} function={setDrinkCount} setbag={setTempDrinks} bag={tempDrinks} setprice={setDrinkPrice} price={drinkPrice} itemPrice={obj.cost}/>
                                                    ))}
                                                </>
                                            ) : (null)}
                                            {title == screenText["Appetizers"] ? (
                                                <>
                                                    <Form.Label>{screenText["Choose an Appetizer"]}</Form.Label>
                                                    {appetizers.map((obj, idx) => (
                                                        <MenuItem key={idx} item={obj.item} max={999} current={appcount} function={setAppCount} setbag={setTempApps} bag={tempApps} setprice={setAppPrice} price={appPrice} itemPrice={obj.cost}/>
                                                    ))}
                                                </>
                                            ) : (null)}
                                            
                                                                                       
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        {screenText["Cancel"]}
                                    </Button>
                                    <Button disabled={!canOrder} type="submit" variant="primary" onClick={Submit}>
                                        {screenText["Add to Bag"]}
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Row xs={1} md={3} className="g-4">
                                    {names.map((obj, idx) => (
                                        <Col>
                                            <UserCard key={idx} onClick={openModal} type={obj.title} title={obj.title} text={obj.text} image={obj.image} />
                                        </Col>
                                    ))}
                                </Row>
                                <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                            </React.Fragment>
                        )
                }
                
            </Container>

            {props.auth.user.role === "user" &&
                <div style={{position: 'fixed', bottom: '0', width: '100%'}}>
                    <Card>
                        <div style={{padding: '20px',}}>
                            <Card.Text style={{float:'right'}}>
                                <div style={{textAlign: 'center', justifyContent: 'center'}}>
                                    <div style={{marginRight: '25px', display: 'inline-block', fontSize: '20px'}}>
                                        {screenText["Total"]}: ${total}
                                    </div>
                                    <div style={{display: 'inline-block'}}>
                                        <Button href="/Bag">{screenText["Go to Bag"]}</Button>
                                    </div>
                                </div>
                                
                            </Card.Text>
                            
                        </div>
                    </Card>
                </div>
            }
            
        </div>
    );
}

Menu.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Menu);
