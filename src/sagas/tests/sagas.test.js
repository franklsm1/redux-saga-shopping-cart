import { put, call, select, takeEvery, take } from 'redux-saga/effects';
import {
  getAllProducts,
  getProducts,
  checkout,
  watchGetProducts,
  watchCheckout
} from '..';
import { api } from '../../services';
import * as actions from '../../actions';
import { getCart } from '../../reducers';

const products = [1], cart = [1];
const state = { products, cart };

describe('Saga tests', () => {
  it('getProducts Saga test', () => {
    const generator = getAllProducts();

    let next = generator.next();
    expect(next.value).toEqual(call(api.getProducts));

    next = generator.next(products);
    expect(next.value).toEqual(put(actions.receiveProducts(products)));
  });

  it('getProducts by brand Saga test', () => {
    let brand = "test";
    let action = { brand };
    const generator = getProducts(action);

    let next = generator.next();
    expect(next.value).toEqual(call(api.getProductsByBrand, brand));

    next = generator.next(products);
    expect(next.value).toEqual(put(actions.receiveProducts(products)));
  });

  it('checkout Saga test', () => {
    const generator = checkout();

    let next = generator.next();
    expect(next.value).toEqual(select(getCart));

    next = generator.next(cart);
    expect(next.value).toEqual(call(api.buyProducts, cart));

    next = generator.next();
    expect(next.value).toEqual(put(actions.checkoutSuccess(cart)));
  });

  it('checkout error Saga test', () => {
    const error = 'error occurred';
    const generator = checkout();

    let next = generator.next();
    expect(next.value).toEqual(select(getCart));

    next = generator.next(cart);
    expect(next.value).toEqual(call(api.buyProducts, cart));

    next = generator.throw(error);
    expect(next.value).toEqual(put(actions.checkoutFailure(error)));
  });

  it('watchGetProducts Saga test', () => {
    const generator = watchGetProducts();

    let next = generator.next();
    expect(next.value).toEqual(takeEvery(actions.GET_PRODUCTS, getProducts));
  });

  it('watchCheckout Saga test', () => {
    const generator = watchCheckout();

    let next = generator.next();
    expect(next.value).toEqual(take(actions.CHECKOUT_REQUEST));

    next = generator.next();
    expect(next.value).toEqual(call(checkout));
  });
});

/* Output of console.log(call(api.getProducts)):
      {
        '@@redux-saga/IO': true,
        CALL: {
          context: null,
          fn: [Function: getProducts],
          args: []
        }
      }

  Output of console.log(put(actions.receiveProducts(products))):
      {
        '@@redux-saga/IO': true,
        PUT: {
            channel: null,
            action: {
              type: 'RECEIVE_PRODUCTS',
              products: [1]
            }
        }
      }
  Output of console.log(select(getCart)):
      {
        '@@redux-saga/IO': true,
        SELECT: {
          selector: [Function: getCart],
          args: []
        }
      }
*/
