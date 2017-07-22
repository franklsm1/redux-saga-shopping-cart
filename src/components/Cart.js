import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CartItem from './CartItem';
import { connect } from 'react-redux';
import { checkout, removeFromCart} from '../actions';
import { getTotal, getCartProducts, getCheckoutError, isCheckoutPending } from '../reducers';

class Cart extends Component {
  constructor(props){
    super(props);
    this.cartItems = this.cartItems.bind(this);
  }

  cartItems(products){
    const { removeFromCart } = this.props;
    return products.length <= 0 ?
      <em>Please add some products to cart.</em> :
      products.map(product =>
        <CartItem
          title={product.title}
          price={product.price}
          quantity={product.quantity}
          key={product.id}
          onRemove={() => removeFromCart(product.id)}/>
      );
  }

  render() {
    const {products, total, error, checkoutPending, checkout } = this.props;
    const checkoutAllowed = products.length > 0 && !checkoutPending;

    return (
      <div>
        <h3>Your Cart</h3>
        <div>{this.cartItems(products)}</div>
        <p>Total: &#36;{total}</p>
        <button
          onClick={checkout}
          disabled={checkoutAllowed ? '' : 'disabled'}>
          Checkout
        </button>
        <div style={{color: 'red'}}>{error}</div>
      </div>
    )
  }
}

Cart.propTypes = {
  // data
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
  })).isRequired,
  total: PropTypes.string,
  error: PropTypes.string,
  checkoutPending: PropTypes.bool,

  // actions
  checkout: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    products: getCartProducts(state),
    total: getTotal(state),
    error: getCheckoutError(state),
    checkoutPending: isCheckoutPending(state)
  };
}

export default connect(mapStateToProps,{ checkout, removeFromCart })(Cart)
