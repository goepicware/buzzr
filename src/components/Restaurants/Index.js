/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import ContentLoader from "react-content-loader";
import {
  GET_STORE_DETAILS,
  GET_CATEGORY_LIST,
  GET_PRODUCT_LIST,
} from "../../actions";
import { stripslashes, encodeValue } from "../Settings/SettingHelper";
import ProductList from "./ProductList";
import fadd from "../../common/images/favorite-add.svg";
import share1 from "../../common/images/share.svg";
import barrow from "../../common/images/back-arrow.svg";

class Restaurants extends Component {
  constructor(props) {
    super(props);
    var storeSlug = "";
    var categorySlug = "";
    if (
      this.props.match.params !== "" &&
      typeof this.props.match.params !== undefined &&
      typeof this.props.match.params !== "undefined"
    ) {
      if (
        this.props.match.params.storeSlug !== "" &&
        typeof this.props.match.params.storeSlug !== undefined &&
        typeof this.props.match.params.storeSlug !== "undefined"
      ) {
        storeSlug = this.props.match.params.storeSlug;
      }
      if (
        this.props.match.params.categorySlug !== "" &&
        typeof this.props.match.params.categorySlug !== undefined &&
        typeof this.props.match.params.categorySlug !== "undefined"
      ) {
        categorySlug = this.props.match.params.categorySlug;
      }
    }

    if (storeSlug === "") {
      this.props.history.push("/");
    }
    this.state = {
      storeSlug: storeSlug,
      storeDetails: "",
      storeLoading: true,
      storeID: "",
      categoryList: [],
      currentCategory: categorySlug,
      productList: [],
      productLoading: true,
    };
  }
  componentDidMount() {
    var latitude =
      cookie.load("deliveryaddresslat") !== "" &&
      typeof cookie.load("deliveryaddresslat") !== undefined &&
      typeof cookie.load("deliveryaddresslat") !== "undefined"
        ? cookie.load("deliveryaddresslat")
        : "";
    var longitude =
      cookie.load("deliveryaddresslong") !== "" &&
      typeof cookie.load("deliveryaddresslong") !== undefined &&
      typeof cookie.load("deliveryaddresslong") !== "undefined"
        ? cookie.load("deliveryaddresslong")
        : "";
    this.props.getStoreDetails(
      "&storeSlug=" +
        this.state.storeSlug +
        "&latitude=" +
        latitude +
        "&longitude=" +
        longitude
    );
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.storeDetails !== PropsDt.storeDetails) {
      this.setState({ storeDetails: PropsDt.storeDetails }, function () {
        var storeID = this.state.storeDetails.storeID;
        this.setState({ storeID: storeID, storeLoading: false }, function () {
          this.props.getCategoryList("&storeID=" + encodeValue(storeID));
        });
      });
    }
    if (this.state.categoryList !== PropsDt.categoryList) {
      if (PropsDt.categoryList.length > 0) {
        this.setState({ categoryList: PropsDt.categoryList }, function () {
          if (this.state.categoryList.length > 0) {
            if (this.state.currentCategory !== "") {
              this.productsList();
            } else {
              this.setState(
                {
                  currentCategory: this.state.categoryList[0].catSlug,
                },
                function () {
                  this.productsList();
                }
              );
            }
          }
        });
      }
    }

    if (
      this.state.currentCategory !== "" &&
      this.state.currentCategory !== PropsDt.match.params.categorySlug &&
      PropsDt.match.params.categorySlug !== "" &&
      typeof PropsDt.match.params.categorySlug !== undefined &&
      typeof PropsDt.match.params.categorySlug !== "undefined"
    ) {
      this.setState(
        {
          currentCategory: PropsDt.match.params.categorySlug,
          productLoading: true,
        },
        function () {
          this.productsList();
        }
      );
    }
    if (this.state.productList !== PropsDt.productList) {
      this.setState(
        {
          productList: PropsDt.productList,
        },
        function () {
          if (PropsDt.productList.length > 0) {
            this.setState({ productLoading: false });
          }
        }
      );
    }
  }
  productsList() {
    if (
      this.state.currentCategory !== "" &&
      typeof this.state.currentCategory !== undefined &&
      typeof this.state.currentCategory !== "undefined"
    ) {
      this.props.getProductList(
        "&cateSlug=" +
          this.state.currentCategory +
          "&storeID=" +
          encodeValue(this.state.storeDetails.storeID)
      );
    }
  }

  render() {
    const { storeDetails } = this.state;
    return (
      <div className="main-div">
        <div className="top-tool">
          <div className="container">
            <div className="tt-lhs">
              <Link to={"/restaurants"} className="arrow-bk">
                <img src={barrow} />
              </Link>
            </div>

            <div className="tt-rhs">
              <ul>
                <li>
                  <a href="#">
                    <img src={fadd} />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={share1} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {this.state.storeLoading === true ? (
          <div className="content-body detail-cb rel">
            <div className="container">
              <div className="detail-outlet-margin">
                <ContentLoader viewBox="0 0 380 70">
                  <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                  <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                  <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
              </div>
            </div>
          </div>
        ) : (
          storeDetails !== "" && (
            <div className="content-body detail-cb rel">
              <div className="container">
                <div className="detail-banner">
                  <img
                    src={storeDetails.bannerImage}
                    alt={storeDetails.storeName}
                  />
                </div>
                <div className="detail-outlet">
                  <div className="ot-img">
                    <img
                      src={storeDetails.storeImage}
                      alt={storeDetails.storeName}
                    />
                  </div>
                  <div className="ot-info">
                    <h3 className="ot-title">{storeDetails.storeName}</h3>
                    <div className="km-rating">
                      <strong>
                        {" "}
                        {storeDetails.distance !== ""
                          ? parseFloat(storeDetails.distance).toFixed("2")
                          : "0"}{" "}
                        km
                      </strong>
                      <span>
                        {" "}
                        {storeDetails.Rating} ({storeDetails.totalRating})
                      </span>
                    </div>
                    {storeDetails.storeTimeInfo !== "" && (
                      <div className="op-time">
                        {storeDetails.storeTimeInfo}
                      </div>
                    )}
                    {storeDetails.tagName !== "" && (
                      <div className="ot-keyword">{storeDetails.tagName}</div>
                    )}
                    {storeDetails.offerInfo !== "" &&
                      storeDetails.offerInfo !== null && (
                        <div className="ot-offers">
                          {storeDetails.offerInfo}
                        </div>
                      )}
                  </div>
                </div>
                {this.state.categoryList.length > 0 && (
                  <div className="pp-tags">
                    <ul>
                      {this.state.categoryList.map((item, index) => {
                        return (
                          <li
                            className={
                              item.catSlug === this.state.currentCategory
                                ? "active"
                                : ""
                            }
                            key={index}
                          >
                            <Link
                              to={
                                "/restaurant/" +
                                this.state.storeSlug +
                                "/" +
                                item.catSlug
                              }
                            >
                              {stripslashes(item.categoryName)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <ProductList product={this.state} />
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var store_details = Array();
  if (Object.keys(state.storedetails).length > 0) {
    if (state.storedetails[0].status === "ok") {
      store_details = state.storedetails[0].result;
    }
  }
  var categoryListArray = Array();
  if (Object.keys(state.categorylist).length > 0) {
    if (state.categorylist[0].status === "ok") {
      categoryListArray = state.categorylist[0].result;
    }
  }
  var productListArray = Array();
  if (Object.keys(state.productlist).length > 0) {
    if (state.productlist[0].status === "ok") {
      productListArray = state.productlist[0].result;
    }
  }
  return {
    storeDetails: store_details,
    categoryList: categoryListArray,
    productList: productListArray,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStoreDetails: (params) => {
      dispatch({ type: GET_STORE_DETAILS, params });
    },
    getCategoryList: (params) => {
      dispatch({ type: GET_CATEGORY_LIST, params });
    },
    getProductList: (params) => {
      dispatch({ type: GET_PRODUCT_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Restaurants));
