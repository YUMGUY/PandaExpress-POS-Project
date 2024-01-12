/**
 * User routes module. This module creates a router that can be used to connect to our database and interact with any data pertaining to the user.
 * @module user
 */


const express = require("express");
const { Pool, Client } = require("pg");

/**
 * function to get and set database information relative to users
 * @returns {Object} different methods to view and change the database
 */
const router = express.Router();

/**
 * function to create and secure a token within the users browser
 * @returns {Object} an encrypted payload with user information
 */
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");

/**
 * A secure connection to the database
 * Object
 * @type {{connectionString: string}}
 */
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";


/**
 * function to log a user into an account
 * @param {string} username - the user's username
 * @param {string} password - the user's password
 * @returns {Object} an encrypted payload with user information
 */
router.post("/login", (req, res) => {

  const username = req.body.username.trim();
  const password = req.body.password.trim();

  pool.query('SELECT * FROM users', (err, result) => {
    if(err) {
      return console.log('Error executing query', err.stack)
    }

    for(let i = 0; i < result.rows.length; i++){
      if(result.rows[i].username === username){
        bcrypt.compare(password, result.rows[i].password).then((isMatch) => {
          if(isMatch){
            let screenText;
            if(result.rows[i].role === "user"){
              screenText = {"Menu": "Menu", "Bag": "Bag", "Settings": "Settings", "Help": "Help", "Logout":"Logout",

                            // Settings
                            "My Settings": "My Settings", "Language":"Language", "Save Changes!": "Save Changes!", 
                      
                            // Landing
                            "Welcome to Panda Express": "Welcome to Panda Express", "Click 'Menu' above to start your order!":"Click 'Menu' above to start your order!",
                             "If you need any help, click 'Help' above":"If you need any help, click 'Help' above",

                            // Menu
                            "Menu":"Menu", "Bowl":"Bowl", "1 side & 1 entree":"1 side & 1 entree", "Plate":"Plate", "1 side & 2 entrees":"1 side & 2 entrees",
                            "Bigger Plate":"Bigger Plate", "1 side & 3 entrees":"1 side & 3 entrees", "Drinks":"Drinks", "Add a drink":"Add a drink",
                            "Appetizers":"Appetizers", "Start your meal with something small":"Start your meal with something small", "Choose a Side":"Choose a Side",
                            "Choose":"Choose", "Entrees":"Entrees", "Cancel":"Cancel", "Add to Bag":"Add to Bag", "Total":"Total", "Go to Bag":"Go to Bag",
                            
                            // Bag
                            "Your Order":"Your Order", "Submit Order": "Submit Order", "Your Bag is Empty!":"Your Bag is Empty!",

                            // Help
                            "Click on an item to learn more about that topic!":"Click on an item to learn more about that topic!", "How to Make an Order":"How to Make an Order",
                            "How to Add Items to Your Bag":"How to Add Items to Your Bag", "How to Edit an Order":"How to Edit an Order", "Submitting an Order":"Submitting an Order",
                            "Changing your Settings":"Changing your Settings",
                            "Click the box for whatever item you wish to add to your bag.":"Click the box for whatever item you wish to add to your bag.",
                            "Select item details and click add to bag.":"Select item details and click add to bag.",
                            "Click 'Bag' in the navigation menu up top.":"Click 'Bag' in the navigation menu up top.",
                            "Confirm your order and click 'Submit Order'.":"Confirm your order and click 'Submit Order'.",
                            "Wait by the pickup counter for your food.":"Wait by the pickup counter for your food.",
                            "Click the box for whatever item you wish to add to your bag. (Boxes highlighted in red)":"Click the box for whatever item you wish to add to your bag. (Boxes highlighted in red)",
                            "Select desired options from the menu.":"Select desired options from the menu.",
                            "Click 'Add to Bag'":"Click 'Add to Bag'",
                            "If you wish to duplicate an item in your bag, press the '+' on that item":"If you wish to duplicate an item in your bag, press the '+' on that item",
                            "If you wish to remove an item in your bag, press the '-' on that item":"If you wish to remove an item in your bag, press the '-' on that item",
                            "Confirm that everything you want is in your bag":"Confirm that everything you want is in your bag",
                            "Click 'Submit Order' at the bottom of the page":"Click 'Submit Order' at the bottom of the page",
                            "Navigate to the 'Settings' tab in the navigation above.":"Navigate to the 'Settings' tab in the navigation above.",
                            "As of now, we only support language changes.":"As of now, we only support language changes.",
                            "Select the language drop down box and pick your desired language.":"Select the language drop down box and pick your desired language.",
                            "Wait for new language to load.":"Wait for new language to load."
                          
                            
                          }
            }
            else if(result.rows[i].role === "manager"){
              screenText = {"Process Orders": "Process Orders", "Adjust Menu":"Adjust Menu", "Add Menu Item":"Add Menu Item", "Reports":"Reports", "Settings": "Settings", "Help": "Help", "Logout":"Logout",

                            // Settings
                            "My Settings": "My Settings", "Language":"Language", "Save Changes!": "Save Changes!", 
                      
                            // Landing
                            "Welcome to Panda Express": "Welcome to Panda Express",

                            // Process Orders
                            "Process Orders":"Process Orders", "Plate Sizes":"Plate Sizes", "Sides":"Sides", "Proteins":"Proteins", "Appetizers":"Appetizers", "Drinks":"Drinks",
                            "Current Order":"Current Order", "Total":"Total", "Submit Order":"Submit Order",

                            // Adjust Menu
                            "Sizes":"Sizes", "Update":"Update", "Remove Item":"Remove Item", "Entrees":"Entrees", "Amount":"Amount",

                            // Add Menu Item
                            "Item Creator":"Item Creator", "Item Name":"Item Name", "Price":"Price", "Stock":"Stock", "Item Type":"Item Type", "Create":"Create",
                            "Enter Item Name":"Enter Item Name", "Enter Item Price":"Enter Item Price", "Enter Item Stock":"Enter Item Stock",

                            // Reports
                            "Manager Reports":"Manager Reports", "Start Date":"Start Date", "End Date":"End Date", "Choose Report":"Choose Report", "Total Revenue":"Total Revenue", "Excess Report":"Excess Report",
                            "Restock Report":"Restock Report", "Sales Report":"Sales Report", "Sells-Together Report":"Sells-Together Report", "Process":"Process",

                            // Help
                            "How to Process Orders":"How to Process Orders", "How to Edit Menu Items":"How to Edit Menu Items", "How to Add New Menu Items":"How to Add New Menu Items", 
                            "How to Delete Menu Items":"How to Delete Menu Items", "How to Generate Reports":"How to Generate Reports", "Changing your Settings":"Changing your Settings",
                            "Greet the customer and look at their meal.":"Greet the customer and look at their meal.",
                            "Click buttons to add an item to their receipt.":"Click buttons to add an item to their receipt.",
                            "Confirm that the receipt is correct with the customer.":"Confirm that the receipt is correct with the customer.",
                            "Select 'Submit Order' below the items in the receipt.":"Select 'Submit Order' below the items in the receipt.",
                            "Give the customer their food and say your salutation.":"Give the customer their food and say your salutation.",
                            "If you need to edit an item":"If you need to edit an item",
                            "If you added an item by mistake or the customer changed their mind, select the 'X' next to the item.":"If you added an item by mistake or the customer changed their mind, select the 'X' next to the item.",
                            "If needed, add another item to the receipt before continuing.":"If needed, add another item to the receipt before continuing.",
                            "Navigate to the 'Adjust Menu' tab above.":"Navigate to the 'Adjust Menu' tab above.",
                            "Locate the menu item you want to adjust.":"Locate the menu item you want to adjust.",
                            "Enter in the new information you want to update.":"Enter in the new information you want to update.",
                            "Click 'Update' next to the field you want to change.":"Click 'Update' next to the field you want to change.",
                            "Navigate to the 'Add Menu Item' tab above.":"Navigate to the 'Add Menu Item' tab above.",
                            "Enter in information for the new item you want to add.":"Enter in information for the new item you want to add.",
                            "Click 'Create'":"Click 'Create'",
                            "Navigate to the 'Adjust Menu' tab above.":"Navigate to the 'Adjust Menu' tab above.",
                            "Locate the item you wish to delete.":"Locate the item you wish to delete.",
                            "Click 'Remove Item' beneath it.":"Click 'Remove Item' beneath it.",
                            "Navigate to the 'Reports' tab above.":"Navigate to the 'Reports' tab above.",
                            "Enter in a date range that you want the report to cover.":"Enter in a date range that you want the report to cover.",
                            "Select the type of report you want to generate.":"Select the type of report you want to generate.",
                            "Note, if you are generating a sells-together report, you also need to select an item":"Note, if you are generating a sells-together report, you also need to select an item",
                            "Click 'Process'":"Click 'Process'",
                            "Navigate to the 'Settings' tab in the navigation above.":"Navigate to the 'Settings' tab in the navigation above.",
                            "As of now, we only support language changes.":"As of now, we only support language changes.",
                            "Select the language drop down box and pick your desired language.":"Select the language drop down box and pick your desired language.",
                            "Wait for new language to load.":"Wait for new language to load."

                          
                          }
            }
            else if(result.rows[i].role === "cashier"){
              screenText = {"Process Orders": "Process Orders", "Settings": "Settings", "Help": "Help", "Logout":"Logout",

                            // Settings
                            "My Settings": "My Settings", "Language":"Language", "Save Changes!": "Save Changes!", 
                      
                            // Landing
                            "Welcome to Panda Express": "Welcome to Panda Express",

                            // Process Orders
                            "Process Orders":"Process Orders", "Plate Sizes":"Plate Sizes", "Sides":"Sides", "Proteins":"Proteins", "Appetizers":"Appetizers", "Drinks":"Drinks",
                            "Current Order":"Current Order", "Total":"Total", "Submit Order":"Submit Order",

                            // Help
                            "What to do when a customer approaches":"What to do when a customer approaches", "How to Edit an Order":"How to Edit an Order", "Submitting an Order":"Submitting an Order",
                            "Changing your Settings":"Changing your Settings", "Greet the customer and look at their meal.":"Greet the customer and look at their meal.", 
                            "Click buttons to add an item to their receipt.":"Click buttons to add an item to their receipt.",
                            "Tell the customer their total and ask for their payment.":"Tell the customer their total and ask for their payment.",
                            "Process the customer's payment and give them their meal.":"Process the customer's payment and give them their meal.",
                            "If you added an item by mistake or the customer changed their mind, select the 'X' next to the item.":"If you added an item by mistake or the customer changed their mind, select the 'X' next to the item.",
                            "If needed, add another item to the receipt before continuing.":"If needed, add another item to the receipt before continuing.",
                            "Confirm that the receipt is correct with the customer.":"Confirm that the receipt is correct with the customer.",
                            "Select 'Submit Order' below the items in the receipt.":"Select 'Submit Order' below the items in the receipt.",
                            "Give the customer their food and say your salutation.":"Give the customer their food and say your salutation.",
                            "Navigate to the 'Settings' tab in the navigation above.":"Navigate to the 'Settings' tab in the navigation above.",
                            "As of now, we only support language changes.":"As of now, we only support language changes.",
                            "Select the language drop down box and pick your desired language.":"Select the language drop down box and pick your desired language.",
                            "Wait for new language to load.":"Wait for new language to load."


                          }
            }
            else if(result.rows[i].role === "online-user"){
              screenText = {"Menu": "Menu", "Bag": "Bag", "Settings": "Settings", "Help": "Help", "My Settings": "My Settings", "Logout":"Logout",

                            // Settings
                            "Language":"Language", "Save Changes!": "Save Changes!", 

                            // Menu
                            "Menu":"Menu", "Bowl":"Bowl", "1 side & 1 entree":"1 side & 1 entree", "Plate":"Plate", "1 side & 2 entrees":"1 side & 2 entrees",
                            "Bigger Plate":"Bigger Plate", "1 side & 3 entrees":"1 side & 3 entrees", "Drinks":"Drinks", "Add a drink":"Add a drink",
                            "Appetizers":"Appetizers", "Start your meal with something small":"Start your meal with something small", "Choose a Side":"Choose a Side",
                            "Choose":"Choose", "Entrees":"Entrees", "Cancel":"Cancel", "Add to Bag":"Add to Bag", "Total":"Total", "Go to Bag":"Go to Bag",

                            // Landing
                            "Welcome to Panda Express": "Welcome to Panda Express", "Click 'Menu' above to start your order!":"Click 'Menu' above to start your order!",
                            "If you need any help, click 'Help' above":"If you need any help, click 'Help' above",
            
                            // Find Store
                            "Find my Store":"Find my Store", "Enter your address to map to our store.":"Entre your address to map to our store.",
                            "Find Route!":"Find Route!", "is located at:": "is located at:",
                          
                          }
            }

            let lang;
            if(result.rows[i].language == null){
              lang = "English";
            }else{
              lang = result.rows[i].language
            }

            const payload = {
              id: result.rows[i].userid,
              fname: result.rows[i].first,
              lname: result.rows[i].last,
              username: result.rows[i].username,
              role: result.rows[i].role,
              language: lang,
              tts: result.rows[i].tts,
              screenText: screenText,
            };

            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 604800, // 7 days in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
    
            return;
          }else{
            return res
              .status(400)
              .json({ passwordincorrect: "Password incorrect" });
          }
        });
      }
    }

  })

});

/**
 * function to create an account on the database
 * @param {string} fname - the user's first name
 * @param {string} lname - the user's last name
 * @param {string} username - the user's username
 * @param {string} email - the user's email
 * @param {string} password - the user's password
 * @param {string} password2 - the user's confirmation password entry
 * @returns {Object} an object containing the new user id
 */
router.post("/register", async (req, res) => {
    const fname = req.body.fname.trim();
    const lname = req.body.lname.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const password2 = req.body.password2.trim();
    let userID = 0;

    if(fname == "" || lname == ""){
      return res.status(400).json({name: "Please enter a name!"})
    }
    if(!email.includes("@")){
      return res.status(400).json({registerEmail: "Invalid email!"});
    }
    if(password != password2){
      return res.status(400).json({registerPassword2: "Password does not match!"});
    }
    
    pool.query('SELECT * FROM users', (err, result) => {
      if(err) {
        return console.log('Error executing query', err.stack)
      }
      userID = result.rows.length + 1;

      for(let i = 0; i < result.rows.length; i++){
        if(email == result.rows[i].email){
          return res.status(400).json({registerEmail: "Email already exists!"});
        }
        if(username == result.rows[i].username){
          return res.status(400).json({registerUsername: "Username already exists!"});
        }
      }

      let password_hashed = "";

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if(err){
            console.log(err);
            res.status(400).json({message: "Error creating account!"});
          };
          password_hashed = hash;

          pool.query(`INSERT INTO users VALUES (${userID}, '${fname}', '${lname}', 'online-user', '${username}', '${password_hashed}', '${email}', NULL, NULL, 'English', false)`, (err, result) => {
            if(err) {
              return console.log('Error executing query', err.stack)
            }
            res.status(200).json(result);
          })
        })
      })


    });


});


/**
 * function to get a user's current order string from the database
 * @param {number} userID - the user's userID
 * @returns {Object} an object with the user's current order string
 */
router.get("/getCurrentOrder", async (req, res) => {
  const userID = req.query.userID;
  
  pool.query(`SELECT current_order, current_order_price FROM users WHERE userid=${userID}`, (err, result) => {
    if(err){
      return console.log(err);
    }
    res.status(200).json(result.rows[0]);
  });

})

/**
 * function to get a user's current settings from the database
 * @param {number} userID - the user's userID
 * @returns {Object} an object with the user's current settings
 */
router.get("/getUserSettings", async(req, res) => {
  const userID = req.query.userID;
  pool.query(`SELECT language, tts FROM users WHERE userid=${userID}`, (err, result) => {
    if(err){
      console.log(err);
    }
    res.status(200).json(result.rows[0]);
  })
})

/**
 * function to set a user's current settings from the database
 * @param {number} userID - the user's userID
 * @returns {Object} an object with a success message
 */
router.post("/saveSettings", async (req, res) => {
  const userID = req.body.params.userID;
  const language = req.body.params.language;
  const tts = req.body.params.tts;

  pool.query(`UPDATE users SET language='${language}', tts=${tts} WHERE userid=${userID}`, (err, result) => {
    if(err){
      console.log(err);
    }
    res.status(200).json({message: "User settings successfully updated!"});
  })

})

/**
 * function to duplicate an item from user's current order
 * @param {number} userID - the user's userID
 * @param {string} fullUserOrderItem - the item being duplicated
 * @returns {Object} an object with a success message.
 */
router.post("/addUserItem", async(req, res) => {
  const userID = req.body.params.employeeID;
  var fullUserOrderItem = req.body.params.fullOrder_semi;
  console.log(fullUserOrderItem + " : item added with the semi colons intact");

  var user_Order = [];
  var user_Order_Price = [];
  user_Order = (await pool.query(`SELECT current_order FROM users WHERE userid=${userID}`)).rows[0].current_order;
  user_Order_Price = (await pool.query(`SELECT current_order_price FROM users WHERE userid=${userID}`)).rows[0].current_order_price;
  var priceWanted = 0;
  user_Order = user_Order.split(", ");
  user_Order_Price = user_Order_Price.split(", ");
  // long and convoluted way, but gets the price either way
  for(let i = 0; i < user_Order.length; ++i) {
    if(user_Order.at(i) == fullUserOrderItem) {
      // capture the price
      priceWanted = user_Order_Price.at(i);
    }
  }
  
  user_Order.push(fullUserOrderItem);
  user_Order = user_Order.join(", ");
  user_Order_Price.push(priceWanted);
  user_Order_Price = user_Order_Price.join(", ");

  // console.log(user_Order);
  // console.log(user_Order_Price);
  pool.query("UPDATE users SET current_order =" + "'" + user_Order + "'" + " WHERE userid = "+ userID, (err, result) => {
    if(err) {
      return console.log(err);
    };
  });
  pool.query("UPDATE users SET current_order_price =" + "'" + user_Order_Price + "'" + " WHERE userid = "+ userID, (err, result) => {
    if(err) {
      return console.log(err);
    };
    res.status(200).json({message: "Successfully added item!"});
  });
})

/**
 * function to remove an item from user's current order
 * @param {number} userID - the user's userID
 * @param {string} fullUserOrderItem - the item being removed
 * @returns {Object} an object with a success message.
 */
router.post("/removeUserItem", async(req, res) => {
  const userID = req.body.params.employeeID;
  const bagItemString = req.body.params.bagItem; // passed in as the button is clicked for each order item
  var fullUserOrder = req.body.params.fullOrder_semi; // has semi colons for bowl, plate, bigger plate, etc
  console.log(fullUserOrder + " : item removed with the semi colons intact");
  var user_Order = [];
//  console.log(bagItemString + " : item selected to remove");
  //res is the whole list
  user_Order = (await pool.query(`SELECT current_order FROM users WHERE userid=${userID}`)).rows[0].current_order;
  var user_Order_Price = (await pool.query(`SELECT current_order_price FROM users WHERE userid=${userID}`)).rows[0].current_order_price;
    // // parse whole list in database
  user_Order = user_Order.split(", ");
  user_Order_Price = user_Order_Price.split(", ");

  //remove element from list
  for(let i = 0; i < user_Order.length; ++i) {
    if(user_Order.at(i) == fullUserOrder) {
      user_Order.splice(i, 1);
      user_Order_Price.splice(i, 1); // also remove the corresponding price
      break;
    }
  }
  // join back into one string
  user_Order = user_Order.join(', ');
  user_Order_Price = user_Order_Price.join(', ');
  console.log("user order after removing: "  + user_Order);
  console.log("user order Price after removing: "  + user_Order_Price);

  // // Then query to replace current order & price in the database with the modified order
  pool.query("UPDATE users SET current_order =" + "'" + user_Order + "'" + " WHERE userid = "+ userID, (err, result) => {
    if(err) {
      return console.log(err);
    };
  });
  pool.query("UPDATE users SET current_order_price =" + "'" + user_Order_Price + "'" + " WHERE userid = "+ userID, (err, result) => {
    if(err) {
      return console.log(err);
    };
    res.status(200).json({message: "Successfully removed item!"});
  });

})



module.exports = router;
