import { combineReducers } from 'redux';
import { RECEIVE_PRODUCTS, FILTER_PRODUCTS } from '../actions/products';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';

function products(state, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        inventory: state.inventory - 1
      };
      case REMOVE_FROM_CART:
        return {
          ...state,
          inventory: state.inventory + 1
        };
    default:
      return state;
  }
}

function filterProducts(state) {
  let filteredProducts = [];
  for( var id in state.byId ) {
    let product = getProduct(state, id);
    if (product.brand.toUpperCase().includes(state.filterTerm)) {
      filteredProducts.push(product);
    }
  }
  return filteredProducts;
}

function byId(state = {}, action) {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return {
        ...state,
        ...action.products.reduce((obj, product) => {
          obj[product.id] = product;
          return obj;
        }, {})
      };
    default:
      const { productId } = action;
      if (productId) {
        return {
          ...state,
          [productId]: products(state[productId], action)
        };
      }
      return state;
  }
}

function visibleIds(state = [], action) {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return action.products.map(product => product.id);
    default:
      return state;
  }
}

function filterTerm(state = '', action) {
  switch (action.type) {
    case FILTER_PRODUCTS:
        return action.brand;
      case  RECEIVE_PRODUCTS:
        return '';
    default:
        return state;
  }
}

export default combineReducers({
  byId,
  visibleIds,
  filterTerm
});

export function getProduct(state, id) {
  return state.byId[id];
}

export function getVisibleProducts(state) {
  return state.filterTerm ?
    filterProducts(state):
    state.visibleIds.map(id => getProduct(state, id));
}
