/**
 * @file App.js - Creates an application using all the different routes to connect to our react components
 */

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login/login";
import Register from "./components/Login/register";
import Landing from "./components/Gen/landing";
import NavBar from "./components/Gen/NavBar";
import UserMenu from "./components/User/menu";
import UserBag from "./components/User/bag";
import UserSettings from "./components/User/settings";
import Help from "./components/User/help";
import FindStore from "./components/User/findStore";
import ProcessOrders from "./components/Cashier/processOrders";
import AdjustMenu from "./components/Manager/adjustMenu";
import Reports from "./components/Manager/reports";
import AddMenuItem from "./components/Manager/addMenuItem";

import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import jwt_decode from "jwt-decode";
import PrivateUserRoute from "./components/private-routes/PrivateUserRoute";
import PrivateManagerRoute from "./components/private-routes/PrivateManagerRoute";
import PrivateCashierRoute from "./components/private-routes/PrivateCashierRoute";
import PrivateOnlineUserRoute from "./components/private-routes/PrivateOnlineUserRoute";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds

  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

/**
 * A function that sets each route to the component it is assigned to
 * @returns React html
 */
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Landing} />
          <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/menu" component={UserMenu} />
              <Route exact path="/findStore" component={FindStore} />
              <PrivateOnlineUserRoute exact path="/settings" component={UserSettings} />
              <PrivateUserRoute exact path="/bag" component={UserBag} />
              <PrivateUserRoute exact path="/help" component={Help} />
              <PrivateCashierRoute exact path="/processOrders" component={ProcessOrders} />
              <PrivateManagerRoute exact path="/adjustMenu" component={AdjustMenu} />
              <PrivateManagerRoute exact path="/reports" component={Reports} />
              <PrivateManagerRoute exact path="/addMenuItem" component={AddMenuItem} />
              
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
