import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import styles from './HomeScreen.module.css';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Experience a Smarter Way to Shop</h1>
            <p className={styles.heroSubtitle}>Get recommendations powered by AI, tailored just for you.</p>
            <a href="#products" className={styles.heroButton}>Explore Collection</a>
        </div>
      </div>

      <div id="products" className="container">
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <Product key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;