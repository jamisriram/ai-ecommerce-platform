import React, { useState } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import styles from './ImageSearchScreen.module.css';

const ImageSearchScreen = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResults([]);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select an image file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        setLoading(true);
        setError('');

        try {
            const { data: productIds } = await axios.post(`${process.env.REACT_APP_AI_API_URL}/search/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const productPromises = productIds.map(id => axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`));
            const productResponses = await Promise.all(productPromises);
            setResults(productResponses.map(res => res.data));

        } catch (err) {
            setError('Could not find similar products. Please try another image.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className={styles.searchContainer}>
                <h1 className={styles.title}>Find Products by Image</h1>
                <p className={styles.subtitle}>Upload a photo of an item you're looking for.</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input type="file" onChange={handleFileChange} accept="image/*" className={styles.fileInput} />
                    <button type="submit" disabled={loading || !selectedFile} className={styles.submitButton}>
                        {loading ? 'Searching...' : 'Find Similar Items'}
                    </button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>

            {preview && (
                <div className={styles.previewContainer}>
                    <h2>Your Uploaded Image:</h2>
                    <img src={preview} alt="Upload preview" className={styles.previewImage} />
                </div>
            )}
            
            <div className={styles.resultsContainer}>
                {loading && <p>Finding similar products...</p>}
                {results.length > 0 && <h2>Similar Products Found:</h2>}
                <div className={styles.productsGrid}>
                    {results.map(product => (
                        <Product key={product.product_id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageSearchScreen;