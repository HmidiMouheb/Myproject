import React, { Component } from "react";
import { FormSelect } from "shards-react";
import MyCard from "./Card/MyCard";
import NavMenu from "./NavBar/NavMenu";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./UserPage.css";
import UserPostsSearch from "./UserPostsSearch/UserPostsSearch";
import ModalAddEdit from "./Modal/ModalAddEdit";
// USER_POSTS_ACTIONS
import GetAllUserPosts from "../Redux/actions/UserPostsActions/GetAllUserPosts";
import jwt from "jsonwebtoken";
import { Modal } from "react-bootstrap";

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getAllUserPosts(id);
  }

  isUserInHisProfile = tokenDecoded => {
    const { id } = this.props.match.params;
    if (tokenDecoded && tokenDecoded.sub.id == id) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { id } = this.props.match.params;
    console.log(id);
    return (
      <>
        <NavMenu
          isUser={jwt.decode(localStorage.getItem("jwt"))}
          usedForHome={false}
        />
        {this.isUserInHisProfile(jwt.decode(localStorage.getItem("jwt"))) && (
          <ModalAddEdit isUser={jwt.decode(localStorage.getItem("jwt"))} />
        )}
        {this.props.user.posts ? (
          <div className="user-page-container">
            <img
              src="https://bcdcog.com/wp-content/uploads/2016/05/profile-default-02.png"
              alt="user-profile-pic"
            />
            {this.props.match.params.id && (
              <UserPostsSearch id={this.props.match.params.id} />
            )}
            {this.props.user.posts.length ? (
              this.props.user.posts.map((post, i) => {
                return (
                  <MyCard
                    key={i}
                    post={post}
                    isUser={jwt.decode(localStorage.getItem("jwt"))}
                  />
                );
              })
            ) : (
              <div>User has no posts</div>
            )}
          </div>
        ) : (
          <h1>...LOADING</h1>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.UserPostsReducer.user
});
const mapDispatchToProps = dispatch => ({
  getAllUserPosts: bindActionCreators(GetAllUserPosts, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
