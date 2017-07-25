import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductItem from './ProductItem';

import { connect } from 'react-redux';
import { getProducts } from '../actions/products';
import { addToCart } from '../actions/cart';
import { getVisibleProducts } from '../reducers/products';


class ProductList extends Component {
  constructor(props){
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.createProductItems = this.createProductItems.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.getProducts(event.target.value.toUpperCase());
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
        <label>
          Filter by Brand:
          <input type="text" value={this.state.value} onChange={this.handleChange}/>
        </label>
        <br/>
        <br/>
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

export default connect(mapStateToProps,{ addToCart, getProducts })(ProductList);
