import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../actions/orderActions';
import styles from './PlaceOrderScreen.module.css';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;

    useEffect(() => {
        if (!order || order.order_id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, order, orderId]);

    return loading ? <p>Loading...</p> : error ? <p className={styles.error}>{error}</p> : (
        <div className="container">
            <h1>Order {order.order_id.substring(0,8)}</h1>
            <div className={styles.container}>
                <div className={styles.detailsColumn}>
                    <div className={styles.section}>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong> {order.user.name}</p>
                        <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <div className={order.is_delivered ? styles.alertSuccess : styles.alert}>
                            {order.is_delivered ? 'Delivered' : 'Not Delivered'}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h2>Payment Method</h2>
                        <p><strong>Method: </strong> {/* Payment method would be here */}</p>
                        <div className={order.is_paid ? styles.alertSuccess : styles.alert}>
                            {order.is_paid ? 'Paid' : 'Not Paid'}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h2>Order Items</h2>
                        <div className={styles.orderItemsList}>
                        {order.orderItems.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                                <Link to={`/product/${item.product_id}`} className={styles.itemName}>{item.name}</Link>
                                <span className={styles.itemPrice}>{item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className={styles.summaryColumn}>
                    <div className={styles.summaryCard}>
                        <h2>Order Summary</h2>
                        <div className={styles.summaryRow}>
                            <strong>Total</strong>
                            <strong>${order.total_price}</strong>
                        </div>
                        {/* Mock Payment Button can go here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;