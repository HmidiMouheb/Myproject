import React, { Component } from "react";
import "./Login.css";
import { Form } from "react-bootstrap";
import { Button, Container, FormCheckbox } from "shards-react";
import { MDBInput, MDBIcon, MDBBtn } from "mdbreact";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

export default class Login extends Component {
  state = {
    usernameOrEmail: "",
    password: "",
    keepMeLogged: false,
    showPassword: false,
    wrongUserNameOrEmail: false,
    wrongPassword: false,
    youRLogged: false
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleLoginOld = () => {
    const { usernameOrEmail, password } = this.state;
    if (usernameOrEmail && password) {
      console.log("submit clicked");
      if (usernameOrEmail.includes("@")) {
        axios
          .get("/api/login_by_email", {
            params: {
              email: usernameOrEmail,
              password: password
            }
          })
          .then(res => {
            if (res.data == false) {
              this.setState({ wrongPassword: true });
              this.setState({ wrongUserNameOrEmail: false });
            }
            if (res.data == "No user found") {
              this.setState({ wrongUserNameOrEmail: true });
            }
            if (res.data == true) {
              this.setState({ wrongPassword: false });
            }
            console.log(res.data);
          })
          .catch(err => console.log(err));
      } else {
        axios
          .get("/api/login_by_userName", {
            params: {
              userName: usernameOrEmail,
              password: password
            }
          })
          .then(res => {
            if (res.data == false) {
              this.setState({ wrongUserNameOrEmail: false });
              this.setState({ wrongPassword: true });
            }
            if (res.data == "No user found") {
              this.setState({ wrongUserNameOrEmail: true });
            }
            if (res.data == true) {
              this.setState({ wrongPassword: false });
            }
            console.log(res.data);
          })
          .catch(err => console.log(err));
      }
    }
  };

  handleLogin = () => {
    const { usernameOrEmail, password } = this.state;
    axios
      .post("/api/login", {
        userName: usernameOrEmail,
        password: password
      })
      .then(res => {
        console.log("res.data", res.data);
        if (res.data) {
          localStorage.setItem("jwt", res.data);
          this.setState({
            wrongUserNameOrEmail: false,
            wrongPassword: false,
            youRLogged: true
          });
        }
      })
      .catch(err => {
        this.setState({ wrongUserNameOrEmail: true, wrongPassword: true });

        console.log("err", err);
      });
  };

  render() {
    return (
      <div>
        <Container>
          <div className="register-page-container">
            <Link to="/">
              <h1 className="logo-name">Upper</h1>
            </Link>
            <h4 className="call-to-register">Login</h4>
            <Form className="form-container">
              <Form.Group controlId="validationFormikUsername">
                <Form.Label>Username or email</Form.Label>
                <Form.Control
                  name="usernameOrEmail"
                  onChange={e => this.handleChange(e)}
                  type="username"
                  maxLength="30"
                  placeholder="Username Or email"
                />
                <Form.Text className="text-muted">
                  <p style={{ margin: "0" }}>Enter your Username or email</p>
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>

                <Form.Control
                  name="password"
                  className="password-case"
                  onChange={e => this.handleChange(e)}
                  type="password"
                  maxLength="15"
                  placeholder="Password"
                />
                <Form.Text className="text-muted">
                  <p style={{ margin: "0" }}>Enter your Password </p>
                </Form.Text>
              </Form.Group>
              <div className="check-n-submit">
                <Form.Group controlId="formBasicCheckbox">
                  <div className="check-n-text">
                    <MDBInput
                      type="checkbox"
                      className="check-box"
                      id="checkbox1"
                      onClick={e =>
                        this.setState({
                          keepMeLogged: !this.state.keepMeLogged
                        })
                      }
                    ></MDBInput>
                    <p className="check-text">Keep me logged in</p>
                  </div>
                </Form.Group>
                {/* <MDBBtn className="submit-button">Login</MDBBtn> */}
              </div>
              <div className="connect-with">
                {this.state.wrongUserNameOrEmail ? (
                  this.state.usernameOrEmail.includes("@") ? (
                    <p className="wrong-email">Wrong email</p>
                  ) : (
                    <p className="wrong-email">Wrong userName</p>
                  )
                ) : null}
                {this.state.wrongPassword ? (
                  <p className="wrong-password">Wrong password</p>
                ) : null}
                {this.state.youRLogged && (
                  <p className="logged-in-msg">you are now logged in</p>
                )}
                {this.state.youRLogged ? <Redirect to="/" /> : null}
                <MDBBtn
                  onClick={this.handleLogin}
                  social="fb"
                  className="fb-social-button social"
                >
                  Login to Upper
                </MDBBtn>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    );
  }
}
