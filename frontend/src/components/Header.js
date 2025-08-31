import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/userActions';
import styles from './Header.module.css';

const Header = () => {
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo}>
                  AI-Shop
                </Link>
                <div className={styles.navLinks}>
                    <Link to="/search/image" className={styles.navLink}>Image Search</Link>
                    
                    {/* Hide Cart and Profile links from Admins to declutter their view */}
                    {(!userInfo || !userInfo.is_admin) && (
                         <Link to="/cart" className={styles.navLink}>Cart</Link>
                    )}

                    {userInfo ? (
                        <div className={styles.dropdown}>
                            <button className={styles.navLink}>{userInfo.name}</button>
                            <div className={styles.dropdownContent}>
                                <Link to="/profile">Profile</Link>
                                <button onClick={logoutHandler}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className={styles.navLink}>Sign In</Link>
                    )}

                    {userInfo && userInfo.is_admin && (
                        <div className={styles.dropdown}>
                            <button className={`${styles.navLink} ${styles.adminLink}`}>Admin Portal</button>
                            <div className={styles.dropdownContent}>
                                <Link to="/admin/dashboard">Dashboard</Link>
                                <Link to="/admin/productlist">Products</Link>
                                <Link to="/admin/userlist">Users</Link>
                                <Link to="/admin/orderlist">Orders</Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;