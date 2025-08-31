import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import styles from './AdminProductListScreen.module.css';

const AdminProductListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;

    const productDelete = useSelector(state => state.productDelete);
    const { success: successDelete } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const { success: successCreate, product: createdProduct } = productCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch({ type: 'PRODUCT_CREATE_RESET' });

        if (!userInfo || !userInfo.is_admin) {
            navigate('/login');
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct.product_id}/edit`);
        } else {
            dispatch(listProducts());
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id));
        }
    };

    const createProductHandler = () => {
        dispatch(createProduct());
    };

    return (
        <div className="container">
            <div className={styles.headerRow}>
                <h1>Products</h1>
                <button className={styles.createButton} onClick={createProductHandler}>
                    Create Product
                </button>
            </div>
            {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.product_id}>
                                    <td>{product.product_id.substring(0, 8)}...</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <button className={styles.editButton} onClick={() => navigate(`/admin/product/${product.product_id}/edit`)}>
                                            Edit
                                        </button>
                                        <button className={styles.deleteButton} onClick={() => deleteHandler(product.product_id)}>
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

export default AdminProductListScreen;