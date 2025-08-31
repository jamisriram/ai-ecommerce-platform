import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createProductReview, deleteProductReview } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import axios from 'axios';
import Product from '../components/Product';
import styles from './ProductScreen.module.css';

const ProductScreen = () => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [reviews, setReviews] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;
    
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { success: successProductReview, error: errorProductReview } = productReviewCreate;

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}/reviews`);
            setReviews(data);
        } catch (err) { console.error("Failed to fetch reviews", err); }
    };

    const fetchRecommendations = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_AI_API_URL}/recommend/content-based`, { product_id: id });
            const prods = await Promise.all(data.map(recId => axios.get(`${process.env.REACT_APP_API_URL}/api/products/${recId}`)));
            setRecommendations(prods.map(res => res.data));
        } catch (err) { console.error("Failed to fetch recommendations", err); }
    };

    useEffect(() => {
        const fetchData = () => {
            dispatch(listProductDetails(id));
            fetchReviews();
            fetchRecommendations();
        };

        if (successProductReview) {
            alert('Review Submitted!');
            setRating(0);
            setComment('');
            dispatch({ type: 'PRODUCT_CREATE_REVIEW_RESET' });
        }
        
        fetchData();
    }, [dispatch, id, successProductReview]);
    
    const addToCartHandler = () => {
        dispatch(addToCart(id, qty));
        navigate('/cart');
    };

    const reviewSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(id, { rating, comment }));
    };

    const deleteReviewHandler = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            await dispatch(deleteProductReview(reviewId));
            fetchReviews();
            dispatch(listProductDetails(id));
        }
    };

    const getSentimentData = () => {
        if (!reviews || reviews.length === 0) {
            return { score: 0, text: "No reviews yet" };
        }
        const totalScore = reviews.reduce((acc, review) => acc + (parseFloat(review.sentiment_score) || 0.5), 0);
        const avgScore = (totalScore / reviews.length) * 100;
        return {
            score: avgScore.toFixed(0),
            text: `${avgScore.toFixed(0)}% Positive (${reviews.length} reviews)`
        };
    };

    const sentiment = getSentimentData();

    return (
        <div className="container">
            <Link to='/' className={styles.backLink}>&larr; Back to Products</Link>
            {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
                product && (
                <>
                    <div className={styles.detailsGrid}>
                        <div className={styles.imageColumn}>
                            <img src={product.image_url} alt={product.name} className={styles.productImage}/>
                        </div>

                        <div className={styles.detailsColumn}>
                            <h1 className={styles.productTitle}>{product.name}</h1>
                            <p className={styles.productBrand}>{product.brand}</p>
                            <div className={styles.sentiment}>
                                <span className={styles.sentimentText}>{sentiment.text}</span>
                                <div className={styles.sentimentBar}>
                                    <div className={styles.sentimentFill} style={{ width: `${sentiment.score}%` }}></div>
                                </div>
                            </div>
                            <p className={styles.productPrice}>${product.price}</p>
                            <p className={styles.productDescription}>{product.description}</p>
                            
                            <div className={styles.addToCartSection}>
                                <div className={styles.status}>Status: {product.count_in_stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                                {product.count_in_stock > 0 && (
                                    <div className={styles.qtySelector}>
                                        <span>Qty</span>
                                        <select value={qty} onChange={e => setQty(Number(e.target.value))}>
                                            {[...Array(product.count_in_stock).keys()].map(x => (
                                                <option key={x+1} value={x+1}>{x+1}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <button onClick={addToCartHandler} className={styles.addToCartButton} disabled={product.count_in_stock === 0}>
                                    {product.count_in_stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.bottomSection}>
                        <div className={styles.reviews}>
                            <h2 className={styles.sectionTitle}>Reviews</h2>
                            {reviews.length === 0 && <p>No Reviews</p>}
                            <div className={styles.reviewList}>
                                {reviews.map(review => (
                                    <div key={review.review_id} className={styles.reviewItem}>
                                        <div className={styles.reviewHeader}>
                                            <strong>{review.user_name}</strong>
                                            {userInfo && (userInfo.is_admin || userInfo.user_id === review.user_id) && (
                                                <button 
                                                    className={styles.deleteButton}
                                                    onClick={() => deleteReviewHandler(review.review_id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <p className={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</p>
                                        <p>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.reviewForm}>
                                <h3 className={styles.sectionTitle}>Write a Customer Review</h3>
                                {errorProductReview && <p style={{color: 'red'}}>{errorProductReview}</p>}
                                {userInfo ? (
                                    <form onSubmit={reviewSubmitHandler}>
                                        <div className={styles.formGroup}>
                                            <label>Rating</label>
                                            <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                                                <option value="">Select...</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Comment</label>
                                            <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                                        </div>
                                        <button type="submit" className={styles.submitButton}>Submit</button>
                                    </form>
                                ) : (
                                    <p>Please <Link to="/login">sign in</Link> to write a review.</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.recommendations}>
                            <h2 className={styles.sectionTitle}>You Might Also Like</h2>
                            {recommendations.length > 0 ? (
                                <div className={styles.productsGrid}>
                                    {recommendations.map(recProduct => (
                                        <Product key={recProduct.product_id} product={recProduct} />
                                    ))}
                                </div>
                            ) : <p>Loading recommendations...</p>}
                        </div>
                    </div>
                </>
                )
            )}
        </div>
    );
};

export default ProductScreen;