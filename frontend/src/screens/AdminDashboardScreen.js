import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './AdminDashboardScreen.module.css';

const AdminDashboardScreen = () => {
    const [stats, setStats] = useState({ userCount: 0, orderCount: 0, totalRevenue: 0 });
    const { userInfo } = useSelector(state => state.userLogin);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/admin/stats', config);
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, [userInfo.token]);
    
    return (
        <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h2>Total Users</h2>
                    <p>{stats.userCount}</p>
                </div>
                <div className={styles.statCard}>
                    <h2>Total Orders</h2>
                    <p>{stats.orderCount}</p>
                </div>
                <div className={styles.statCard}>
                    <h2>Total Revenue</h2>
                    <p>${Number(stats.totalRevenue).toFixed(2)}</p>
                </div>
            </div>
            {/* Add recent orders and charts here in the future */}
        </div>
    );
};

export default AdminDashboardScreen;