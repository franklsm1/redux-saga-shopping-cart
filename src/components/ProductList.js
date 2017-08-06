import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductItem from './ProductItem';

import { connect } from 'react-redux';
import { filterProducts, getProducts } from '../actions/products';
import { addToCart } from '../actions/cart';
import { getVisibleProducts } from '../reducers/products';


class ProductList extends Component {
  constructor(props){
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.createProductItems = this.createProductItems.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.filterProducts(event.target.value.toUpperCase());
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

  refresh() {
    this.setState({value: ''});
    this.props.getProducts();
  }

  render() {
    return (
      <div>
        <h3>Products</h3>
        <button onClick={this.refresh}> Refresh Product List </button>
        <br/><br/>
        <label>
          Filter by Brand:
          <input type="text" value={this.state.value} onChange={this.handleChange}/>
        </label>
        <br/><br/>
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

export default connect(mapStateToProps,{ addToCart, filterProducts, getProducts })(ProductList);
