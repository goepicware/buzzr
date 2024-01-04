import React, { Component } from "react";

class Refpage extends Component {
  constructor(props) {
    super(props);

    this.props.history.push("/");
  }

  render() {
    return <div></div>;
  }
}

export default Refpage;
