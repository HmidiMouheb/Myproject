import React, { Component } from "react";
import "./MyCard.css";
import { Image } from "react-bootstrap";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardImg,
  CardBody,
  CardFooter,
  Button
} from "shards-react";
import { connect } from "react-redux";
import ModalAddEdit from "../Modal/ModalAddEdit";
import axios from "axios";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
// REDUX_ACTIONS
import GetAllPosts from "../../Redux/actions/GetAllPosts";
import GetAllUserPosts from "../../Redux/actions/UserPostsActions/GetAllUserPosts";

class MyCard extends Component {
  state = {
    delete: false
  };

  handleDelete = () => {
    const { _id } = this.props.post;
    axios.defaults.headers.common["auth"] = localStorage.getItem("jwt")
      ? localStorage.getItem("jwt")
      : undefined;
    axios
      .delete("/api/delete_post", {
        params: {
          id: _id
        }
      })
      .then(res => {
        this.props.getAllPosts();
      })
      .catch(err => console.log(err));
  };

  handleLike = () => {
    if (this.props.isUser) {
      const { _id } = this.props.post;

      axios.defaults.headers.common["auth"] = localStorage.getItem("jwt")
        ? localStorage.getItem("jwt")
        : undefined;

      axios
        .put("/api/add_like", {
          id: _id
        })
        .then(res => {
          console.log(res.data);
          
        })
        .catch(err => console.log(err));
    }
  };
  render() {
    // console.log(this.props.isUser);
    const { postTitle, postDescription, phoneNumber, likers } = this.props.post;
    const { userName, _id } = this.props.post.user;
    return (
      <Card className="card" style={{ maxWidth: "300px" }}>
        <CardHeader className="card-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image
              style={{ width: "50px", height: "50px" }}
              roundedCircle
              src="https://place-hold.it/300x200"
            />
            <div className="username-n-phone">
              <Link
                to={`/userpage/${_id}`}
                onClick={() => {
                  this.props.getAllUserPosts(_id);
                }}
              >
                <h6 style={{ marginBottom: "0px" }}>{userName}</h6>
              </Link>
              <p style={{ margin: "0px" }}>
                {phoneNumber ? `+216 ${phoneNumber}` : "no phonenumber"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardImg src="https://place-hold.it/300x200" />
        <CardBody>
          
          <i
            onClick={() => this.props.isUser && this.handleLike()}
            className="fas fa-heart heart-icon heart-icon"
          ></i>
          {likers.length} Likes
          <CardTitle>{postTitle}</CardTitle>
          <p>{postDescription}</p>
          {this.props.isUser && this.props.isUser.sub.id === _id ? (
            <div className="edit-delete-grp-btn">
              <ModalAddEdit
                post={this.props.post}
                usedForEdit={true}
                isUser={this.props.isUser}
              />
              <Button squared theme="danger" onClick={this.handleDelete}>
                Delete
              </Button>
            </div>
          ) : null}
        </CardBody>
        <CardFooter>Card footer</CardFooter>
      </Card>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getAllPosts: bindActionCreators(GetAllPosts, dispatch),
  getAllUserPosts: bindActionCreators(GetAllUserPosts, dispatch)
});

export default connect(null, mapDispatchToProps)(MyCard);
