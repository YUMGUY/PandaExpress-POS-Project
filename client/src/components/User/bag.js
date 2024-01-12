/**
 * A module that keeps track of a user's current order and displays all items in a React component. Allows users to edit their order or submit their order to the database.
 * @module bag
 */
import { Container, Button, Nav, CardGroup, Card, Spinner, Alert } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BagItemCard from "../Cards/bagCard";
import { useHistory } from "react-router-dom";

/**
 * A function that creates and returns a react component for the user bag. Employes the bagCard module to give each item its own React Card.
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The html for the react component
 */
function Bag(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState([]);
  const [bagEmpty, setBagEmpty] = useState(false);
  const [userCurrentOrder, setUserCurrentOrder] = useState([]);
  const [total, setTotal] = useState(0.0);
  const [screenText, setScreenText] = useState({});
  const [message, setMessage] = useState();


  useEffect(() => {

    if(localStorage.getItem("translation") != null){
      setScreenText(JSON.parse(localStorage.getItem("translation")));
    }else{
      setScreenText(props.auth.user.screenText);
    }

    axios.get("/users/getCurrentOrder", {
      params: {
        userID: props.auth.user.id
      }
    }).then((res) => {
      console.log(res.data);
      if(res.data.current_order === ""){
        setLoading(false);
        setBagEmpty(true);
        return;
      }
      const currentOrder = res.data.current_order.split(", ");
      
      const currentOrderPrice = res.data.current_order_price.split(", ");
      console.log(currentOrder);
      console.log(currentOrderPrice);
      const list = [];
      for(let k = 0; k < currentOrder.length; k++){
        const temp = {name: currentOrder[k], cost: currentOrderPrice[k]};
        console.log(temp);
        list.push(temp);
      }
      setUserCurrentOrder(list);

      setLoading(false);
    });

  }, []);
  useEffect(async () => {
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
     
 });

  function AddItemsToBag() {
    const list = [];
    //console.log(userCurrentOrder);
    for(let i = 0; i < userCurrentOrder.length; ++i) {

      const listOfItems = userCurrentOrder.at(i).name.split("; ");
      const listOfPrices = userCurrentOrder.at(i).cost.split("; ");
      //console.log(listOfItems);
      // console.log(listOfPrices);
      let bagItem = <BagItemCard key = {listOfItems[0]}
                                  fullOrder = {userCurrentOrder.at(i).name} // passes in the name with semi colons
                                  item = {listOfItems}
                                  cost = {listOfPrices}
                                  userid = {props.auth.user.id} // now call
                                  />
        
      list.push(bagItem);

      
    }
    return list;
  }
  
  function submitBagOrder() { // ADD CHECK where user cannot submit order without having at least 1 item in the bag

    if(userCurrentOrder.length == 0) {
      console.log("Cannot submit an empty bag");
      setMessage("Cannot submit an empty bag")
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return
    }
    axios.post("/orders/submitOrder", {
      params: {
        order: userCurrentOrder,
        employeeID: props.auth.user.id,
      }
    })
    .then((res) => {
      // empty bag in the website
      setUserCurrentOrder([])
      console.log(res.data)
      history.push("/menu", {message: "Successfully submitted order! Wait next to the pickup counter to get your food!", variant:"success"});

    })    
  }


  return (
  
      <div className="Bag">
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <React.Fragment>
            {bagEmpty ? (
              <React.Fragment>
                <h2 className="display-2 text-center">{screenText["Your Bag is Empty!"]}</h2>
                {message && (
                  <React.Fragment>
                    <Alert className="text-center" variant="danger">
                      {message}
                    </Alert>
                    <br></br>
                  </React.Fragment>
                )}
              </React.Fragment>
            ): (
              <React.Fragment>
                <h2 className="display-2 text-center"> {screenText["Your Order"]} </h2>
                
              <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                {AddItemsToBag()}
              </div>
              
              
            </React.Fragment>
            )}
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          </React.Fragment>
      )
    }
    <div style={{position: 'fixed', bottom: '0', width: '100%'}}>
                <Card>
                    <div style={{padding: '20px',}}>
                        <Card.Text style={{float:'right'}}>
                            <div style={{textAlign: 'center', justifyContent: 'center'}}>
                                <div style={{marginRight: '25px', display: 'inline-block', fontSize: '20px'}}>
                                    {screenText["Total"]}: ${total}
                                </div>
                                <div style={{display: 'inline-block'}}>
                                    <Button variant="primary" type="submit" onClick={() => submitBagOrder()}>{screenText["Submit Order"]}</Button>
                                </div>
                            </div>
                            
                        </Card.Text>
                        
                    </div>
                </Card>
            </div>
    </div>
    );


}


Bag.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Bag);