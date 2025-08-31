import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from '../actions/adminActions';
import styles from './AdminProductListScreen.module.css'; // Reuse product list styles

const AdminUserListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userList = useSelector(state => state.userList);
    const { loading, error, users } = userList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo && userInfo.is_admin) {
            dispatch(listUsers());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo]);

    const deleteHandler = (id) => {
        // Dispatch delete user action here in the future
        console.log('delete user', id);
    };

    return (
        <div className="container">
            <h1 className={styles.headerRow}>Users</h1>
            {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.user_id}>
                                    <td>{user.user_id.substring(0, 8)}...</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                    <td>
                                        {user.is_admin ? (
                                            <span style={{ color: 'green' }}>Yes</span>
                                        ) : (
                                            <span style={{ color: 'red' }}>No</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className={styles.deleteButton} onClick={() => deleteHandler(user.user_id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUserListScreen;