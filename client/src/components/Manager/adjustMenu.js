/**
 * A Module that creates a React component for managers to use to update menu items price and stock or delete menu items.
 * @module adjustMenu
 */

import { Container, Button, Nav, Spinner } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdjustableMenuItemCard from "../Cards/adjustableMenuItemCard";

/**
 * A function that organizes and returns the React component that is used to update menu items
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The html for the react component
 */
function Manager(props) {
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [entrees, setEntrees] = useState([]);
  const [sides, setSides] = useState([]);
  const [appetizers, setAppetizers] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [screenText, setScreenText] = useState({});


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

  function sortItems(menuData) {
    const tempEntrees = [];
    const tempSizes = [];
    const tempSides = [];
    const tempDrinks = [];
    const tempApps = [];

    menuData.forEach((item) => {
      let tempCard = <AdjustableMenuItemCard key={item.item}
                        name={item.item}
                        cost={item.cost}
                        amount={item.stock}
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

  return (
    <div className="Manager">
      {loading ? (
        <React.Fragment>
        <br></br>
        <div className="d-flex justify-content-center">
            <Spinner animation="border" />
        </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Container>
                <h2 className="display-8 text-center">
                    <br></br>
                    {screenText["Adjust Menu"]}
                </h2>
          </Container>
          <br></br>
          <br></br>
          <h4 className="text-center">{screenText["Sizes"]}:</h4>
          <div className="card-columns">{sizes}</div>
          <br></br><br></br>
          <h4 className="text-center">{screenText["Sides"]}:</h4>
          <div className="card-columns">{sides}</div>
          <br></br><br></br>
          <h4 className="text-center">{screenText["Entrees"]}:</h4>
          <div className="card-columns">{entrees}</div>
          <br></br><br></br>
          <h4 className="text-center">{screenText["Appetizers"]}:</h4>
          <div className="card-columns">{appetizers}</div>
          <br></br><br></br>
          <h4 className="text-center">{screenText["Drinks"]}:</h4>
          <div className="card-columns">{drinks}</div>
          <br></br><br></br>
        </React.Fragment>
      )}
    </div>
  );
}

Manager.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Manager);
