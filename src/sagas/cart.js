import { take, put, call, select } from 'redux-saga/effects';
import { getCart } from '../reducers';
import * as actions from '../actions/cart';
import { api } from '../services';

export function* checkout() {
    try {
      const cart = yield select(getCart); //passes the current state into getCart()
      yield call(api.buyProducts, cart);
      yield put(actions.checkoutSuccess(cart));
    } catch(error) {
      yield put(actions.checkoutFailure(error));
    }
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
