import React, { Component } from "react";
import { Container, Card, Image, Button } from "react-bootstrap";
import "./ProductCard.css";

export default class ProductCard extends Component {
  render() {
    return (
      <Container>
        <Card
          className="all-card-elements"
          style={{ width: "25%", height: "50%", marginTop: "8px" }}
        >
          <div className="product-poster">
            <Image
              src="https://i0.wp.com/frfars.org/wp-content/uploads/2018/12/place-holder-for-profile-picture-4.png?ssl=1"
              roundedCircle
              style={{ width: "50px" }}
            />
            <h6 className="product-poster-username">UserName</h6>
          </div>

          <Card.Img
            style={{ width: "100%", height: "200px" }}
            variant="top"
            src="https://i0.wp.com/frfars.org/wp-content/uploads/2018/12/place-holder-for-profile-picture-4.png?ssl=1"
          />
          <Card.Body>
            <i class="fas fa-heart"> 0 Likes</i>
            <Card.Title>Card title</Card.Title>
            <Card.Text className="description" style={{ fontSize: "10px" }}>
              This is a wider card with supporting text below as a natural
              lead-in to additional content. This content is a little bit
              longer.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}
