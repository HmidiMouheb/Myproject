import React, { Component } from "react";
import NavMenu from "./NavBar/NavMenu";
import MyCard from "./Card/MyCard";
import ModalAddEdit from "./Modal/ModalAddEdit";
import Register from "./Register/Register";
import Login from "./Login/Login";
import { Container } from "react-bootstrap";
import GetAllCategories from "../Redux/actions/GetAllCategories";
import GetAllPosts from "../Redux/actions/GetAllPosts";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./Home.css";
import jwt from "jsonwebtoken";

class Home extends Component {
  componentDidMount() {
    this.props.getAllPosts();
  }
  render() {
    // console.log(this.props.posts);
    // console.log(this.props.loadingPosts);
    return (
      <div>
        <NavMenu
          isUser={jwt.decode(localStorage.getItem("jwt"))}
          usedForHome={true}
        />
        {jwt.decode(localStorage.getItem("jwt")) && (
          <ModalAddEdit isUser={jwt.decode(localStorage.getItem("jwt"))} />
        )}
        <Container>
          <div className="all-cards">
            {this.props.posts.map((post, i) => {
              return (
                <MyCard
                  isUser={localStorage.getItem("jwt")}
                  post={post}
                  key={i}
                />
              );
            })}
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.PostsReducer.posts,
  loadingPosts: state.PostsReducer.loading
});
const mapDispatchToProps = dispatch => ({
  getAllCategories: bindActionCreators(GetAllCategories, dispatch),
  getAllPosts: bindActionCreators(GetAllPosts, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
