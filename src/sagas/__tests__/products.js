import { put, call, takeEvery } from 'redux-saga/effects';
import { getAllProducts, getProductsByBrand, watchGetProducts} from '../products';
import { api } from '../../services';
import * as actions from '../../actions/products';

const products = [1];

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
    const generator = getProductsByBrand(action);

    let next = generator.next();
    expect(next.value).toEqual(call(api.getProductsByBrand, brand));

    next = generator.next(products);
    expect(next.value).toEqual(put(actions.receiveProducts(products)));
  });

  it('watchGetProducts Saga test', () => {
    const generator = watchGetProducts();

    let next = generator.next();
    expect(next.value).toEqual(takeEvery(actions.GET_PRODUCTS, getProductsByBrand));
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
*/
