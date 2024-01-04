/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import cookie from "react-cookies";
import ContentLoader from "react-content-loader";
import { GET_STORE_LIST } from "../../actions";
import { apiUrl, unquieID } from "../Settings/Config";
import { encodeValue } from "../Settings/SettingHelper";

import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";

import ot from "../../common/images/outlet-place.png";

import { th } from "date-fns/locale";
var mbanner = {
  items: 1,
  loop: true,
  dots: true,
  nav: false,
  margin: 15,
  stagePadding: 40,
  responsive: {
    0: {
      items: 1,
      stagePadding: 20,
    },
    480: {
      items: 1,
      margin: 15,
      stagePadding: 40,
    },
  },
};

var foodbanner = {
  items: 4,
  loop: true,
  dots: false,
  nav: false,
  margin: 13,
  stagePadding: 30,
};

var recmdbanner = {
  items: 2,
  loop: true,
  dots: false,
  nav: false,
  margin: 13,
  stagePadding: 40,
  responsive: {
    0: {
      items: 1,
      stagePadding: 40,
    },
    380: {
      items: 2,
      stagePadding: 30,
    },
  },
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [],
      bannerList: [],
      storeList: [],
      storeDisplay: "",
      loading: true,
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
    };

    if (
      cookie.load("delZoneID") === "" ||
      typeof cookie.load("delZoneID") === undefined ||
      typeof cookie.load("delZoneID") === "undefined"
    ) {
      this.props.history.push("/delivery-location");
    }
    if (
      cookie.load("token") === "" ||
      typeof cookie.load("token") === undefined ||
      typeof cookie.load("token") === "undefined"
    ) {
      cookie.save(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo4OTExOTgzLCJpZF9kZXZpY2UiOiJhYmNkYWJjZCIsImlhdCI6MTY5NjUwMjMzMiwiZXhwIjoxNzI4MDM4MzMyLCJpc3MiOiJuZXJvX2JhY2tlbmRfYXBpIiwic3ViIjoibmVyby1hY2Nlc3MtdG9rZW4iLCJqdGkiOiJuZXJvLXVzZXIuaWQifQ.Bkaurv21swbajmz1-_XDqPvF10Qoj66AxElVBfDYRnE",
        { path: "/" }
      );
      cookie.save("customerID", encodeValue(1));
    }
  }
  componentDidMount() {
    this.loadTag();
    this.loadBanner();
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.storeList !== PropsDt.storeList) {
      this.setState({ storeList: PropsDt.storeList }, function () {
        this.displayStore();
      });
    }
  }
  loadTag() {
    axios.get(apiUrl + "store/tagList?unquieid=" + unquieID).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ tagList: res.data.result }, function () {
          if (
            cookie.load("locationID") !== "" &&
            typeof cookie.load("locationID") !== undefined &&
            typeof cookie.load("locationID") !== "undefined"
          ) {
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
            this.props.getStoreList(
              "&dellocation=" +
                cookie.load("locationID") +
                "&latitude=" +
                latitude +
                "&longitude=" +
                longitude
            );
          }
        });
      }
    });
  }
  loadBanner() {
    axios.get(apiUrl + "banner/listBanner?unquieid=" + unquieID).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ bannerList: res.data.result });
      }
    });
  }
  displayStore() {
    var storeDisplay = "";
    if (this.state.storeList.length > 0) {
      storeDisplay = this.state.storeList.map((item, index) => {
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
                  <strong>
                    {item.distance !== ""
                      ? parseFloat(item.distance).toFixed("2")
                      : "0"}{" "}
                    km
                  </strong>
                  <span>
                    {item.Rating} ({item.totalRating})
                  </span>
                </div>
                <div className="op-time">{item.storeTimeInfo}</div>
                {item.tagID !== "" &&
                  item.tagID !== null &&
                  this.state.tagList.length > 0 && (
                    <div className="ot-keyword">
                      {this.loadStoreTag(item.tagID)}
                    </div>
                  )}
                {item.offerInfo !== "" && item.offerInfo !== null && (
                  <div className="ot-offers">{item.offerInfo}</div>
                )}
              </div>
            </Link>
          </li>
        );
      });
    }
    this.setState({ storeDisplay: storeDisplay, loading: false });
  }
  loadStoreTag(storeTag) {
    if (this.state.tagList.length > 0) {
      var storeTag = storeTag.split(",");
      var tagList = [];
      this.state.tagList.map((item) => {
        if (storeTag.indexOf(item.value) >= 0) {
          tagList.push(item.label);
        }
      });
      if (tagList.length > 0) {
        return tagList.join(", ");
      }
    }
  }

  render() {
    return (
      <div className="main-div">
        <div className="content-body rel">
          <div className="container">
            {this.state.bannerList.length > 0 && (
              <div className="banner">
                <OwlCarousel options={mbanner}>
                  {this.state.bannerList.map((item, index) => {
                    if (
                      item.banner_image !== "" &&
                      item.banner_image !== null
                    ) {
                      return (
                        <div key={index}>
                          <a
                            href={
                              item.banner_link !== ""
                                ? item.banner_link
                                : void 0
                            }
                            target={
                              item.banner_link !== "" ? "_blank" : "_self"
                            }
                          >
                            <img src={item.banner_image} />
                          </a>
                        </div>
                      );
                    }
                  })}
                </OwlCarousel>
              </div>
            )}

            {/* <div className="che-slider">
              <h2>Choose your Eats!</h2>
              <OwlCarousel options={foodbanner}>
                <div>
                  <a href="#">
                    <img src={chn} /> <p>Chicken</p>
                  </a>
                </div>
                <div>
                  <a href="#">
                    <img src={bur} /> <p>Burger</p>
                  </a>
                </div>
                <div>
                  <a href="#">
                    <img src={cke} /> <p>Cake</p>
                  </a>
                </div>
                <div>
                  <a href="#">
                    <img src={piz} /> <p>Pizza</p>
                  </a>
                </div>
                <div>
                  <a href="#">
                    <img src={ndle} /> <p>Noddle</p>
                  </a>
                </div>
              </OwlCarousel>
            </div> */}
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
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Home));
