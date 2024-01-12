/**
 * A Module that creates a React component for managers to use to generate sales reports, restock reports, excess reports, sells together reports, revenue reports.
 * @module adjustMenu
 */

import { Container, Button, Nav, CardGroup, Card, Spinner, Form, Table, Row, Col, Modal, Alert } from "react-bootstrap";
import { useSpring, animated, interpolate } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BagItemCard from "../Cards/bagCard";
//import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import ReportItemCard from "../Cards/reportItemCard";
import OrderReportCard from "../Cards/orderReportCard";
import RestockReportCard from "../Cards/restockReportCard";
import e from "cors";

/**
 * A function that organizes and returns the React component that is used to generate all different reports
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The html for the react component
 */
function Reports(props){
    const [isLoading, setLoading] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportToGenerate, setReportToGenerate] = useState("");
    const [reportItems, setReportItems] = useState([]);
    const [sellsTogetherSearchItem, setSellsTogetherSearchItem] = useState("Bowl");
    const [message, setMessage] = useState();
    const [screenText, setScreenText] = useState({});

    // filters for sales report
    const [employeeFilter, setEmployeeFilter] = useState("");
    const [itemsFilter, setItemsFilter] = useState("");
    const [orderNumberFitler, setOrderNumberFilter] = useState("");
    const [totalFilter, setTotalFilter] = useState("");

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

    const getRevenueReport = () => {
        axios.get("/reports/getRevenue", {
            params: {
                endDate: endDate,
                startDate: startDate,
            }
        }).then((res) => {
            let tempCard = <ReportItemCard  
                            key={"Revenue"}
                            name={"Total Revenue"}
                            detail={formatter.format(res.data.revenue)}
                            />;
            setReportItems([tempCard]);
        });
    };

    const passesFilters = (order) => {
        let possibleIds = employeeFilter.split(", ");
        let possibleItems = itemsFilter.split(", ");
        let orderItems = order.items.split(", ");
        var minTotal = 0;
        var maxTotal = Infinity;
        var allItemsFound = false;

        if (orderNumberFitler != "" && order.order_number != parseInt(orderNumberFitler)) {return false;}
        if (employeeFilter != "" && !possibleIds.includes(order.employee_id.toString())) {return false;}

        if (totalFilter.split(", ").length == 2) {
            minTotal = parseFloat(totalFilter.split(", ")[0]);
            maxTotal = parseFloat(totalFilter.split(", ")[1]);
        }
        else if (totalFilter != "" && parseFloat(totalFilter) >= 0) {
            minTotal = parseFloat(totalFilter);
        }

        if (!(minTotal <= order.total_price && order.total_price <= maxTotal)) {return false;}

        if (itemsFilter != "") {
            allItemsFound = possibleItems.every((filterItem) => {
                var itemNotFound = orderItems.every((orderItem) => {
                    if (orderItem == filterItem) {return false;}
                    else {return true;}
                });
                
                return !itemNotFound;
            });
        }
        else {
            return true;
        }
        return allItemsFound;
    }

    const getSalesReport = () => {
        axios.get("/reports/getSales", {
            params: {
                endDate: endDate,
                startDate: startDate,
            }
        }).then((res) => {
            var tempReportItems = [];

            res.data.every((order) => {
                // check filter item
                if (!passesFilters(order)) {return true;}
                
                var itemsWPrice = []
                let priceArr = order.prices.split(", ");
                let arrLength = priceArr.length;

                // create "<item>: <price>, ..." string for each order
                order.items.split(", ").forEach((item, i) => {
                    if (i < arrLength - 1) {
                        itemsWPrice.push(item + ": " + formatter.format(priceArr[i]) + ", ");
                    }
                    else {
                        itemsWPrice.push(item + ": " + formatter.format(priceArr[i]));
                    }
                });

                // create order card
                let tempCard = <OrderReportCard  
                                key={order.order_number}
                                title={"Order #" + order.order_number}
                                items={itemsWPrice}
                                total={formatter.format(order.total_price)}
                                soldBy={"Employee #" + order.employee_id}
                                />;
                tempReportItems.push(tempCard);
                return true;
        });
            setReportItems([tempReportItems]);
        });
    };

    const getRestockReport = () => {
        axios.get("/reports/getRestock", {
            params: {
                startDate: startDate,
                endDate: endDate 
            }
        })
        .then((res) => {
            let restockItems = res.data;
            let tempReportItems = [];
            restockItems.forEach((item) => {
               let tempCard = <RestockReportCard  
                                key={item.item}
                                item={item.item}
                                stock={item.stock}
                                percent={(item.percentageSold * 100).toFixed(2)}
                                />;
                tempReportItems.push(tempCard);
            });
            setReportItems(tempReportItems);
        })
        .catch((err) => {console.log(err);});
    };

    const getExcessReport = () => {
        axios.get("/reports/getExcessReport", {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        })
        .then((res) => {
            let excessItems = res.data;
            let tempReportItems = [];
            excessItems.forEach((item) => {
               let tempCard = <RestockReportCard  
                                key={item.item}
                                item={item.item}
                                percent={(item.percentageSold * 100).toFixed(2)}
                                stock={item.stock}
                                />;
                tempReportItems.push(tempCard);
            });
            setReportItems(tempReportItems);
        })
        .catch((err) => {console.log(err);});
    };
    
    useEffect(() => {

        if(localStorage.getItem("translation") != null){
            setScreenText(JSON.parse(localStorage.getItem("translation")));
          }else{
            setScreenText(props.auth.user.screenText);
          }

        axios.get("/menu/getAllMenuItems")
        .then(res => {
            setMenuItems(res.data);
        });

        setLoading(false);
    }, [props.auth.user.id]);

    const mapMenuItems = () => {
        const menuList = []; 
        
        menuItems.forEach((item) => {
            let tempItem = <option>{item.item}</option>;
            menuList.push(tempItem);
        });
        return menuList;
    }

    const getSellTogetherReport = () => {
        axios.get("/reports/getSellTogether", {
            params: {
                startDate: startDate,
                endDate: endDate,
                searchItem: sellsTogetherSearchItem
            }
        })
        .then((res) => {
            let sellItems = res.data;
            var itemString = "";
            var itemList = [];
            sellItems.forEach((item) => {
                itemString = String(item.value) + ": " + item.key;
                let tempHTML = <p style={{margin: 0.25+"%"}}>{itemString}</p>;
                itemList.push(tempHTML);
            })
            let tempReportItems = [];
            let tempCard = <ReportItemCard  
                            key={sellsTogetherSearchItem}
                            name={sellsTogetherSearchItem}
                            detail={itemList}
                            />;
            tempReportItems.push(tempCard);

            setReportItems(tempReportItems);
        })
        .catch((err) => {console.log(err);});
    }

    const generateReport = () => {
        if (startDate === "" || endDate === ""){
            setMessage("No Date Selected")
            setTimeout(() => {
                setMessage(null);
            }, 5000);
            //setReportItems([<h3 style={{margin: 10+"%"}}>No Report Selected</h3>]);
            return;
        }
        if(reportToGenerate == "Total Revenue"){
            getRevenueReport();
        }
        else if(reportToGenerate == "Sales Report"){
            getSalesReport();
        }
        else if(reportToGenerate == "Excess"){
            getExcessReport();
        }
        else if(reportToGenerate == "Restock Report"){
            getRestockReport();
        }
        else if(reportToGenerate == "Sell Together"){
            getSellTogetherReport();
        }
        else{
            setMessage("No Reports Chosen")
            setTimeout(() => {
                setMessage(null);
            }, 5000);
            //setReportItems([<h3 style={{margin: 10+"%"}}>No Report Selected</h3>]);
            return;
        }
    }

    const ChangeReportToGenerate = (nextReport) => {
        setReportItems([]);
        setReportToGenerate(nextReport);
        
        if (nextReport != "Sales Report") {
            setEmployeeFilter("");
            setItemsFilter("");
            setOrderNumberFilter("");
            setTotalFilter("");
        }
    }

      return (
        <div className="Reports">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <React.Fragment>
                <br></br>
                <h2 className="display-8 text-center">{screenText["Manager Reports"]}</h2>
                <br></br>
                {message && (
                <React.Fragment>
                    <Alert className="text-center" variant="danger">
                    {message}
                    </Alert>
                    <br></br>
                </React.Fragment>
                )}
                <form style={{width: 43+"%", float: "left"}}>
                <div class="form-group row">
                    <label for="report" class="col-sm-2 col-form-label" align="right">{screenText["Start Date"]}</label>
                        <div class="col-sm-3">
                    <input type="date" class="form-control" id="startDate" name="startDate" min="2022-09-26" 
                        onChange={(e) => {
                        var minDate = e.target.value;
                        document.getElementById('endDate').setAttribute("min", minDate);
                        setStartDate(minDate);
                      }}></input>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="report" class="col-sm-2 col-form-label" align="right">{screenText["End Date"]}</label>
                    <div class="col-sm-3">
                        <input type="date" class="form-control" id="endDate" name="endDate" min="2022-09-26" 
                        onChange={(e) => {
                        var maxDate = e.target.value;
                        setEndDate(maxDate);
                      }}></input>
                    </div>
                </div>
                <fieldset class="form-group">
                    <div class="row">
                    <legend class="col-form-label col-sm-2 pt-0" align="right">{screenText["Choose Report"]}</legend>
                    <div class="col-sm-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="gridReport" id="report" value="option1" onClick={() => ChangeReportToGenerate("Total Revenue")}></input>
                            <label class="form-check-label" for="gridRadios1">{screenText["Total Revenue"]}</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="gridReport" id="report" value="option3" onClick={() => ChangeReportToGenerate("Excess")}></input>
                            <label class="form-check-label" for="gridRadios2">{screenText["Excess Report"]}</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="gridReport" id="report" value="option3" onClick={() => ChangeReportToGenerate("Restock Report")}></input>
                            <label class="form-check-label" for="gridRadios2">{screenText["Restock Report"]}</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="gridReport" id="report" value="option2" onClick={() => ChangeReportToGenerate("Sales Report")}></input>
                            <label class="form-check-label" for="gridRadios2">{screenText["Sales Report"]}</label>
                        </div>
                        <div class="form-check check">
                            <input class="form-check-input" type="radio" name="gridReport" id="report" value="option3" onClick={() => ChangeReportToGenerate("Sell Together")}></input>
                            <label class="form-check-label" for="gridRadios3">{screenText["Sells-Together Report"]}</label>
                            <Form.Group className="mb-2">
                            <Form.Select
                                aria-label="SearchItem"
                                value={sellsTogetherSearchItem}
                                width="300"
                                onChange={(e) => {
                                setSellsTogetherSearchItem(e.target.value);
                                }}
                                style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}
                                >
                                    {mapMenuItems()}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                    </div>
                </fieldset>
                <Button class="btn btn-primary" style={{marginLeft: 18+"%"}} onClick={() => generateReport()}>{screenText["Process"]}</Button>
            </form>
            <div className="Report Generated" style={{width: 55+"%", height: 70+"vh", float: "right"}}>
                {(reportToGenerate == "Sales Report") ? (
                    <React.Fragment>
                    <div className="d-flex justify-content-center" style={{}}>
                        <input style={{width: 24+"%", margin: 0.75+"%"}} type="text" placeholder={"Items Filter"} id="items" onChange={(e) => setItemsFilter(e.target.value)}>
                        </input>                        
                        <input style={{width: 24+"%", margin: 0.75+"%"}} type="text" placeholder={"Total Filter"} id="price" onChange={(e) => setTotalFilter(e.target.value)}>
                        </input>
                        <input style={{width: 24+"%", margin: 0.75+"%"}} type="text" placeholder={"Employee ID Filter"} id="employeeID" onChange={(e) => setEmployeeFilter(e.target.value)}>
                        </input>
                        <input style={{width: 24+"%", margin: 0.75+"%"}} type="text" placeholder={"Order Number"} id="OrderNumber" onChange={(e) => setOrderNumberFilter(e.target.value)}>
                        </input>
                    </div>
                    <Button class="btn btn-primary" style={{marginLeft: 43.5+"%"}} onClick={() => generateReport()}>Filter Results</Button>
                    <div style={{height: 65+"vh", marginTop: 1+"%", overflowY: "scroll"}}>
                        {reportItems}
                    </div>
                    </React.Fragment>
                ) : (
                    <div style={{height: 70+"vh", overflowY: "scroll"}}>
                    {reportItems}
                    </div>
                )}
            </div>
            </React.Fragment>
        )
      }
      </div>
      );
  
  
  }
  
Reports.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  
  export default connect(mapStateToProps)(Reports);