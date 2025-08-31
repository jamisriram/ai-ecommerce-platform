import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, updateProduct } from '../actions/productActions';
import styles from './LoginScreen.module.css'; // Reuse form styles

const AdminProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: 'PRODUCT_UPDATE_RESET' });
            navigate('/admin/productlist');
        } else {
            if (!product || product.product_id !== productId) {
                dispatch(listProductDetails(productId));
            } else {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image_url);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.count_in_stock);
                setDescription(product.description);
            }
        }
    }, [dispatch, navigate, productId, product, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            product_id: productId,
            name,
            price,
            image_url: image,
            brand,
            category,
            count_in_stock: countInStock,
            description,
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard} style={{maxWidth: '600px'}}>
                <Link to="/admin/productlist" className='btn btn-light my-3'>Go Back</Link>
                <h1 className={styles.title}>Edit Product</h1>
                {loadingUpdate && <p>Loading...</p>}
                {errorUpdate && <p className={styles.error}>{errorUpdate}</p>}
                {loading ? <p>Loading product details...</p> : error ? <p className={styles.error}>{error}</p> : (
                    <form onSubmit={submitHandler}>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Price</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Image URL</label>
                            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Brand</label>
                            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Count In Stock</label>
                            <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <button type="submit" className={styles.submitButton}>Update Product</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminProductEditScreen;