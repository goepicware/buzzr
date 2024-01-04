/* eslint-disable */
import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

import cart from "../../common/images/cart.svg";
import list from "../../common/images/list.svg";

import { go } from "react-router-redux";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { openFilterSheet: false };
  }
  openfilter() {
    this.setState({ openFilterSheet: true });
  }

  render() {
    return (
      <div className="main-div">
        <header className="header-action">
          <div className="container">
            <div className="logo"></div>
            <div className="nav-icon"></div>
          </div>
        </header>
      </div>
    );
  }
}

export default Home;
