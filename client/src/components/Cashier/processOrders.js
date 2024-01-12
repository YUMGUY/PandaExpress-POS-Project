/**
 * A module that returns React HTML for a page that cashiers and managers can use to process orders as customers come up to them in real time
 * @module processOrders
 */

import { Container, Button, Nav, FormFloating, Spinner } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItemCard from "../Cards/menuItemCard";
import OrderItemCard from "../Cards/orderItemCard";

/**
 * This function creates a page for cashiers and managers to use to process orders in real time.
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The html for the react component
 * 
 */
function Cashier(props) {
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [entrees, setEntrees] = useState([]);
  const [sides, setSides] = useState([]);
  const [appetizers, setAppetizers] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderHTML, setOrderHTML] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentTab, setCurrentTab] = useState("Plate Sizes");
  const employeeID = props.auth.user.id;
  const [screenText, setScreenText] = useState({});

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  useEffect(() => {

    if(localStorage.getItem("translation") != null){
      setScreenText(JSON.parse(localStorage.getItem("translation")));
    }else{
      setScreenText(props.auth.user.screenText);
    }

    axios.get("/menu/getAllMenuItems")
    .then((res) => {
      sortItems(res.data);
      setLoading(false);
    })
    .catch((err) => {console.log(err)});
  }, []);

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 100,
  });

  function addToOrder(item) {
    let tempOrder = order;

    tempOrder.push(item);
    setOrder(tempOrder);
    loadOrderHTML(order);
    console.log(order);
  }

  function removeFromOrder(item) {
    let tempOrder = order;

    tempOrder.every((orderItem, i) => {
      if (orderItem.name == item.name) {
        tempOrder.splice(i, 1);
        return false;
      }

      return true;
    });

    setOrder(tempOrder);
    loadOrderHTML(order);
    console.log(order);
  }

  function sortItems(menuData) {
    const tempEntrees = [];
    const tempSizes = [];
    const tempSides = [];
    const tempDrinks = [];
    const tempApps = [];

    menuData.forEach((item) => {
      let tempCard = <MenuItemCard key={item.item}
                        name={item.item}
                        cost={item.cost}
                        addToOrder={addToOrder}
                        removeFromOrder={removeFromOrder}
                      />

      if (item.item_type == "entree") {tempEntrees.push(tempCard);}
      else if (item.item_type == "size") {tempSizes.push(tempCard);}
      else if (item.item_type == "side") {tempSides.push(tempCard);}
      else if (item.item_type == "drink") {tempDrinks.push(tempCard);}
      else if (item.item_type == "appetizer") {tempApps.push(tempCard);}
    })
    
    setEntrees(tempEntrees);
    setDrinks(tempDrinks);
    setSizes(tempSizes);
    setSides(tempSides);
    setAppetizers(tempApps);
  }

  function loadOrderHTML(order) {
    let total = 0
    let orderHTML = []

    order.forEach((item) => {
      let tempCard = <OrderItemCard
                      name={item.name}
                      cost={item.cost}
                      removeFromOrder={removeFromOrder}
                    />
      total += item.cost;
      orderHTML.push(tempCard);
    })

    setTotal(total);
    setOrderHTML(orderHTML);
  }

  function loadCurrentTab(currentTab) {
    if (currentTab == "Plate Sizes") {return sizes;}
    else if (currentTab == "Sides") {return sides;}
    else if (currentTab == "Proteins") {return entrees;}
    else if (currentTab == "Appetizers") {return appetizers;}
    else if (currentTab == "Drinks") {return drinks;}
  }

  function submitOrder() {
    console.log(order);
    axios.post("/orders/submitOrderCashier", {
      params: {
        order: order,
        employeeID: employeeID
      }
    })
    .then((res) => {
      console.log(res.data);
      setOrder([]);
      window.location.reload();
    })
  }

  return (
    <div className="Cashier">
      {loading ? (
        <React.Fragment>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <br></br>
          <h2 className="display-8 text-center">{screenText["Process Orders"]}</h2>
          <div style={{width: 75 + "%", height: 75+"vh", float: "left", color: "#FFFFFF", textAlign: "center", backgroundColor: "#C02827", borderRadius: 7+"px", margin: 1+"%"}}>
            <div style={{width: 20 + "%", float: "left", paddingTop: 7+"%" }}>
              <Button style={{width: 70+"%", height: 10+"vh", borderRadius: 7+"px", margin: 2+"px"}} variant="dark" onClick={() => {setCurrentTab("Plate Sizes")}}>{screenText["Plate Sizes"]}</Button>
              <Button style={{width: 70+"%", height: 10+"vh", borderRadius: 7+"px", margin: 2+"px"}} variant="dark" onClick={() => {setCurrentTab("Sides")}}>{screenText["Sides"]}</Button>
              <Button style={{width: 70+"%", height: 10+"vh", borderRadius: 7+"px", margin: 2+"px"}} variant="dark" onClick={() => {setCurrentTab("Proteins")}}>{screenText["Proteins"]}</Button>
              <Button style={{width: 70+"%", height: 10+"vh", borderRadius: 7+"px", margin: 2+"px"}} variant="dark" onClick={() => {setCurrentTab("Appetizers")}}>{screenText["Appetizers"]}</Button>
              <Button style={{width: 70+"%", height: 10+"vh", borderRadius: 7+"px", margin: 2+"px"}} variant="dark" onClick={() => {setCurrentTab("Drinks")}}>{screenText["Drinks"]}</Button>
            </div>
            <div style={{width: 75 + "%", float: "left", textAlign: "center", backgroundColor: "#C02827", borderRadius: 7+"px", margin: 1+"%", overflow: "auto"}}>
              <h4 style={{paddingTop: 10+"px", color: "#FFFFFF", margin: 5+"px"}}className="text-center">{screenText[currentTab]}:</h4>
              <div style={{height: 60+"vh" , overflowY: "scroll"}}>{loadCurrentTab(currentTab)}</div>
            </div>
          </div>
          <div style={{width: 21 + "%", height: 75+"vh", float: "right", color: "#FFFFFF", backgroundColor: "#000000", borderRadius: 7+"px", margin: 1+"%"}}>
            <h4 style={{paddingTop: 10+"px"}} className="text-center">{screenText["Current Order"]}:</h4>
            <br></br>
            <div style={{height: 50+"vh", overflowY: "scroll", margin: 1+"%"}}>{orderHTML}</div>
            <br></br>
            <div>
              <h5 style={{float: "left", textAlign: "left", margin: 10+"px"}}>{screenText["Total"]}: {formatter.format(total)}</h5>
              <Button style={{float: "right", margin: 10+"px"}} variant="light" onClick={() => {submitOrder()}}>{screenText["Submit Order"]}</Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

Cashier.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Cashier);
