import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Admin Menu</h2>
                <nav className={styles.sidebarNav}>
                    <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Dashboard</NavLink>
                    <NavLink to="/admin/productlist" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Products</NavLink>
                    <NavLink to="/admin/userlist" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Users</NavLink>
                    <NavLink to="/admin/orderlist" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Orders</NavLink>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;