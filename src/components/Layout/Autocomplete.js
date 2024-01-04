/* eslint-disable */
/* global google */
import React from "react";
import mgreen from "../../common/images/map-pin-green.svg";
class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = { orderHandled: "" };
  }

  componentDidMount() {
    var input = document.getElementById("pac-input");
    var options = {
      /* types: ["(cities)"], */
      componentRestrictions: [{ country: "id" }, { state: "Banten" }],
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    var currnetThis = this;
    autocomplete.addListener("place_changed", function () {
      document.getElementById("location-error").style.display = "none";
      var place = autocomplete.getPlace();
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();
      var countryName = "";
      var cityName = "";
      if (
        place.address_components !== "" &&
        typeof place.address_components !== undefined &&
        typeof place.address_components !== "undefined"
      ) {
        place.address_components.map((item) => {
          if (item.types !== "") {
            if (item.types.indexOf("country") >= 0) {
              countryName = item.long_name;
            }
            if (item.types.indexOf("locality") >= 0 && cityName === "") {
              cityName = item.long_name;
            }
          }
        });
      }
      if (cityName === "") {
        cityName = countryName;
      }

      var addressdetails =
        countryName + "~~" + latitude + "~~" + longitude + "~~" + cityName;
      currnetThis.props.sateValChange("address", addressdetails);
    });
  }

  render() {
    return (
      <div className="pac-cardinfo" id="pac-card">
        <div id="pac-containerinfo">
          <input
            id="pac-input"
            placeholder="Search location..."
            name="location_address"
            type="text"
          />
          <img src={mgreen} className="pin-left" />
          <div id="location-error"></div>
        </div>
      </div>
    );
  }
}

export default Autocomplete;
