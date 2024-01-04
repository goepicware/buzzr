/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import ContentLoader from "react-content-loader";
import { GET_STORE_LIST } from "../../actions";
import cart from "../../common/images/cart.svg";
import wishlist from "../../common/images/wishlist.svg";
import ypin from "../../common/images/map-pin-yellow.svg";
import barrow from "../../common/images/back-arrow.svg";

import searchg from "../../common/images/search-green.svg";
import kasa1 from "../../common/images/kasa.png";
import ot from "../../common/images/outlet-place.png";
import ot1 from "../../common/images/outlet-place1.png";

class Allrestaurants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      storeList: [],
      locationName:
        cookie.load("locationName") !== "" &&
        typeof cookie.load("locationName") !== undefined &&
        typeof cookie.load("locationName") !== "undefined"
          ? cookie.load("locationName")
          : "",
      locationImage:
        cookie.load("locationImage") !== "" &&
        typeof cookie.load("locationImage") !== undefined &&
        typeof cookie.load("locationImage") !== "undefined"
          ? cookie.load("locationImage")
          : "",
      storeDisplay: "",
      keywords: "",
    };
  }
  componentDidMount() {
    if (
      cookie.load("locationID") !== "" &&
      typeof cookie.load("locationID") !== undefined &&
      typeof cookie.load("locationID") !== "undefined"
    ) {
      this.props.getStoreList(
        "&dellocation=" +
          cookie.load("locationID") +
          "&latitude=" +
          cookie.load("deliveryaddresslat") +
          "&longitude=" +
          cookie.load("deliveryaddresslong")
      );
    }
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.storeList !== PropsDt.storeList) {
      this.setState(
        { storeList: PropsDt.storeList, loading: false },
        function () {
          this.displayStore();
        }
      );
    }
  }
  handleChange(e) {
    this.setState({ keywords: e.target.value }, function () {
      this.displayStore();
    });
  }
  displayStore() {
    var storeDisplay = "";
    if (this.state.storeList.length > 0) {
      storeDisplay = this.state.storeList.map((item, index) => {
        var checking = "Yes";
        if (this.state.keywords !== "") {
          if (
            item.storeName
              .toLowerCase()
              .indexOf(this.state.keywords.toLowerCase()) >= 0
          ) {
            checking = "Yes";
          } else {
            checking = "No";
          }
        }
        if (checking === "Yes") {
          return (
            <li key={index}>
              <Link to={"/restaurant/" + item.storeSlug} className="ot-parent">
                <div className="ot-img">
                  <img
                    src={
                      item.storeImage !== "" && item.storeImage !== null
                        ? item.storeImage
                        : ot
                    }
                    alt={item.storeName}
                  />
                </div>
                <div className="ot-info">
                  <h3 className="ot-title">{item.storeName}</h3>
                  <div className="km-rating">
                    <strong>0.3 km</strong>
                    <span>4.8 (1,298)</span>
                  </div>
                  <div className="op-time">Open 09.00 - 17.00 WIB</div>
                  <div className="ot-keyword">
                    Food, Chicken, Burger, Nasi, Bento
                  </div>
                  <div className="ot-offers">
                    Save 20% promo, Free Shipping, etc
                  </div>
                </div>
              </Link>
            </li>
          );
        }
      });
    }
    this.setState({ storeDisplay: storeDisplay });
  }
  render() {
    return (
      <div className="main-div">
        <div className="header-action header-action-center">
          <div className="container">
            <div className="hac-lhs">
              <a href="#" className="arrow-back">
                <img src={barrow} />
              </a>
            </div>
            <div className="ha-middle">Near me</div>
            <div className="ha-rhs">
              <ul>
                <li>
                  <a href="#">
                    <img src={wishlist} />
                  </a>
                </li>
                <li>
                  <Link to={"/cart"}>
                    <img src={cart} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="content-body rel">
          <div className="container">
            {this.state.locationName !== "" && (
              <div className="eats-area">
                <div className="ea-lhs">
                  <span>Eats Area</span>
                  <p>
                    <img src={ypin} /> {this.state.locationName}
                  </p>
                </div>
                <div className="ea-rhs">
                  {this.state.locationImage !== "" && (
                    <img
                      src={this.state.locationImage}
                      alt={this.state.locationName}
                      title={this.state.locationName}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="main-search">
              <div className="ms-inner">
                <img src={searchg} alt="voucher" />
                <input
                  type="text"
                  className="input-fill"
                  placeholder="Find your Restaurants"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="outlet-listing">
              <div className="outlet-main-list">
                <ul>
                  {" "}
                  {this.state.loading === true
                    ? Array(1, 2, 3).map((item) => {
                        return (
                          <li key={item}>
                            <ContentLoader viewBox="0 0 380 70">
                              <rect
                                x="0"
                                y="0"
                                rx="5"
                                ry="5"
                                width="70"
                                height="70"
                              />
                              <rect
                                x="80"
                                y="17"
                                rx="4"
                                ry="4"
                                width="300"
                                height="13"
                              />
                              <rect
                                x="80"
                                y="40"
                                rx="3"
                                ry="3"
                                width="250"
                                height="10"
                              />
                            </ContentLoader>
                          </li>
                        );
                      })
                    : this.state.storeDisplay}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var storelistArr = Array();
  if (Object.keys(state.storelist).length > 0) {
    if (state.storelist[0].status === "ok") {
      storelistArr = state.storelist[0].result;
    }
  }
  return {
    storeList: storelistArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStoreList: (params) => {
      dispatch({ type: GET_STORE_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Allrestaurants));
