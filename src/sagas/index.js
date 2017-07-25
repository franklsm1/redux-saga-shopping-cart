import { fork, all } from 'redux-saga/effects';
import { getAllProducts, watchGetProducts } from './products'
import { watchCheckout } from './cart'

export default function* root() {
  yield all([
    fork(getAllProducts),
    fork(watchGetProducts),
    fork(watchCheckout)
  ]);
}
