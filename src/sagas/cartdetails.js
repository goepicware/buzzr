/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_CART_DETAIL, SET_CART_DETAIL } from "../actions";
import { apiUrl, unquieID, deliveryId } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetCartDetails = function* () {
  yield takeEvery(GET_CART_DETAIL, workerGetCartDetails);
};

function* workerGetCartDetails() {
  try {
    const uri =
      apiUrl +
      "cart/loadCartDetails?unquieid=" +
      unquieID +
      "&customerID=MQ==&availabilityID=" +
      deliveryId;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_CART_DETAIL, value: resultArr });
  } catch {
    console.log("Get category failed");
  }
}
