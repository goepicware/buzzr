/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ContentLoader from "react-content-loader";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import axios from "axios";
import cookie from "react-cookies";
import {
  stripslashes,
  showPrice,
  encodeValue,
  showLoader,
  hideLoader,
} from "../Settings/SettingHelper";
import { apiUrl, deliveryId, unquieID } from "../Settings/Config";
import Cart from "./Cart";
import barrow from "../../common/images/back-arrow.svg";
import sampleimg from "../../common/images/sample.png";
import plusi from "../../common/images/plus.svg";
import minusi from "../../common/images/minus.svg";
var qs = require("qs");
class CartList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartdetails: [],
      displayCart: "",
      trigerCart: false,
      loader: true,
      cartItemID: "",
      openFilterSheet: true,
    };
  }
  componentDidMount() {
    $("body").addClass("hide-overlay");
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.cartdetails !== PropsDt.cartdetails) {
      this.setState(
        { cartdetails: PropsDt.cartdetails, loader: false },
        function () {
          this.loadCartItem();
        }
      );
    }
  }
  sateValChange = (field, value) => {
    this.setState({ [field]: value });
  };
  loadCartItem() {
    var displayCart = "";
    if (Object.keys(this.state.cartdetails).length > 0) {
      if (this.state.cartdetails.store.length > 0) {
        displayCart = this.state.cartdetails.store.map((store) => {
          return (
            <li>
              <div className="cart-outlet-title">
                <h3>{store.storeName}</h3>
              </div>
              {store.item.length > 0 &&
                store.item.map((ProItem, proIndex) => {
                  return (
                    <div
                      className="cart-product-cover"
                      id={"cart_" + ProItem.itemID}
                      key={proIndex}
                    >
                      <div className="cart-product-flex">
                        <div class="edit_custom_radio ">
                          <input type="checkbox" />
                        </div>
                        <div className="product-img">
                          <img src={sampleimg} alt="Eats Image" />
                        </div>
                        <div className="product-desc">
                          <h3 className="ot-title">
                            {stripslashes(ProItem.itemName)}
                          </h3>
                          {ProItem.comboset.length > 0 && (
                            <div className="otp-desc-comob">
                              {ProItem.comboset.map((comboItem, comobIndex) => {
                                return (
                                  <p key={comobIndex}>
                                    <strong>{comboItem.comboSetname}</strong>
                                    <br />
                                    {comboItem.productDetails.length > 0 &&
                                      comboItem.productDetails.map(
                                        (comobPro, comboProIndex) => {
                                          return (
                                            <span key={comboProIndex}>
                                              {comboProIndex !== 0 && " + "}
                                              {stripslashes(
                                                comobPro.productName
                                              )}
                                              {parseInt(comobPro.quantity) >
                                                0 && "X " + comobPro.quantity}
                                              {parseFloat(
                                                comobPro.productPrice
                                              ) > 0 && (
                                                <>
                                                  (+
                                                  {showPrice(
                                                    comobPro.productPrice
                                                  )}
                                                  )
                                                </>
                                              )}
                                            </span>
                                          );
                                        }
                                      )}
                                  </p>
                                );
                              })}
                            </div>
                          )}
                          <div className="pro-action">
                            <div className="pro-price">
                              {showPrice(ProItem.itemTotalPrice)}
                            </div>
                            <div className="pro-qtybx">
                              <div className="qty-bx">
                                <span
                                  className="qty-minus"
                                  onClick={this.proQtyIncDecUpdate.bind(
                                    this,
                                    ProItem.itemID,
                                    ProItem.itemQuantity,
                                    store.storeID,
                                    "decr"
                                  )}
                                >
                                  <img src={minusi} alt="Minus" />
                                </span>
                                <input
                                  type="text"
                                  placeholder="0"
                                  value={ProItem.itemQuantity}
                                />
                                <span
                                  className="qty-plus"
                                  onClick={this.proQtyIncDecUpdate.bind(
                                    this,
                                    ProItem.itemID,
                                    ProItem.itemQuantity,
                                    store.storeID,
                                    "inc"
                                  )}
                                >
                                  <img src={plusi} alt="Plus" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </li>
          );
        });
      }
    }
    hideLoader("cart_" + this.state.cartItemID);
    this.setState({ displayCart: displayCart, cartItemID: "" }, function () {});
  }
  proQtyIncDecUpdate(itemID, itemQuantity, storeID, type) {
    var updQty = 0;
    if (type === "inc") {
      updQty = parseInt(itemQuantity) + 1;
    } else {
      updQty = parseInt(itemQuantity) - 1;
    }
    this.setState({ cartItemID: itemID }, function () {
      showLoader("cart_" + itemID);
    });
    var postObject = {
      unquieid: unquieID,
      availabilityID: deliveryId,
      locationID: cookie.load("locationID"),
      shopID: encodeValue(storeID),
      customerID: cookie.load("customerID"),
      itemID: itemID,
      quantity: updQty,
    };

    axios
      .post(apiUrl + "cart/updateCartItem", qs.stringify(postObject))
      .then((res) => {
        // hideLoader("proDtIndex-" + IndexFlg, "Idtext");

        if (res.data.status === "ok") {
          this.setState({ trigerCart: true });
          /*  removePromoCkValue();
            this.handleShowAlertFun(
              "Success",
              "Great choice! Item added to your cart."
            ); */
        } else if (res.data.status === "error") {
          /*   var errMsgtxt =
              res.data.message !== ""
                ? res.data.message
                : "Sorry! Products can`t add your cart.";
            showCustomAlert("error", errMsgtxt);
            this.handleShowAlertFun("Error", errMsgtxt); */
        }

        return false;
      });
  }
  render() {
    return (
      <div className="main-div">
        <Cart
          sateValChange={this.sateValChange}
          trigerCart={this.state.trigerCart}
        />
        <div className="header-action header-action-center">
          <div className="container">
            <div className="hac-lhs">
              <Link to={"/"} className="arrow-back">
                <img src={barrow} />
              </Link>
            </div>
            <div className="ha-middle">Cart</div>
            <div className="ha-rhs ha-rhs-link">
              <a href="#">Edit</a>
            </div>
          </div>
        </div>
        <div className="content-body rel">
          <div className="container">
            <div className="cart-list">
              <ul>
                {this.state.loader === true
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
                  : this.state.displayCart}
              </ul>
            </div>
          </div>
        </div>
        {this.state.loader === false && (
          <BottomSheet
            open={this.state.openFilterSheet}
            className="bottomSheetMain cart-btm-btn"
            blocking={false}
          >
            <div className="order-full">
              <Link to={"/transaction-order"} className="button of-btn">
                Order
              </Link>
            </div>
          </BottomSheet>
        )}
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var cartdetailsArr = Array();
  if (Object.keys(state.cartdetails).length > 0) {
    if (state.cartdetails[0].status === "ok") {
      cartdetailsArr = state.cartdetails[0].result;
    }
  }
  return {
    cartdetails: cartdetailsArr,
  };
};

export default connect(mapStateTopProps)(withRouter(CartList));
