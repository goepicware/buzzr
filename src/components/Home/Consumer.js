/* eslint-disable */
import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

import logo from "../../common/images/logo.svg";
import nicon from "../../common/images/nav-icon.svg";
import desi from "../../common/images/desigual.svg";
import globe from "../../common/images/globe.svg";
import calla from "../../common/images/phone-call.svg";
import walletlight from "../../common/images/voucher.svg";
import orange from "../../common/images/orange-shape.svg";

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
                <img src={logo} />
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
            <div className="container-small">
              <div className="spread">
                <div className="abstract">
                  <figure>
                    <img src={desi} />
                  </figure>
                  <div className="abstract-desc">
                    <div className="abd-title">
                      <h3>Desigual Clothing Store</h3>
                      <a href="#" className="button ghost-button">
                        Available Locations
                      </a>
                    </div>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting.
                    </p>
                    <ul>
                      <li>
                        {" "}
                        <a href="#">
                          <img src={globe} /> www.desigual.com
                        </a>{" "}
                      </li>
                      <li>
                        {" "}
                        <a href="#">
                          <img src={calla} /> +65 1345 7895
                        </a>{" "}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="summary">
                  <div className="blk-summary textcenter">
                    This Deal Is Referred By <strong>Mr.Beast</strong>
                  </div>
                  <div className="orange-banner"></div>
                  <div className="credit-list">
                    <ul>
                      <li>
                        <div className="list-parent">
                          <figure>
                            {" "}
                            <img src={walletlight} />{" "}
                          </figure>
                          <div className="buy-credit-txt">
                            <h2>$20 Cash Voucher</h2>
                            <span>
                              Offer Valid - 19th July 2023 00:00 to 20th August
                              2023 00:00 Only redeemable once
                            </span>
                          </div>
                          <div className="credit-offer">
                            <span>Buy For </span>
                            <h2>$20</h2>
                          </div>
                          <img className="last-img" src={orange} />{" "}
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="hoe-to">
                    <h4>How to redeem your voucher</h4>
                    <ol>
                      <li>
                        <span>Visit a participating location</span>
                      </li>
                      <li>
                        <span>Open this email and click the button below</span>
                      </li>
                      <li>
                        <span>
                          Follow the insturctions on the redemption page
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
