export const GET_PRODUCTS = 'GET_PRODUCTS';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const FILTER_PRODUCTS = 'FILTER_PRODUCTS';

export function getProducts() {
  return {
    type: GET_PRODUCTS
  };
}

export function filterProducts(brand) {
  return {
    type: FILTER_PRODUCTS,
    brand
  };
}

export function receiveProducts(products) {
  return {
    type: RECEIVE_PRODUCTS,
    products
  };
}
