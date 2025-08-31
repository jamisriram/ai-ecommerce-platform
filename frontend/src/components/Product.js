import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Product.module.css';

const Product = ({ product }) => {
  return (
    <div className={styles.card}>
      <Link to={`/product/${product.product_id}`}>
        <div className={styles.imageContainer}>
            <img 
                src={product.image_url} 
                alt={product.name} 
                className={styles.image} 
            />
        </div>
      </Link>
      <div className={styles.cardBody}>
        <Link to={`/product/${product.product_id}`} className={styles.cardTitle}>
            {product.name}
        </Link>
        <p className={styles.cardPrice}>${product.price}</p>
      </div>
    </div>
  );
};

export default Product;