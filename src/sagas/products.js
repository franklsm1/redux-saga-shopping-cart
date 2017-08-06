import { put, call, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/products';
import { api } from '../services';

export function* getAllProducts() {
  const products = yield call(api.getProducts);
  yield put(actions.receiveProducts(products));
}

export function* watchGetProducts() {
  /*
    takeEvery will fork a new `getProducts` task on each GET_PRODUCTS action
    i.e. concurrent GET_PRODUCTS actions are allowed
  */
  yield takeEvery(actions.GET_PRODUCTS, getAllProducts);
}
