/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ContentLoader from "react-content-loader";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import axios from "axios";
import Cart from "../Cart/Cart";
import {
  stripslashes,
  showPrice,
  encodeValue,
  showLoader,
  hideLoader,
  getCalculatedAmount,
} from "../Settings/SettingHelper";
import { apiUrl, deliveryId, unquieID } from "../Settings/Config";
import barrow from "../../common/images/back-arrow.svg";
import sampleimg from "../../common/images/sample.png";
import plusi from "../../common/images/plus.svg";
import minusi from "../../common/images/minus.svg";
import bike from "../../common/images/bike.svg";
import clock from "../../common/images/scheduleclock.svg";
import printer from "../../common/images/printer.svg";
import bin from "../../common/images/dustbin.svg";
import dbadge from "../../common/images/discount-badge.svg";
import tvoucher from "../../common/images/ticket-voucher.svg";
import paymethod from "../../common/images/pay-method.svg";
import gsend from "../../common/images/gosend.svg";
import grab from "../../common/images/grabexpress.svg";
import ra from "../../common/images/rara.svg";
import mr from "../../common/images/mrspeedy.svg";
import lala from "../../common/images/lalamove.svg";
import closeicon from "../../common/images/close-icon.svg";
import pluswhite from "../../common/images/plus-white.svg";
var qs = require("qs");
class Transactionorder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartdetails: [],
      displayCart: "",
      trigerCart: false,
      cartItemID: "",
      loader: true,
      openFilterSheet: true,
      openVehicleSheet: false,
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
          if (store.item.length > 0) {
            return store.item.map((ProItem, proIndex) => {
              return (
                <li key={proIndex} id={"cart_" + ProItem.itemID}>
                  <div className="ot-top">
                    <div className="otp-img">
                      <img src={sampleimg} />
                    </div>
                    <div className="otp-desc">
                      <div className="otp-desc-lhs">
                        <h3 className="ot-title">
                          {stripslashes(ProItem.itemName)}
                        </h3>
                        {ProItem.comboset.length > 0 && (
                          <div className="otp-desc-comob">
                            {ProItem.comboset.map((comboItem, comobIndex) => {
                              return (
                                <p key={comobIndex}>
                                  <strong>{comboItem.comboSetname}</strong>
                                  {comboItem.productDetails.length > 0 &&
                                    comboItem.productDetails.map(
                                      (comobPro, comboProIndex) => {
                                        return (
                                          <span key={comboProIndex}>
                                            {comboProIndex !== 0 && " + "}
                                            {stripslashes(comobPro.productName)}
                                            {parseInt(comobPro.quantity) > 0 &&
                                              "X " + comobPro.quantity}
                                            {parseFloat(comobPro.productPrice) >
                                              0 && (
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
                      </div>
                      <div className="otp-desc-rhs">
                        <span>{showPrice(ProItem.itemTotalPrice)}</span>
                      </div>
                    </div>
                  </div>
                  {ProItem.itemNotes !== "" && (
                    <div className="ot-note">
                      <span>Note :</span>
                      <p>{stripslashes(ProItem.itemNotes)}</p>
                    </div>
                  )}
                  <div className="ot-btm">
                    <div className="ot-btm-edit">
                      <a href="#">Edit Menu</a>
                    </div>
                    <div className="ot-btm-merge">
                      <div className="ot-btm-delete">
                        <a href="#">
                          <img src={bin} />
                        </a>
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
                            <img src={minusi} />
                          </span>
                          <div className="input-quantity">
                            {ProItem.itemQuantity}
                          </div>
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
                            <img src={plusi} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            });
          }
        });
      }
    }
    hideLoader("cart_" + this.state.cartItemID);
    this.setState({ displayCart: displayCart, cartItemID: "" });
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
  openVehicleType() {
    this.setState({ openVehicleSheet: true });
  }
  render() {
    var priceDetail = getCalculatedAmount(this.state.cartdetails);
    return (
      <div className="main-div">
        <Cart
          sateValChange={this.sateValChange}
          trigerCart={this.state.trigerCart}
        />
        <div className="header-action header-action-center">
          <div className="container">
            <div className="hac-lhs">
              <a href="#" className="arrow-back">
                <img src={barrow} />
              </a>
            </div>
            <div className="ha-middle">Transaction Order</div>
            <div className="ha-rhs ha-rhs-link"></div>
          </div>
        </div>
        <div className="content-body rel">
          <div className="container">
            <div className="order-loc-box">
              <div className="order-loc-box-one">
                <ul>
                  <li>
                    <a href={void 0}>
                      <span></span>
                      {cookie.load("locationAddress")}
                    </a>
                  </li>
                  <li>
                    <a href={void 0}>
                      <span></span> {cookie.load("deliveryaddress")}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="order-loc-box-two">
                <ul>
                  <li>
                    <a href={void 0}>
                      <img src={clock} />
                      <strong>Delivery Type</strong>
                      <span>Instant</span>
                    </a>
                  </li>
                  <li>
                    <a href={void 0} onClick={this.openVehicleType.bind(this)}>
                      <img src={bike} />
                      <strong>Vehicle Type</strong>
                      <span>Choose vehicle type</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="detail-transaction">
              <div className="dt-header">
                <h2>Detail Transaction</h2>
                <a href="#">
                  <img src={pluswhite} />
                  Add Order
                </a>
              </div>
              <div className="dt-body">
                <span>John Doe 0812345678910</span>
                <span>No.order: AB-4567890111213</span>
                <div className="dt-body-img">
                  <img src={printer} />
                </div>
              </div>
            </div>
            <div className="product-order">
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
            <div className="promo-order-boxes">
              <ul>
                <li>
                  <h4>Promo Code</h4>
                  <div className="promo-order">
                    <div className="pro-form-inner">
                      <img src={dbadge} className="dbadge" />
                      <input type="text" placeholder="Enter the promo code" />
                    </div>
                    <a href="#" className="button">
                      Apply
                    </a>
                  </div>
                  <div className="promo-order promo-order-applied">
                    <div className="pro-form-inner">
                      <img src={dbadge} className="dbadge" />
                      <span>UVDISC50</span>
                    </div>
                    <a href="#" className="alink">
                      <img src={closeicon} className="" />
                    </a>
                  </div>
                </li>
                <li>
                  <h4>Vouchers</h4>
                  <div className="voucher-order">
                    <a href="#" className="vo-link">
                      <div className="voucher-order-inner">
                        <img src={tvoucher} className="tvoucher" />
                        <span>Get more discount offer</span>
                      </div>
                    </a>
                  </div>
                  <div className="voucher-order vo-applied">
                    <a href="#" className="vo-link">
                      <div className="voucher-order-inner">
                        <img src={tvoucher} className="tvoucher" />
                        <span>Voucher selected (2)</span>
                      </div>
                    </a>
                  </div>
                  <div className="vo-applied-msg">
                    Yeay! You have saved IDR 12,500
                  </div>
                </li>
                <li>
                  <h4>Payment Method</h4>
                  <div className="voucher-order">
                    <a href="#" className="vo-link">
                      <div className="paym-order-inner">
                        <img src={paymethod} className="paym" />
                        <span>Payment Method</span>
                      </div>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            <div className="transaction-summary">
              <h4>Summary Payment</h4>
              <ul>
                <li>
                  <span>Subtotal ({priceDetail["totalItem"]} Menu)</span>
                  <strong>{showPrice(priceDetail["subTotal"])}</strong>
                </li>
                <li>
                  <span>Delivery Fee</span>
                  <strong>Rp 10.000</strong>
                </li>
                <li className="ts-discount">
                  <span>Discount (UVDISC50)</span>
                  <strong>-Rp 20.000</strong>
                </li>
                <li className="ts-discount">
                  <span>Voucher KFC Rp 100.000</span>
                  <strong>-Rp 100.000</strong>
                </li>
                <li className="ts-discount">
                  <span>Voucher Discount UV 50%</span>
                  <strong>-Rp 50.000</strong>
                </li>
                <li className="ts-total">
                  <span>Total Transaction</span>
                  <strong>Rp 540.000</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <BottomSheet
          open={this.state.openFilterSheet}
          className="bottomSheetMain no-indicator"
          blocking={false}
        >
          <div className="pay-full-btn">
            <a href={void 0} className="button">
              Pay
            </a>
          </div>
        </BottomSheet>
        <BottomSheet
          open={this.state.openVehicleSheet}
          className="bottomSheetMain nagetive-popup choose-vehicle"
          onDismiss={() => this.setState({ openVehicleSheet: false })}
          footer={
            <a href="#" className="button button-full">
              Confirm
            </a>
          }
        >
          <div className="vehilce-type">
            <div className="vt-header textcenter">
              <h2>Vehicle Type</h2>
            </div>
            <div className="vehicle-list">
              <ul>
                <li>
                  <div className="accordion-head">
                    <h3>Bike</h3>
                    <p>Ideal for small to medium items | up to 5 kg</p>
                  </div>
                  <div className="accordion-body">
                    <ul>
                      <li>
                        <figure>
                          <img src={gsend} />
                        </figure>
                        <div className="traveling-desc">
                          <strong>Gosend</strong>
                          <span>Rp15.000</span>
                        </div>
                      </li>
                      <li>
                        <figure>
                          <img src={grab} />
                        </figure>
                        <div className="traveling-desc">
                          <strong>Grab Express</strong>
                          <span>Rp10.000</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <div className="accordion-head">
                    <h3>Car</h3>
                    <p>Ideal for small to large items | up to 10 kg</p>
                  </div>
                  <div className="accordion-body">
                    <ul>
                      <li>
                        <figure>
                          <img src={ra} />
                        </figure>
                        <div className="traveling-desc">
                          <strong>Rara Delivery</strong>
                          <span>Rp81.000</span>
                        </div>
                      </li>
                      <li className="active">
                        <figure>
                          <img src={mr} />
                        </figure>
                        <div className="traveling-desc">
                          <strong>Mr Speedy</strong>
                          <span>Rp88.000</span>
                        </div>
                      </li>
                      <li>
                        <figure>
                          <img src={lala} />
                        </figure>
                        <div className="traveling-desc">
                          <strong>Lalamove</strong>
                          <span>Rp90.000</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </BottomSheet>
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

export default connect(mapStateTopProps)(withRouter(Transactionorder));
