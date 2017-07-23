import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects';
import * as actions from '../actions';
import { getCart } from '../reducers';
import { api } from '../services';

export function* getAllProducts() {
  const products = yield call(api.getProducts);
  yield put(actions.receiveProducts(products));
}

export function* getProducts(action) {
  const products = yield call(api.getProductsByBrand, action.brand);
  yield put(actions.receiveProducts(products));
}

export function* checkout() {
    try {
      const cart = yield select(getCart); //passes the current state into getCart()
      yield call(api.buyProducts, cart);
      yield put(actions.checkoutSuccess(cart));
    } catch(error) {
      yield put(actions.checkoutFailure(error));
    }
}

export function* watchGetProducts() {
  /*
    takeEvery will fork a new `getProducts` task on each GET_PRODUCTS action
    i.e. concurrent GET_PRODUCTS actions are allowed
  */
  yield takeEvery(actions.GET_PRODUCTS, getProducts);
}

export function* watchCheckout() {
  while(true) {
    /*
      ***THIS IS A BLOCKING CALL***
      watchCheckout will ignore any CHECKOUT_REQUEST event until
      the current checkout completes, either by success or by error.
      i.e. concurrent CHECKOUT_REQUEST are not allowed
    */
    yield take(actions.CHECKOUT_REQUEST);
    yield call(checkout);
  }
}

export default function* root() {
  yield all([
    fork(getAllProducts),
    fork(watchGetProducts),
    fork(watchCheckout)
  ]);
}
