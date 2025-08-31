import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import styles from './LoginScreen.module.css';

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    const navigate = useNavigate();
    
    // Redirect if user is not logged in
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    if (!userInfo) {
        navigate('/login');
    }

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Shipping Address</h1>
                <form onSubmit={submitHandler}>
                    <div className={styles.formGroup}>
                        <label>Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Postal Code</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Country</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>
                    <button type="submit" className={styles.submitButton}>Continue</button>
                </form>
            </div>
        </div>
    );
};

export default ShippingScreen;