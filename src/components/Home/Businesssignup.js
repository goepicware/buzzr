/* eslint-disable */
import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

import logo from "../../common/images/logo.svg";
import nicon from "../../common/images/nav-icon.svg";
import businessman from "../../common/images/business-man.svg";

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
            <div className="logo">
              <a href="#">
                <img src={logo} alt="logo" />
              </a>
            </div>
            <div className="nav-icon">
              <a href="#">
                <img src={nicon} />
              </a>
            </div>
          </div>
        </header>
        <section className="grey-banner"></section>
        <section className="main-body">
          <div className="container">
            <div className="greybox">
              <div className="greybox-header textcenter">
                <img src={businessman} />
                <h2>
                  Are you an <span>Business Owner ?</span>
                </h2>
              </div>
              <div className="greybox-body">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Your Email Address" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Your Phone No" />
                </div>
                <div className="form-group form-custm-chkbox">
                  <div className="cbox1">
                    <input type="checkbox" />
                    <span>
                      I confirm I have read and accept the{" "}
                      <a href="#">Terms & Conditions, Privacy Policy</a> and the{" "}
                      <a href="#">PDPA consent.</a>
                    </span>
                  </div>
                  <div className="cbox1">
                    <input type="checkbox" />
                    <span>
                      I'd like to receive news, updates and promotions from
                      Buzzr via email and sms
                    </span>
                  </div>
                </div>
                <div className="submit-btn-main">
                  <button type="submit" className="button">
                    Signup Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="footer-btm textcenter">
          <div className="container">
            <div className="footer-logo">
              <a href="#">
                {" "}
                <img src={logo} alt="logo" />{" "}
              </a>
            </div>
            <div className="suport-logo">
              Any issue with your order please contact us via
              <a href="#"> support@buzzr.world</a>
            </div>
            <div className="copyright">© 2023 BUZZR. ALL RIGHTS RESERVED</div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
