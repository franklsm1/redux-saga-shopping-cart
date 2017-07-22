import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductItem from './ProductItem';

import { connect } from 'react-redux';
import { addToCart } from '../actions';
import { getVisibleProducts } from '../reducers/products';


class ProductList extends Component {
  constructor(props){
    super(props);
    this.createProductItems = this.createProductItems.bind(this);
  }

  createProductItems() {
    const { products, addToCart } = this.props;
    return products.map(product =>
      <ProductItem
        key={product.id}
        product={product}
        onAddToCartClicked={() => addToCart(product.id)} />
    );
  }

  render() {
    return (
      <div>
        <h3>Products</h3>
        {this.createProductItems()}
      </div>
    );
  }
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    inventory: PropTypes.number.isRequired
  })).isRequired,
  addToCart: PropTypes.func.isRequired
};

function mapStateToProps(state) {
   return {
      products: getVisibleProducts(state.products)
   };
 }

export default connect(mapStateToProps,{ addToCart })(ProductList);
