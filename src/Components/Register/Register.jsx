import React, { Component } from "react";
import "./Register.css";
import { Form, Alert } from "react-bootstrap";
import { Button, Container, FormCheckbox } from "shards-react";
import { MDBInput, MDBIcon, MDBBtn } from "mdbreact";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

export default class Register extends Component {
  state = {
    userName: "",
    email: "",
    password: "",
    startTestingUsername: false,
    startTestingEmail: false,
    startTestingPassword: false,
    termsAccepted: false,
    showPassword: false,
    alertUser: false,
    alreadyUsed: false,
    whichIsUsed: "",
    isRegistered: false
  };

  testHandlerEmail = e => {
    const regExp = /[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\.(a(?:[cdefgilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abdefghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delmnoqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|obi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p(?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklmnortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\b){1,2}/;
    if (this.state.startTestingEmail) {
      if (regExp.test(e.target.value)) {
        this.setState({ email: e.target.value });
      } else {
        this.setState({ email: "" });
      }
    }
  };

  testHandlerUsername = e => {
    const regExp = /^[a-zA-Z0-9][a-zA-Z0-9_]{2,15}$/;
    if (this.state.startTestingUsername) {
      if (regExp.test(e.target.value)) {
        this.setState({ userName: e.target.value });
      } else {
        this.setState({ userName: "" });
      }
    }
  };

  testHandlerPassword = e => {
    const regExp = /^([a-zA-Z0-9@*#]{8,15})$/;
    if (regExp.test(e.target.value)) {
      this.setState({ password: e.target.value });
    } else {
      this.setState({ password: "" });
    }
  };

  showPasswordHandler = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  submitHandler = () => {
    const { userName, email, password, termsAccepted } = this.state;
    if (!userName || !email || !password || !termsAccepted) {
      this.setState({ alertUser: true });
    } else {
      this.setState({ alertUser: false });
      axios
        .post("/api/register", {
          userName: userName,
          email: email,
          password: password,
          termsAccepted: termsAccepted
        })
        .then(res => {
          if (res.data.errmsg && res.data.errmsg.includes("email")) {
            this.setState({ whichIsUsed: "email already used" });
          } else if (res.data.errmsg && res.data.errmsg.includes("userName")) {
            this.setState({ whichIsUsed: "userName already used" });
          } else {
            this.setState({
              isRegistered: true,
              userName: "",
              email: "",
              password: ""
            });
            console.log(res.data);
            localStorage.setItem("jwt", res.data);
          }
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container>
        <div className="register-page-container">
          <Link to="/Home">
            <h1 className="logo-name">Upper</h1>
          </Link>
          <h4 className="call-to-register">Register Now!</h4>
          <Form className="form-container">
            <Form.Group controlId="validationFormUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                style={{ fontWeight: "normal" }}
                onChange={e => this.testHandlerUsername(e)}
                onClick={() => this.setState({ startTestingUsername: true })}
                onBlur={() => this.setState({ startTestingUsername: false })}
                type="username"
                placeholder="Enter username"
                maxLength="15"
                // value={this.state.userName}
              />
              <Form.Text className="text-muted">
                {this.state.userName ? (
                  <p
                    style={{
                      margin: "0px",
                      padding: "0px",
                      color: "green",
                      fontWeight: "normal"
                    }}
                  >
                    Valid Username <span>&#10003;</span>
                  </p>
                ) : this.state.startTestingUsername ? (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "red"
                    }}
                  >
                    Please enter a valid Username
                  </p>
                ) : (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "#006fe6"
                    }}
                  >
                    Enter your Username{" "}
                    <span style={{ fontWeight: "normal", color: "red" }}>
                      ( "required" )
                    </span>
                  </p>
                )}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                style={{ fontWeight: "normal" }}
                onChange={e => this.testHandlerEmail(e)}
                onClick={() => this.setState({ startTestingEmail: true })}
                onBlur={() => this.setState({ startTestingEmail: false })}
                type="email"
                placeholder="Enter email"
                // value={this.state.email}
              />
              <Form.Text className="text-muted">
                {this.state.email ? (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "green"
                    }}
                  >
                    Valid E-mail <span>&#10003;</span>
                  </p>
                ) : this.state.startTestingEmail ? (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "red"
                    }}
                  >
                    Please enter a valid E-mail
                  </p>
                ) : (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "#006fe6"
                    }}
                  >
                    Enter your E-mail{" "}
                    <span style={{ fontWeight: "normal", color: "red" }}>
                      ( "required" )
                    </span>
                    .
                  </p>
                )}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                style={{ fontWeight: "normal" }}
                onChange={e => this.testHandlerPassword(e)}
                onClick={() => this.setState({ startTestingPassword: true })}
                onBlur={() => this.setState({ startTestingPassword: false })}
                maxLength="15"
                type={this.state.showPassword ? "text" : "password"}
                placeholder="Password"
                // value={this.state.password}
              />
              <Form.Text className="text-muted input-description">
                {this.state.password ? (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "green"
                    }}
                  >
                    Valid Password <span>&#10003;</span>
                  </p>
                ) : this.state.startTestingEmail ? (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "red"
                    }}
                  >
                    Please enter a valid Password
                  </p>
                ) : (
                  <p
                    style={{
                      fontWeight: "normal",
                      margin: "0px",
                      padding: "0px",
                      color: "#006fe6"
                    }}
                  >
                    Enter your Password{" "}
                    <span style={{ fontWeight: "normal", color: "red" }}>
                      ( "required" )
                    </span>
                  </p>
                )}
                {this.state.showPassword ? (
                  <i
                    onClick={this.showPasswordHandler}
                    className="fas fa-eye open-eye-icon"
                    style={{ color: "black" }}
                  ></i>
                ) : (
                  <i
                    onClick={this.showPasswordHandler}
                    className="fas fa-eye-slash closed-eye-icon"
                  ></i>
                )}
              </Form.Text>
            </Form.Group>
            <div className="check-n-submit">
              <Form.Group controlId="formBasicCheckbox">
                <div className="check-n-text">
                  <MDBInput
                    type="checkbox"
                    className="check-box"
                    id="checkbox1"
                    onClick={e => {
                      this.setState(
                        {
                          termsAccepted: !this.state.termsAccepted
                        },
                        () => console.log(this.state.termsAccepted)
                      );
                    }}
                    value={this.state.termsAccepted}
                  ></MDBInput>
                  <p className="check-text">
                    I accept the
                    <Link className="terms-n-service"> Terms of Service</Link>
                  </p>
                </div>
              </Form.Group>
            </div>
            <div className="connect-with">
              {this.state.alertUser ? (
                <p className="alert">Please fill all the fields</p>
              ) : null}
              {this.state.whichIsUsed ? <p>{this.state.whichIsUsed}</p> : null}
              {this.state.isRegistered ? <p>you are now registered</p> : null}
              {this.state.isRegistered ? <Redirect to="/" /> : null}
              <MDBBtn
                social="fb"
                className="fb-social-button social"
                onClick={this.submitHandler}
              >
                Register on Upper
              </MDBBtn>
            </div>
          </Form>
        </div>
      </Container>
    );
  }
}
