import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import NavMenu from "./Components/NavBar/NavMenu";
import Home from "./Components/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import UserPage from "./Components/UserPage";
import EditProfile from "./Components/EditProfile";
// ACTIONS
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GetAllUserPosts from "./Redux/actions/UserPostsActions/GetAllUserPosts";
import GetAllCategories from "./Redux/actions/GetAllCategories";
import jwt from "jsonwebtoken";

class App extends React.Component {
  componentDidMount() {
    this.props.getAllCategories();
  }
  render() {
    console.log("app is rendering");
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/Register">
            <Register />
          </Route>
          <Route path="/Login">
            <Login />
          </Route>
          <Route exact path={["/Home", "/"]}>
            <Home />
          </Route>
          <Route path="/userpage/:id" component={UserPage} />
          <Route
            path="/editProfile/:id"
            render={() => (
              <EditProfile isUser={jwt.decode(localStorage.getItem("jwt"))} />
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  getAllCategories: bindActionCreators(GetAllCategories, dispatch)
});

export default connect(null, mapDispatchToProps)(App);
