/* eslint-disable */
import { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { GET_CART_DETAIL } from "../../actions";

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trigerCart: false,
    };
  }
  componentDidMount() {
    this.props.getCartDetail();
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.trigerCart !== PropsDt.trigerCart) {
      this.setState({ trigerCart: PropsDt.trigerCart }, function () {
        if (this.state.trigerCart === true) {
          this.props.getCartDetail();
          this.props.sateValChange("trigerCart", false);
        }
      });
    }
  }

  render() {
    return "";
  }
}

const mapStateTopProps = (state) => {
  return {
    cartDetails: state.cartdetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCartDetail: () => {
      dispatch({ type: GET_CART_DETAIL });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Cart));
