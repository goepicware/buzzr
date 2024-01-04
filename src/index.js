import React from "react";
/* import { render } from "react-dom"; */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { getStore } from "./store";

import "./common/css/font-awesome.min.css";
import "./common/css/bootstrap.min.css";
import "./common/css/style.css";
import "./common/css/responsive.css";
import "./common/css/slick.css";
import Home from "./components/Home/Home";

import Ongoing from "./components/Home/Ongoing";
import Consumer from "./components/Home/Consumer";

import Refpage from "./components/Layout/Refpage";
import Page404 from "./Page404";

const store = getStore();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Switch>
        {/*  Master Admin Start*/}
        <Route exact path="/" component={Home} />

        <Route exact path="/on-going" component={Ongoing} />
        <Route exact path="/consumer" component={Consumer} />

        {/*  Client Panel Start*/}
        <Route path={"/refpage/:slugtext"} component={Refpage} />
        <Route component={Page404} />
      </Switch>
    </Router>
  </Provider>
);
