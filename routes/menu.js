/**
 * Menu routes module. This module creates a router that can be used to connect to our database and interact with any data pertaining to menu items.
 * @module menu
 */
const express = require("express");

/**
 * function to get and set database information relative to menu items
 * @returns {Object} different methods to view and change the database
 */
const router = express.Router();

/**
 * A secure connection to the database
 * Object
 * @type {{connectionString: string}}
 */
const { pool } = require("../dbInstance");


/**
 * function to get all menu items from the database
 * @returns {list} - An array of objects containing each menu item and its price.
 */
router.get("/getAllMenuItems", async (req, res) => {
    pool.query("SELECT * FROM menu_items", (err, result) => {
        if(err) {
            return console.log('Error executing query', err.stack)
        }

        res.json(result.rows);
    });
});

/**
 * function to get all menu items with type 'entree'
 * @returns {list} - An array of objects containing each menu item and its price.
 */
router.get("/getEntrees", async (req, res) => {
    pool.query("SELECT * FROM menu_items WHERE item_type='entree'", (err, result) => {
        if (err) {
            return console.log('Error executing query', err.stack)
        }

        res.json(result.rows);
    });
});

/**
 * function to get all menu items with type 'side'
 * @returns {list} - An array of objects containing each menu item and its price.
 */
router.get("/getSides", async (req, res) => {
    pool.query("SELECT * FROM menu_items WHERE item_type='side'", (err, result) => {
        if (err) {
            return console.log('Error executing query', err.stack)
        }

        res.json(result.rows);
    });
});

/**
 * function to get all menu items with type 'drink'
 * @returns {list} - An array of objects containing each menu item and its price.
 */
router.get("/getDrinks", async (req, res) => {
    pool.query("SELECT * FROM menu_items WHERE item_type='drink'", (err, result) => {
        if (err) {
            return console.log('Error executing query', err.stack)
        }

        res.json(result.rows);
    });
});

/**
 * function to get all menu items with type 'appetizer'
 * @returns {list} - An array of objects containing each menu item and its price.
 */
router.get("/getAppetizer", async (req, res) => {
    pool.query("SELECT * FROM menu_items WHERE item_type='appetizer'", (err, result) => {
        if (err) {
            return console.log('Error executing query', err.stack)
        }

        res.json(result.rows);
    });
});

/**
 * function to update the stock of a given item in the database'
 * @param {number} stock - the new stock of the item
 * @param {string} name - the name of the item to be updated
 * @returns {Object} - a message object containing a success message
 */
router.post("/updateStock", async (req, res) => {
    //console.log(req.body);
    pool.query("UPDATE menu_items SET stock = " + req.body.params.stock + "WHERE item='" + req.body.params.name + "'", (err) => {
        if(err) {
            return console.log('Error executing query', err.stack)
          }
          res.status(200).json({message: "Successfully updated price!"});
    })
});

/**
 * function to update the price of a given item in the database'
 * @param {number} price - the new price of the item
 * @param {string} name - the name of the item to be updated
 * @returns {Object} - a message object containing a success message
 */
router.post("/updatePrice", async (req, res) => {
    //console.log(req.body);
    pool.query("UPDATE menu_items SET cost = " + req.body.params.price + "WHERE item='" + req.body.params.name + "'", (err) => {
        if(err) {
            return console.log('Error executing query', err.stack)
          }
          res.status(200).json({message: "Successfully updated price!"});
    })
});

/**
 * function to remove a menu item from the database'
 * @param {string} name - the name of the item to be removed
 * @returns {Object} - a message object containing a success message
 */
router.post("/removeItem", async (req, res) => {
    //console.log(req.body);
    itemToRemove = req.body.params.itemToRemove;
    pool.query("DELETE FROM menu_items WHERE item ='" + itemToRemove + "'", (err) => {
        if(err) {
            return console.log('Error executing query', err.stack)
          }
          res.status(200).json({message: "Successfully removed item!"});
    })
});

/**
 * function to add a menu item from the database'
 * @param {string} name - the name of the item to be added
 * @returns {Object} - a message object containing a success message
 */
router.post("/createItem", async (req, res) => {
    //console.log(req.body);
    itemName = req.body.params.itemName;
    itemPrice = req.body.params.itemPrice;
    itemStock = req.body.params.itemStock;
    itemType = req.body.params.itemType;
    pool.query("INSERT INTO menu_items VALUES ('" + itemName + "'," + itemPrice + "," + itemStock + ",'" + itemType + "')", (err) => {
        if(err) {
            return console.log('Error executing query', err.stack)
          }
          res.status(200).json({message: "Successfully created item!"});
    })
});

module.exports = router;