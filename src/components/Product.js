import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Product extends Component {
  render() {
    const { brand, price, quantity, title, button, inventory } = this.props;
    return (
      <div>
        {brand} {title} - &#36;{price} {quantity ? `x ${quantity}` : null}
        {' '}
        {button}
        <br/>
        {inventory ? `current stock: ${inventory}` : null}
      </div>
    );
  }
}

Product.propTypes = {
  brand: PropTypes.string,
  price: PropTypes.number,
  inventory: PropTypes.number,
  quantity: PropTypes.number,
  title: PropTypes.string,
  button: PropTypes.node
};
