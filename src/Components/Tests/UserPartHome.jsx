import React, { Component } from "react";
import {Image} from 'react-bootstrap'
import {Container} from 'shards-react'


export default class UserPartHome extends Component {
  render() {
    return (
      <div>
        <Container>
          <Image
            style={{ width: "50px", height: "50px" }}
            roundedCircle
            src="https://place-hold.it/300x200"
          />
        </Container>
      </div>
    );
  }
}
