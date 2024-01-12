/**
 * A Module that creates a React Component with help instructions for anything any person may want to do on the application
 * @module Help
 */

import { Container, Button, Nav, CardGroup, Card, Spinner, Alert, Table } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";

import menuRedHighlight from "./images/menuRedHighlight.png";
import menuItemSelect from "./images/menuItemSelect.png";
import addToBag from "./images/addToBag.png"
import languageBox from "./images/languageBox.png";
import selectLanguage from "./images/selectLanguage.png";
import saveSettings from "./images/saveSettings.png";

import cashierSubmit from "./images/cashierSubmit.png";
import cashierAdd from "./images/cashierAdd.png";
import cashierEditItem from "./images/cashierEditItem.png";

import duplicateItem from "./images/duplicateItem.png";
import removeItem from "./images/removeItem.png";
import submitOrderUser from "./images/submitOrderUser.png";

import editMenuItem from "./images/editMenuItem.png";
import createNewMenuItem from "./images/createNewMenuItem.png";
import deleteMenuItem from "./images/deleteMenuItem.png";
import enterDates from "./images/enterDates.png";
import selectReport from "./images/selectReport.png";
import processReport from "./images/processReport.png";

import "./tableStyle.css";

/**
 * A function that creates and organizes all the different help instructions into a collapsable table that people can use to learn about the application
 * @param {Object} props - decoded user payload information
 * @returns {Object} - the html for the React Component
 */
function Help(props) {

  const [isLoading, setLoading] = useState([]);
  const [message, setMessage] = useState();
  const [screenText, setScreenText] = useState({});

  useEffect(() => {
    if(localStorage.getItem("translation") != null){
      setScreenText(JSON.parse(localStorage.getItem("translation")));
    }else{
      setScreenText(props.auth.user.screenText);
    }

    setLoading(false);

  }, []);

  return (
  
      <div className="Help">
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <React.Fragment>
            <h2 className="display-3 text-center"> {screenText["Help"]} </h2>
            <div className="d-flex justify-content-center">
                <p><i>{screenText["Click on an item to learn more about that topic!"]}</i></p>
            </div>
            <br></br>

            {message && (
              <React.Fragment>
                <Alert className="text-center" variant="danger">
                  {message}
                </Alert>
                <br></br>
              </React.Fragment>
            )}

            {props.auth.user.role === "online-user" && 
                <React.Fragment>
                    

                </React.Fragment>
            }

            {props.auth.user.role === "user" && 
                <React.Fragment>
                    <Table bordered hover className="text-center">
                        <tbody>
                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow0" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Make an Order"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow0">
                                    <br></br>
                                        <p>1. {screenText["Click the box for whatever item you wish to add to your bag."]}</p>
                                        <p>2. {screenText["Select item details and click add to bag."]}</p>
                                        <p>3. {screenText["Click 'Bag' in the navigation menu up top."]}</p>
                                        <p>4. {screenText["Confirm your order and click 'Submit Order'."]}</p>
                                        <p>5. {screenText["Wait by the pickup counter for your food."]}</p>

                                    <br></br>
                                </div></td>
                            </tr>
                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow1" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Add Items to Your Bag"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow1">
                                    <br></br>
                                        <p>1. {screenText["Click the box for whatever item you wish to add to your bag. (Boxes highlighted in red)"]}</p>
                                        <img src={menuRedHighlight} width="500px"></img>
                                        <br></br><br></br>
                                        <p>2. {screenText["Select desired options from the menu."]}</p>
                                        <img src={menuItemSelect} width="300px"></img>
                                        <br></br><br></br>
                                        <p>3. {screenText["Click 'Add to Bag'"]}</p>
                                        <img src={addToBag} width="500px"></img>
                                        <br></br><br></br>
                                    <br></br>
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow2" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Edit an Order"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow2">
                                    
                                    <p>1. {screenText["If you wish to duplicate an item in your bag, press the '+' on that item"]}</p>
                                    <img src={duplicateItem} width="800px"></img>
                                    <br></br><br></br>
                                    <p>2. {screenText["If you wish to remove an item in your bag, press the '-' on that item"]}</p>
                                    <img src={removeItem} width="800px"></img>
                                    <br></br><br></br>
                                    
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow3" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["Submitting an Order"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow3">
                                    
                                    <p>1. {screenText["Confirm that everything you want is in your bag"]}</p>
                                    <p>2. {screenText["Click 'Submit Order' at the bottom of the page"]}</p>
                                    <img src={submitOrderUser} width="800px"></img>
                                    <br></br><br></br>
                                    
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow4" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["Changing your Settings"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow4">
                                    <p>1. {screenText["Navigate to the 'Settings' tab in the navigation above."]}</p>
                                    <p>{screenText["As of now, we only support language changes."]}</p>
                                    <p>2. {screenText["Select the language drop down box and pick your desired language."]}</p>
                                    <img src={languageBox} width="800px"></img>
                                    <br></br><br></br>
                                    <img src={selectLanguage} width="500px"></img>
                                    <br></br><br></br>
                                    <img src={saveSettings} width="500px"></img>
                                    <br></br><br></br>
                                    <p>3. {screenText["Wait for new language to load."]}</p>
                                    <br></br><br></br>
                                </div></td>
                            </tr>
                        </tbody>

                    </Table>
                </React.Fragment>
            }

            {props.auth.user.role === "cashier" && 
                <React.Fragment>
                    <Table bordered hover className="text-center">
                        <tbody>
                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow1" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["What to do when a customer approaches"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow1">
                                    <p>1. {screenText["Greet the customer and look at their meal."]}</p>   
                                    <p>2. {screenText["Click buttons to add an item to their receipt."]}</p>
                                    <img src={cashierAdd}></img>
                                    <br></br><br></br>
                                    <p>3. {screenText["Tell the customer their total and ask for their payment."]}</p>
                                    <p>4. {screenText["Process the customer's payment and give them their meal."]}</p>
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow2" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Edit an Order"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow2">
                                    <p>1. {screenText["If you added an item by mistake or the customer changed their mind, select the 'X' next to the item."]}</p>
                                    <img src={cashierEditItem}></img>
                                    <br></br><br></br>
                                    <p>2. {screenText["If needed, add another item to the receipt before continuing."]}</p>
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow3" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["Submitting an Order"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow3">
                                    <p>1. {screenText["Confirm that the receipt is correct with the customer."]}</p>
                                    <p>2. {screenText["Select 'Submit Order' below the items in the receipt."]}</p>
                                    <img src={cashierSubmit}></img>
                                    <br></br><br></br>
                                    <p>3. {screenText["Give the customer their food and say your salutation."]}</p>
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow4" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["Changing your Settings"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow4">
                                    <p>1. {screenText["Navigate to the 'Settings' tab in the navigation above."]}</p>
                                    <p>{screenText["As of now, we only support language changes."]}</p>
                                    <p>2. {screenText["Select the language drop down box and pick your desired language."]}</p>
                                    <img src={languageBox} width="800px"></img>
                                    <br></br><br></br>
                                    <img src={selectLanguage} width="500px"></img>
                                    <br></br><br></br>
                                    <img src={saveSettings} width="500px"></img>
                                    <br></br><br></br>
                                    <p>3. {screenText["Wait for new language to load."]}</p>
                                    <br></br><br></br>
                                </div></td>
                            </tr>
                        </tbody>

                    </Table>

                </React.Fragment>
            }

            {props.auth.user.role === "manager" && 
                <React.Fragment>
                    <Table bordered hover className="text-center">
                        <tbody>
                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow1" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Process Orders"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow1">
                                    <p>1. {screenText["Greet the customer and look at their meal."]}</p>   
                                    <p>2. {screenText["Click buttons to add an item to their receipt."]}</p>
                                    <img src={cashierAdd}></img>
                                    <br></br><br></br>
                                    <p>3. {screenText["Confirm that the receipt is correct with the customer."]}</p>
                                    <p>4. {screenText["Select 'Submit Order' below the items in the receipt."]}</p>
                                    <img src={cashierSubmit}></img>
                                    <br></br><br></br>
                                    <p>5. {screenText["Give the customer their food and say your salutation."]}</p>

                                    <br></br>
                                    <p><b>{screenText["If you need to edit an item"]}:</b></p>
                                    <p>1. {screenText["If you added an item by mistake or the customer changed their mind, select the 'X' next to the item."]}</p>
                                    <img src={cashierEditItem}></img>
                                    <br></br><br></br>
                                    <p>2. {screenText["If needed, add another item to the receipt before continuing."]}</p>
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow2" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Edit Menu Items"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow2">
                                    <p>1. {screenText["Navigate to the 'Adjust Menu' tab above."]}</p>
                                    <p>2. {screenText["Locate the menu item you want to adjust."]}</p>
                                    <p>3. {screenText["Enter in the new information you want to update."]}</p>
                                    <p>4. {screenText["Click 'Update' next to the field you want to change."]}</p>
                                    <img src={editMenuItem} width="600px"></img>
                                    
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow3" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Add New Menu Items"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow3">
                                    <p>1. {screenText["Navigate to the 'Add Menu Item' tab above."]}</p>
                                    <p>2. {screenText["Enter in information for the new item you want to add."]}</p>
                                    <p>3. {screenText["Click 'Create'"]}</p>
                                    <img src={createNewMenuItem} width="400px"></img>

                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow4" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Delete Menu Items"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow4">
                                    <p>1. {screenText["Navigate to the 'Adjust Menu' tab above."]}</p>
                                    <p>2. {screenText["Locate the item you wish to delete."]}</p>
                                    <p>3. {screenText["Click 'Remove Item' beneath it."]}</p>
                                    <img src={deleteMenuItem} width="400px"></img>
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow5" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["How to Generate Reports"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow5">
                                    <p>1. {screenText["Navigate to the 'Reports' tab above."]}</p>
                                    <p>2. {screenText["Enter in a date range that you want the report to cover."]}</p>
                                    <img src={enterDates} width="400px"></img>
                                    <br></br><br></br>
                                    <p>3. {screenText["Select the type of report you want to generate."]}</p>
                                    <p><i>{screenText["Note, if you are generating a sells-together report, you also need to select an item"]}</i></p>
                                    <img src={selectReport} width="400px"></img>
                                    <br></br><br></br>
                                    <p>4. {screenText["Click 'Process'"]}</p>
                                    <img src={processReport} width="400px"></img>
                                    <br></br><br></br>
                                    
                                </div></td>
                            </tr>

                            <tr className="table-secondary" data-toggle="collapse" data-target=".commentRow6" style={{cursor:'pointer'}}>
                                <td class="col-md-2">{screenText["Changing your Settings"]} ⬎</td>
                            </tr>
                            <tr>
                                <td className="hiddenRow"><div className="collapse commentRow6">
                                    <p>1. {screenText["Navigate to the 'Settings' tab in the navigation above."]}</p>
                                    <p>{screenText["As of now, we only support language changes."]}</p>
                                    <p>2. {screenText["Select the language drop down box and pick your desired language."]}</p>
                                    <img src={languageBox} width="800px"></img>
                                    <br></br><br></br>
                                    <img src={selectLanguage} width="500px"></img>
                                    <br></br><br></br>
                                    <img src={saveSettings} width="500px"></img>
                                    <br></br><br></br>
                                    <p>3. {screenText["Wait for new language to load."]}</p>
                                    <br></br><br></br>
                                </div></td>
                            </tr>
                        </tbody>

                    </Table>

                </React.Fragment>
            }


            
            <br></br><br></br><br></br><br></br>
          </React.Fragment>
      )
    }
    </div>
    );


}

Help.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Help);