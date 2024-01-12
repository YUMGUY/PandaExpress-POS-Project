/**
 * Reports routes module. This module creates a router that can be used to connect to our database and interact with any data pertaining to the manager reports.
 * @module reports
 */

const express = require("express");

/**
 * function to get and set database information relative to manager reports
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
 * function to calculate the revenue within a given time period
 * @param {string} startDate - a string containing the start date of the report
 * @param {string} endDate - a string containing the end date of the report
 * @returns {Object} An object with the total revenue earned in the time period given
 */
router.get("/getRevenue", async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    pool.query("SELECT SUM(total_price) as REVENUE FROM orders WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "'", (err, result) => {
        if(err) {
            return console.log('Error executing query', err.stack)
        }
        res.json(result.rows[0]);
    });
});

/**
 * function to get the sales within a given time period
 * @param {string} startDate - a string containing the start date of the report
 * @param {string} endDate - a string containing the end date of the report
 * @returns {Object} An object with the sales in the time period given
 */
router.get("/getSales", async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    pool.query("SELECT * FROM orders WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "'", (err, result) => {
        if(err) {
            return console.log('Error executing query', err.stack)
        }
        res.json(result.rows);
    });
});

/**
 * function to calculate menu items that have not sold more than 10% of their inventory within a given time period
 * @param {string} startDate - a string containing the start date of the report
 * @param {string} endDate - a string containing the end date of the report
 * @returns {Object} An object with each item that has excess
 */
router.get("/getExcessReport", async (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    let itemStockTable = [];
    var stockSoldTable = [];
    (await pool.query("SELECT * FROM menu_items")).rows.forEach((menuItem) => {
        itemStockTable.push({item: menuItem.item, stock: menuItem.stock});
        stockSoldTable.push({item: menuItem.item, stock: 0})
    });

    pool.query("SELECT * FROM orders WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "'", (err, result) => {
        if(err) {
            return console.log('Error executing query', err.stack)
        }

        result.rows.forEach((order) => {
            let orderItems = order.items.split(", ");
            orderItems.forEach((orderItem) => {
                stockSoldTable.every((soldItem) => {
                    if (soldItem.item == orderItem) {
                        soldItem.stock += 1;
                        return false;
                    }
                    return true;
                });
            });
        });
        // console.log(stockSoldTable);

        var excessItems = [];
        itemStockTable.forEach((menuItem, i) => {
            if (stockSoldTable[i].stock < (menuItem.stock / 10)) {
                excessItems.push({item: menuItem.item, percentageSold: (stockSoldTable[i].stock / menuItem.stock), stock: menuItem.stock});
            }
        });

        res.json(excessItems);
    });
});

/**
 * function to calculate how many times an item has sold with all other items
 * @param {string} startDate - a string containing the start date of the report
 * @param {string} endDate - a string containing the end date of the report
 * @param {string} searchItem - a string that contains the name of the item being searched for
 * @returns {Object} An object with each item that has sold with the search item and how many times within the given time period
 */
router.get("/getSellTogether", async (req, res) => {
    //push request with item you want to compare
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const searchItem = req.query.searchItem;

    let counter = new Map();

    pool.query("SELECT items FROM orders WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "' AND items LIKE '%" + searchItem + "%'", (err, result) => {
        if(err) {
            return console.log('Error executing query', err.stack)
        }
        result.rows.forEach((order) => {
            let orderItems = order.items.split(", ");
            orderItems.forEach((orderItem) => {
                if (orderItem != searchItem){
                    if (counter.has(orderItem) == false) {
                        counter.set(orderItem, 1);
                        return false;
                    }
                    counter.set(orderItem, counter.get(orderItem)+1);
                    return true;
                }
                return false;
            });
        });

        var tempItems = [];
        counter.forEach(function(key, value){
            tempItems.push({key, value})
        })

        res.json(tempItems);
    });
});

/**
 * function to calculate menu items that have less than 10% of their inventory within a given time period
 * @param {string} startDate - a string containing the start date of the report
 * @param {string} endDate - a string containing the end date of the report
 * @returns {Object} An object with each item that needs restocking
 */
router.get("/getRestock", async (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    let itemStockTable = [];
    var stockSoldTable = [];
    (await pool.query("SELECT * FROM menu_items")).rows.forEach((menuItem) => {
        itemStockTable.push({item: menuItem.item, stock: menuItem.stock});
        stockSoldTable.push({item: menuItem.item, stock: 0})
    });

    pool.query("SELECT * FROM orders WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "'", (err, result) => {
        if(err) {
            return console.log('Error executing query', err.stack)
        }

        result.rows.forEach((order) => {
            let orderItems = order.items.split(", ");
            orderItems.forEach((orderItem) => {
                stockSoldTable.every((soldItem) => {
                    if (soldItem.item == orderItem) {
                        soldItem.stock += 1;
                        return false;
                    }
                    return true;
                });
            });
        });
        // console.log(stockSoldTable);

        var excessItems = [];
        itemStockTable.forEach((menuItem, i) => {
            if (stockSoldTable[i].stock > (menuItem.stock)) {
                excessItems.push({item: menuItem.item, percentageSold: (stockSoldTable[i].stock / (stockSoldTable[i].stock + menuItem.stock)), stock: menuItem.stock});
            }
        });

        res.json(excessItems);
    });
});

module.exports = router;