import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listMyOrders } from '../actions/orderActions';
import styles from './ProfileScreen.module.css';

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('details');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector(state => state.userLogin);
    const { loading: loadingOrders, error: errorOrders, orders } = useSelector(state => state.orderListMy);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            dispatch(listMyOrders());
        }
    }, [dispatch, navigate, userInfo]);

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.pageTitle}>My Profile</h1>
            <div className={styles.profileLayout}>
                <div className={styles.tabs}>
                    <button onClick={() => setActiveTab('details')} className={activeTab === 'details' ? styles.activeTab : ''}>Profile Details</button>
                    <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? styles.activeTab : ''}>My Orders</button>
                </div>
                <div className={styles.tabContent}>
                    {activeTab === 'details' && (
                        <div>
                            <h2>Profile Details</h2>
                            <form className={styles.profileForm}>
                                <div className={styles.formGroup}>
                                    <label>Name</label>
                                    <input type="text" defaultValue={userInfo?.name} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input type="email" defaultValue={userInfo?.email} />
                                </div>
                                <button type="submit">Update Profile</button>
                            </form>
                        </div>
                    )}
                    {activeTab === 'orders' && (
                        <div>
                            <h2>My Orders</h2>
                            {loadingOrders ? <p>Loading orders...</p> : errorOrders ? <p className={styles.error}>{errorOrders}</p> : (
                                <div className={styles.tableContainer}>
                                    <table className={styles.ordersTable}>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>DATE</th>
                                                <th>TOTAL</th>
                                                <th>PAID</th>
                                                <th>DELIVERED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.order_id}>
                                                    <td>{order.order_id.substring(0, 8)}...</td>
                                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                    <td>${order.total_price}</td>
                                                    <td>{order.is_paid ? 'Yes' : 'No'}</td>
                                                    <td>{order.is_delivered ? 'Yes' : 'No'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;