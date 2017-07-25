import { put, call, select, take } from 'redux-saga/effects';
import { checkout, watchCheckout } from '../cart';
import { api } from '../../services';
import * as actions from '../../actions/cart';
import { getCart } from '../../reducers';

const cart = [1];

describe('Cart saga tests', () => {
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

  it('watchCheckout Saga test', () => {
    const generator = watchCheckout();

    let next = generator.next();
    expect(next.value).toEqual(take(actions.CHECKOUT_REQUEST));

    next = generator.next();
    expect(next.value).toEqual(call(checkout));
  });
});

/* Output of console.log(select(getCart)):
      {
        '@@redux-saga/IO': true,
        SELECT: {
          selector: [Function: getCart],
          args: []
        }
      }
*/
