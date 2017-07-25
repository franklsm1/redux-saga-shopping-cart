export const GET_PRODUCTS = 'GET_PRODUCTS';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';

export function getProducts(brand) {
  return {
    type: GET_PRODUCTS,
    brand
  };
}

export function receiveProducts(products) {
  return {
    type: RECEIVE_PRODUCTS,
    products
  };
}
