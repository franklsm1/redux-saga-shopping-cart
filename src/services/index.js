/**
 * Mocking client-server processing
 */
import _products from './products';

const TIMEOUT = 1000; // 1 second wait
const MAX_CHECKOUT = 2; // max different items

function filterProducts(brand) {
  return _products.filter(product =>
    brand ? product.brand.toUpperCase().includes(brand) : true);
}

export const api = {
  getProducts() {
    return new Promise( resolve => {
      setTimeout(() => resolve(_products), TIMEOUT);
    });
  },

  getProductsByBrand(brand) {
    return new Promise( resolve => {
      setTimeout(() => resolve(filterProducts(brand)),TIMEOUT);
    });
  },

  buyProducts(cart) {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
          Object.keys(cart.quantityById).length <= MAX_CHECKOUT ?
            resolve(cart):
            reject(`You can buy ${MAX_CHECKOUT} items at maximum in a checkout`);
        }, TIMEOUT);
    });
  }
}
