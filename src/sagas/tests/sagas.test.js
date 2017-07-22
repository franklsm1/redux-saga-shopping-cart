import { put, call, select } from 'redux-saga/effects'
import { getAllProducts, checkout } from '..'
import { api } from '../../services'
import * as actions from '../../actions'
import { getCart } from '../../reducers'

const products = [1], cart = [1]; // dummy values
const state = { products, cart };
const getState = () => state;

describe('Saga tests', () => {
  it('getProducts Saga test', () => {
    const generator = getAllProducts(getState);

    let next = generator.next(actions.getAllProducts());
    expect(next.value).toEqual(call(api.getProducts));

    next = generator.next(products);
    expect(next.value).toEqual(put(actions.receiveProducts(products)));
  });

  it('checkout Saga test', () => {
    const generator = checkout();

    let next = generator.next()
    expect(next.value).toEqual(select(getCart));

    next = generator.next(cart)
    expect(next.value).toEqual(call(api.buyProducts, cart));

    next = generator.next()
    expect(next.value).toEqual(put(actions.checkoutSuccess(cart)));
  });
});
