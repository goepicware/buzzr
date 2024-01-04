/* eslint-disable */
import React, { Component, createRef } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ContentLoader from "react-content-loader";
import axios from "axios";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import kasa1 from "../../common/images/kasa.png";
import plusi from "../../common/images/plus.svg";
import minusi from "../../common/images/minus.svg";
import sampleimg from "../../common/images/sample.png";
import closeicon from "../../common/images/close-icon.svg";
import {
  stripslashes,
  showPrice,
  encodeValue,
  showBtnLoader,
  hideBtnLoader,
} from "../Settings/SettingHelper";
import { apiUrl, deliveryId, unquieID } from "../Settings/Config";
import ProductDetail from "./ProductDetail";
import Cart from "../Cart/Cart";
var Parser = require("html-react-parser");
var qs = require("qs");
class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      productID: "",
      productDetails: "",
      openFilterSheet: false,
      openExistItem: false,
      cartdetails: [],
      trigerCart: false,
      openExistCartItem: false,
      selectedProduct: "",
      selectedProducttotalPrice: 0,
      selectedProductName: "",
      selectedproductPrice: 0,
      displayExistCartItem: "",
      loadAnotherPro: false,
      incdecPro: "",
      compoinput_value: 1,
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(PropsDt) {
    if (this.state.productList !== PropsDt.product.productList) {
      this.setState({
        productList: PropsDt.product.productList,
      });
    }
    if (this.state.cartdetails !== PropsDt.cartdetails) {
      this.setState({ cartdetails: PropsDt.cartdetails }, function () {
        this.loadExistCartItem();
        if (this.state.productID !== "") {
          hideBtnLoader("pro_" + this.state.productID);
          this.setState({ productID: "" });
        }
      });
    }
  }
  proQtyAction(Item, Quantity, actionFlg) {
    var checking_Item = this.checkingItem(Item.product_id);
    var allowProceed = "Yes";
    if (checking_Item > 0 && Item.product_type === "2") {
      allowProceed = "No";
      this.setState(
        { openExistItem: true, selectedProduct: Item },
        function () {
          this.loadExistCartItem();
        }
      );
    }
    if (allowProceed === "Yes") {
      var updQty = 0;
      if (actionFlg === "inc") {
        updQty = parseInt(Quantity) + 1;
      } else if (actionFlg === "dec") {
        updQty = parseInt(Quantity) - 1;
      }
      this.setState({ productID: Item.product_id }, function () {
        showBtnLoader("pro_" + Item.product_id);
        this.addToCartSimpleProduct(Item, updQty);
      });
    }
  }
  addtoCart(item, type) {
    if (item.product_type === "2") {
      this.loadProductDetail(item);
      this.setState({ openFilterSheet: true });
    } else {
      this.addToCartSimpleProduct(item, 1);
    }
  }
  addToCartSimpleProduct(Item, Quantity) {
    var postObject = {
      unquieid: unquieID,
      availabilityID: deliveryId,
      availabilityName: "Delivery",
      productType: "Simple",
      locationID: cookie.load("locationID"),
      shopID: encodeValue(this.props.product.storeID),
      customerID: cookie.load("customerID"),
      productID: Item.product_id,
      quantity: Quantity,
    };

    axios
      .post(apiUrl + "cart/createCart", qs.stringify(postObject))
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
  loadProductDetail(product) {
    axios
      .get(
        apiUrl +
          "catalogs/productdetails?unquieid=" +
          unquieID +
          "&productSlug=" +
          product.product_slug
      )
      .then((res) => {
        if (res.data.status === "ok") {
          this.setState(
            { productDetails: res.data.result, openExistItem: false },
            function () {
              if (this.state.loadAnotherPro === true) {
                showBtnLoader("add_another_item");
                this.setState({ openFilterSheet: true, loadAnotherPro: false });
              }
            }
          );
        }
      });
  }
  openfilter() {
    this.setState({ openFilterSheet: true });
  }
  sateValChange = (field, value) => {
    this.setState({ [field]: value });
  };
  checkingItem(productID) {
    var qty = 0;
    var cartdetails = this.state.cartdetails;
    if (Object.keys(cartdetails).length > 0) {
      if (cartdetails.store.length > 0) {
        cartdetails.store.map((store) => {
          if (store.item.length > 0) {
            store.item.map((ProItem) => {
              if (ProItem.productID === productID) {
                qty += parseInt(ProItem.itemQuantity);
              }
            });
          }
        });
      }
    }
    return qty;
  }

  loadExistCartItem() {
    var displayExistCartItem = "";
    var totalPrice = 0;
    var selectedProductName = "";
    if (Object.keys(this.state.cartdetails).length > 0) {
      if (this.state.cartdetails.store.length > 0) {
        this.state.cartdetails.store.map((store) => {
          if (store.item.length > 0) {
            displayExistCartItem = store.item.map((ProItem, proIndex) => {
              totalPrice += parseFloat(ProItem.itemTotalPrice);
              if (ProItem.productID === this.state.selectedProduct.product_id) {
                selectedProductName = ProItem.itemName;
                return (
                  <div className="ed-pro-main" key={proIndex}>
                    <div className="ed-pro-main-top">
                      <div className="product-img">
                        {ProItem.itemImage !== "" && (
                          <img src={ProItem.itemImage} alt={ProItem.itemName} />
                        )}
                      </div>
                      <div className="product-desc">
                        <div className="ed-pro-merge">
                          <h3 className="ot-title">{ProItem.itemName}</h3>
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
                                              {comobPro.productName}
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
                        </div>
                        <div className="ed-pro-price">
                          {showPrice(ProItem.itemTotalPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="ed-pro-main-btm">
                      <div className="ep-lhs">
                        <a href="#">Edit Menu</a>
                      </div>
                      <div className="ep-rhs">
                        <div className="qty-bx">
                          <span
                            className="qty-minus"
                            onClick={this.proQtyIncDecUpdate.bind(
                              this,
                              ProItem.itemID,
                              ProItem.itemQuantity,
                              "dec"
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
                              "inc"
                            )}
                          >
                            <img src={plusi} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            });
          }
        });
      }
    }
    this.setState({
      displayExistCartItem: displayExistCartItem,
      selectedProducttotalPrice: totalPrice,
      selectedProductName: selectedProductName,
    });
  }
  addAnother() {
    this.setState({ loadAnotherPro: true }, function () {
      showBtnLoader("add_another_item");
      this.loadProductDetail(this.state.selectedProduct);
    });
  }
  closeProduct() {
    this.setState({ openExistItem: false });
  }
  proQtyIncDecAction(productID, type) {
    this.child.compoQtyAction(type);
  }
  addtoCartSelectPro() {
    this.child.addToCartCombo(this.state.productDetails[0], "done");
  }
  proQtyIncDecUpdate(itemID, itemQuantity, type) {
    var updQty = 0;
    if (type === "inc") {
      updQty = parseInt(itemQuantity) + 1;
    } else {
      updQty = parseInt(itemQuantity) - 1;
    }
    console.log(updQty, "updQtyupdQty");
    var postObject = {
      unquieid: unquieID,
      availabilityID: deliveryId,
      locationID: cookie.load("locationID"),
      shopID: encodeValue(this.props.product.storeID),
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
      <div className="product-list">
        <Cart
          sateValChange={this.sateValChange}
          trigerCart={this.state.trigerCart}
        />
        {this.props.product.productLoading === true
          ? Array(1, 2, 3).map((item) => {
              return (
                <ul>
                  <li key={item}>
                    <ContentLoader viewBox="0 0 380 70">
                      <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
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
                </ul>
              );
            })
          : this.state.productList.length > 0 && (
              <ul>
                {this.state.productList.map((item, index) => {
                  var checkingItem = this.checkingItem(item.product_id);
                  return (
                    <li key={index}>
                      <div className="product-img">
                        <img src={item.product_thumbnail} alt="Eats Image" />
                      </div>
                      <div className="product-desc">
                        <h3 className="ot-title">
                          {item.product_alias !== "" &&
                          item.product_alias !== null
                            ? stripslashes(item.product_alias)
                            : stripslashes(item.product_name)}
                        </h3>
                        {item.product_short_description !== "" &&
                          item.product_short_description !== null &&
                          Parser(item.product_short_description)}
                        <div className="pro-action">
                          <div className="pro-price">
                            {showPrice(item.product_price)}
                          </div>
                          {parseInt(checkingItem) > 0 ? (
                            <div
                              className="pro-qtybx"
                              id={"pro_" + item.product_id}
                            >
                              <div className="qty-bx">
                                <span
                                  className="qty-minus"
                                  onClick={this.proQtyAction.bind(
                                    this,
                                    item,
                                    checkingItem,
                                    "dec"
                                  )}
                                >
                                  <img src={minusi} />
                                </span>
                                <div className="input-quantity">
                                  {checkingItem}
                                </div>
                                <span
                                  className="qty-plus"
                                  onClick={this.proQtyAction.bind(
                                    this,
                                    item,
                                    checkingItem,
                                    "inc"
                                  )}
                                >
                                  <img src={plusi} />
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="pro-btn"
                              id={"pro_" + item.product_id}
                            >
                              <a
                                href={void 0}
                                className="button"
                                onClick={this.addtoCart.bind(
                                  this,
                                  item,
                                  "initial"
                                )}
                              >
                                Add
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
        {this.state.productDetails !== "" && (
          <BottomSheet
            open={this.state.openFilterSheet}
            className="bottomSheetMain product-details-btmsheet"
            onDismiss={() => this.setState({ openFilterSheet: false })}
            footer={
              <div className="btnfull-footer">
                <div className="bf-desc">
                  <div className="bf-desc-lhs">
                    <p>
                      <sup>Rp</sup>
                      <span id="addtocartPrice"></span>
                    </p>
                  </div>
                  <div className="qty_bx">
                    <span
                      className="qty_minus"
                      onClick={this.proQtyIncDecAction.bind(this, "decr")}
                    >
                      <img src={minusi} />
                    </span>
                    <input
                      type="text"
                      value={this.state.compoinput_value}
                      className="proqty_input"
                      readOnly={true}
                    />
                    <span
                      className="qty_plus"
                      onClick={this.proQtyIncDecAction.bind(this, "incr")}
                    >
                      <img src={plusi} />
                    </span>
                  </div>
                </div>

                <div className="bf-desc-btn">
                  <a
                    className="button"
                    onClick={this.addtoCartSelectPro.bind(this)}
                  >
                    Add to cart
                  </a>
                </div>
              </div>
            }
          >
            <ProductDetail
              ref={(cd) => (this.child = cd)}
              productDetails={this.state.productDetails}
              storeID={this.props.product.storeID}
              openExistCartItem={this.state.openExistCartItem}
              incdecPro={this.state.incdecPro}
              sateValChange={this.sateValChange}
            />
          </BottomSheet>
        )}

        <BottomSheet
          open={this.state.openExistItem}
          className="bottomSheetMain edit-custm-popup"
          onDismiss={() => this.setState({ openExistItem: false })}
          footer={
            <a
              href={void 0}
              onClick={this.addAnother.bind(this)}
              className="button add-anr-btn height-declared"
              id="add_another_item"
            >
              Add Another Custom Order
            </a>
          }
        >
          <div className="product-go-back">
            <a href={void 0} onClick={this.closeProduct.bind(this)}>
              <img src={closeicon} />
            </a>
          </div>
          <div className="edit-custm-order">
            <div className="edit-product-name">
              <div className="ep-lhs">
                <h2>{this.state.selectedProductName}</h2>
              </div>
              <div className="ep-rhs">
                <span>{showPrice(this.state.selectedProducttotalPrice)}</span>
                <em>Total Price</em>
              </div>
            </div>
            {this.state.displayExistCartItem}
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
)(withRouter(ProductList));
