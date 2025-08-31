import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import styles from './CartScreen.module.css';

const CartScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cart);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleCheckout = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="container">
            <h1 className={styles.pageTitle}>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    Your cart is empty. <Link to="/">Go Back Shopping</Link>
                </div>
            ) : (
                <div className={styles.cartLayout}>
                    <div className={styles.cartItems}>
                        {cartItems.map(item => (
                            <div key={item.product_id} className={styles.cartItem}>
                                <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                                <div className={styles.itemDetails}>
                                    <Link to={`/product/${item.product_id}`} className={styles.itemName}>{item.name}</Link>
                                    <p className={styles.itemPrice}>${item.price}</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <select 
                                        value={item.qty} 
                                        onChange={(e) => dispatch(addToCart(item.product_id, Number(e.target.value)))}
                                        className={styles.qtySelect}
                                    >
                                        {[...Array(item.count_in_stock).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => dispatch(removeFromCart(item.product_id))} className={styles.removeButton}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.cartSummary}>
                        <h2>Order Summary</h2>
                        <div className={styles.summaryRow}>
                            <span>Subtotal ({totalItems} items)</span>
                            <span>${subtotal}</span>
                        </div>
                        <button onClick={handleCheckout} className={styles.checkoutButton}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;