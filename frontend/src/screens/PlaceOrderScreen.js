import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../actions/orderActions';
import styles from './PlaceOrderScreen.module.css';

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);

    if (!cart.shippingAddress.address) {
        navigate('/shipping');
    } else if (!cart.paymentMethod) {
        navigate('/payment');
    }

    cart.itemsPrice = Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
    cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;
    cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2));
    cart.totalPrice = (cart.itemsPrice + cart.shippingPrice + cart.taxPrice).toFixed(2);

    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if (success) {
            navigate(`/order/${order.order_id}`);
        }
    }, [navigate, success, order]);

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.detailsColumn}>
                <div className={styles.section}>
                    <h2>Shipping</h2>
                    <p>
                        <strong>Address: </strong>
                        {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                    </p>
                </div>
                <div className={styles.section}>
                    <h2>Payment Method</h2>
                    <p><strong>Method: </strong>{cart.paymentMethod}</p>
                </div>
                <div className={styles.section}>
                    <h2>Order Items</h2>
                    {cart.cartItems.length === 0 ? <p>Your cart is empty</p> : (
                        <div className={styles.orderItemsList}>
                        {cart.cartItems.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                                <Link to={`/product/${item.product_id}`} className={styles.itemName}>{item.name}</Link>
                                <span className={styles.itemPrice}>{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</span>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.summaryColumn}>
                <div className={styles.summaryCard}>
                    <h2>Order Summary</h2>
                    <div className={styles.summaryRow}><span>Items</span><span>${cart.itemsPrice.toFixed(2)}</span></div>
                    <div className={styles.summaryRow}><span>Shipping</span><span>${cart.shippingPrice.toFixed(2)}</span></div>
                    <div className={styles.summaryRow}><span>Tax</span><span>${cart.taxPrice.toFixed(2)}</span></div>
                    <div className={styles.summaryRow}><strong>Total</strong><strong>${cart.totalPrice}</strong></div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button onClick={placeOrderHandler} disabled={cart.cartItems.length === 0} className={styles.placeOrderButton}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;