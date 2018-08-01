import React from 'react';
import { connect } from 'dva';
import ProductList from '../../components/ProductList/index';

const Products = (options) => {
  const { dispatch, products } = options
  console.log(options)
  function handleDelete(id) {
    dispatch({
      type: 'products/delete',
      payload: id,
    });
  }
  return (
    <div>
      <h2>List of Products</h2>
      <ProductList onDelete={handleDelete} products={products} />
    </div>
  );
};

// export default Products;
export default connect(({ products }) => ({
  products,
}))(Products);
