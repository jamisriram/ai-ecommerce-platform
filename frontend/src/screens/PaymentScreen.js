import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import styles from './LoginScreen.module.css';
import paymentStyles from './PaymentScreen.module.css';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);
    
    if (!cart.shippingAddress.address) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Payment Method</h1>
                <form onSubmit={submitHandler}>
                    <div className={paymentStyles.formGroup}>
                        <label>
                            <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="PayPal" 
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            PayPal or Credit Card
                        </label>
                    </div>
                    <button type="submit" className={styles.submitButton}>Continue</button>
                </form>
            </div>
        </div>
    );
};

export default PaymentScreen;