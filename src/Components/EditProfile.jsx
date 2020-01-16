import React, { Component } from "react";
import "./EditProfile.css";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import { Container } from "react-bootstrap";

export default class EditProfile extends Component {
  state = {
    changePassword: false,
    accountUpdated: false,
    userName: undefined,
    email: undefined,
    oldPassword: undefined,
    newPassword: undefined,
    submittingNone: false,
    newPasswordReq: false
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = () => {
    const {
      userName,
      email,
      oldPassword,
      newPassword,
      newPasswordReq
    } = this.state;
    if (!userName && !email && !oldPassword && !newPassword) {
      this.setState({ submittingNone: true });
      setTimeout(() => {
        this.setState({ submittingNone: false });
      }, 1000);
    }
    if (oldPassword && !newPassword) {
      this.setState({ newPasswordReq: true });
      setTimeout(() => {
        this.setState({ newPasswordReq: false });
      }, 1000);
    }

    if (userName || email || (oldPassword && newPassword)) {
      axios.defaults.headers.common["auth"] = localStorage.getItem("jwt")
        ? localStorage.getItem("jwt")
        : undefined;

      axios
        .put("/api/update_user", {
          id: this.props.isUser.sub.id,
          userName: this.state.userName ? this.state.userName : undefined,
          email: this.state.email ? this.state.email : undefined,
          oldPassword: this.state.oldPassword
            ? this.state.oldPassword
            : undefined,
          newPassword: this.state.newPassword
            ? this.state.newPassword
            : undefined
        })
        .then(res => {
          console.log(res);
          if (res) {
            this.setState({ accountUpdated: true });
          }
        })
        .catch(err => console.log(err));
    }
  };

  componentDidMount() {
    console.log("i'm mounting");
  }
  render() {
    console.log("i'm rendering");
    return (
      <>
        <Container>
          {jwt.decode(localStorage.getItem("jwt")) ? (
            <div className="Container">
              <Link to="/Home">
                <h1>Upper</h1>
              </Link>
              <input
                type="text"
                name="userName"
                className="input-for-account-edit"
                onChange={e => this.handleChange(e)}
              />
              {"userName"}
              <input
                type="text"
                name="email"
                className="input-for-account-edit"
                onChange={e => this.handleChange(e)}
              />
              {"email"}
              <button
              className="edit-password-button"
                onClick={() => {
                  this.setState({ changePassword: !this.state.changePassword });
                }}
              >
                EditPassword
              </button>
              {this.state.changePassword && (
                <div className="change-password">
                  <h6>Change password</h6>
                  <input
                    type="text"
                    name="oldPassword"
                    className="input-for-account-edit"
                    onChange={e => this.handleChange(e)}
                  />
                  {"old password"}
                  <input
                    type="text"
                    name="newPassword"
                    className="input-for-account-edit"
                    onChange={e => this.handleChange(e)}
                  />
                  {"new password"}
                </div>
              )}
              {this.state.submittingNone ? (
                <p className="submitting-none-errmsg">Write smth to update</p>
              ) : null}
              {this.state.newPasswordReq ? (
                <p className="newpass-req-errmsg">
                  new password is required if you want to change it
                </p>
              ) : null}
              <button className="submit-button" onClick={this.handleSubmit}>
                Submit
              </button>
              {this.state.accountUpdated && (
                <h3>Account information updated</h3>
              )}
            </div>
          ) : null}
        </Container>
      </>
    );
  }
}
