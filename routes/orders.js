/**
 * Order routes module. This module creates a router that can be used to connect to our database and interact with any data pertaining to orders.
 * @module orders
 */

const express = require("express");

/**
 * A secure connection to the database
 * Object
 * @type {{connectionString: string}}
 */
const { pool } = require("../dbInstance");

/**
 * function to get and set database information relative to orders
 * @returns {Object} different methods to view and change the database
 */
const router = express.Router();

/**
 * function to submit an order to the database for a user
 * @param {string} order - a string containing all order items
 * @param {number} employeeID - a number representing the employee who processed the order
 * @param {number} userID - a number representing the user placing the order
 * @returns {Object} A message object with a success message
 */
router.post("/submitOrder", async (req, res) => {
  const order = req.body.params.order;
  const employeeID = req.body.params.employeeID;
  const userID = req.body.params.employeeID // should be 0 for guest

  if (order.length == 0) {return console.log("Nothing in Order");}

  let totalPrice = 0;
  let allItems = "";
  let allPrices = "";
  let stockTracker = [];

  order.forEach((orderItem, i) => {
    // formatting sql strings
    if (i < order.length - 1) {
      allItems += orderItem.name + ", ";
      allPrices += orderItem.cost + ", ";
    }
    else {
      allItems += orderItem.name;
      allPrices += orderItem.cost;
    }
    if(orderItem.cost.includes(";")){
      const tempList = orderItem.cost.split("; ");
      tempList.forEach((p) => {
        if(p != ""){
          totalPrice += parseFloat(p);
        }
        
      })
    }else{  
      totalPrice += parseFloat(orderItem.cost);
    }
    

    // tracking stock quantities
    if (stockTracker.every((item) => {
      if (item.name == orderItem.name) {
        item.quantity += 1;
        return false;
      }
      return true;
    })
    ) {
      stockTracker.push({
        name: orderItem.name,
        quantity: 1,
      });
    }
  });

  // getting local time
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  var localDateString = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);

  let orderNo = (await pool.query("SELECT MAX(order_number) FROM orders")).rows[0].max + 1;
  
  // Submitting Order
  let submitOrderCmd = "INSERT INTO orders (order_number, date, items, prices, total_price, employee_id) VALUES ";
  let orderValues = "(" + orderNo + ", DATE '" + localDateString + "', '" + allItems + "', '" + allPrices + "', " + totalPrice + ", " + employeeID + ")";
  await pool.query(submitOrderCmd + orderValues, (err, result) => {
    if (err) {
      return console.log('Error executing query', err.stack)
    }
    res.status(200).json({ message: "Successfully Submitted Order!" });
  })

  
  // Updating stock values
  async function updateStock(item) {
    await pool.query("UPDATE menu_items SET stock = stock - " + item.quantity + " WHERE item = '" + item.name + "'");
  }

  stockTracker.forEach((item) => {
    updateStock(item);
  })

  // update values for the user in the database
  emptyBag(userID);
})

/**
 * function to submit an order to the database for a cashier
 * @param {string} order - a string containing all order items
 * @param {number} employeeID - a number representing the employee who processed the order
 * @param {number} userID - a number representing the user placing the order
 * @returns {Object} A message object with a success message
 */
router.post("/submitOrderCashier", async (req, res) => {
  const order = req.body.params.order;
  const employeeID = req.body.params.employeeID;
  const userID = req.body.params.employeeID // should be 0 for guest

  if (order.length == 0) {return console.log("Nothing in Order");}

  let totalPrice = 0;
  let allItems = "";
  let allPrices = "";
  let stockTracker = [];

  order.forEach((orderItem, i) => {
    // formatting sql strings
    if (i < order.length - 1) {
      allItems += orderItem.name + ", ";
      allPrices += orderItem.cost + ", ";
    }
    else {
      allItems += orderItem.name;
      allPrices += orderItem.cost;
    }
    totalPrice += orderItem.cost;

    // tracking stock quantities
    if (stockTracker.every((item) => {
      if (item.name == orderItem.name) {
        item.quantity += 1;
        return false;
      }
      return true;
    })
    ) {
      stockTracker.push({
        name: orderItem.name,
        quantity: 1,
      });
    }
  });

  // getting local time
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  var localDateString = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);

  let orderNo = (await pool.query("SELECT MAX(order_number) FROM orders")).rows[0].max + 1;
  
  // Submitting Order
  let submitOrderCmd = "INSERT INTO orders (order_number, date, items, prices, total_price, employee_id) VALUES ";
  let orderValues = "(" + orderNo + ", DATE '" + localDateString + "', '" + allItems + "', '" + allPrices + "', " + totalPrice + ", " + employeeID + ")";
  await pool.query(submitOrderCmd + orderValues, (err) => {
    if (err) {
      return console.log('Error executing query', err.stack)
    }
    res.status(200).json({ message: "Successfully Submitted Order!" });
  })

  
  // Updating stock values
  async function updateStock(item) {
    await pool.query("UPDATE menu_items SET stock = stock - " + item.quantity + " WHERE item = '" + item.name + "'");
  }

  stockTracker.forEach((item) => {
    updateStock(item);
  })

  // update values for the user in the database
  emptyBag(userID);
})


/**
 * function to add an item to a user bag
 * @param {string} order - a string containing all order items
 * @param {number} userID - a number representing the user placing the order
 * @param {number} price - the price of the item being added to the bag
 * @returns {Object} An object with the updated user bag
 */
router.post("/SubmitToBag", async (req, res) => {
  const order = req.body.params.order;
  const userID = req.body.params.employeeID;
  const price = req.body.params.price;
  let newData;
  let newPrice;

  const oldData = (await pool.query("SELECT current_order from users WHERE userid=" + userID)).rows[0].current_order;
  const oldPrice = (await pool.query("SELECT current_order_price from users WHERE userid=" + userID)).rows[0].current_order_price;
  console.log(oldData); 
  if(oldData === "") {
    newData = order;
    newPrice = price;
  }
  else {
    newData = oldData + ", " + order;
    newPrice = oldPrice + ", " + price;
  }
  
  console.log(newData);
  console.log(newPrice)

  pool.query("UPDATE users SET current_order=" + "'" + newData + "', current_order_price='" + newPrice + "' WHERE userid=" + userID, (err, result) => {
    if(err) {
      return console.log(err);
    }
  });
})

function emptyBag(userID_) {
  console.log("For user " + userID_ + ": bag is emptied");
  pool.query(`UPDATE users SET current_order_price = 0 WHERE userid = ${userID_}`, (err, result) => {
    if(err) {
      return console.log(err);
    }
  });

  pool.query(`UPDATE users SET current_order = '' WHERE userid = ${userID_}`, (err, result) => {
    if(err) {
      return console.log(err);
    }
   
  });
  return
}

router.get("/getOrderPrice", async (req, res) => {
  const userID = req.query.userID;
  pool.query(`SELECT current_order_price FROM users WHERE userid='${userID}'`, (err, result) => {
      if (err) {
          return console.log('Error executing query', err.stack)
      }

      res.json(result.rows[0]);
  });
});

module.exports = router;