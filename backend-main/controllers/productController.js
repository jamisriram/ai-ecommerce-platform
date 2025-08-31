const db = require('../config/db');
const axios = require('axios');

const getProducts = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE product_id = $1', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    try {
        const { rows: productRows } = await db.query('SELECT * FROM products WHERE product_id = $1', [productId]);
        if (productRows.length === 0) return res.status(404).json({ message: 'Product not found' });

        let sentimentScore = 0.5;
        try {
            const sentimentResponse = await axios.post(`${process.env.AI_API_URL}/analyze/sentiment`, { text: comment });
            sentimentScore = sentimentResponse.data.score;
        } catch (aiError) {
            console.error("AI service error:", aiError.message);
        }

        await db.query(
            'INSERT INTO reviews (product_id, user_id, user_name, rating, comment, sentiment_score) VALUES ($1, $2, $3, $4, $5, $6)',
            [productId, req.user.user_id, req.user.name, Number(rating), comment, sentimentScore]
        );

        const { rows: reviewRows } = await db.query('SELECT rating FROM reviews WHERE product_id = $1', [productId]);
        const numReviews = reviewRows.length;
        const newRating = reviewRows.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        await db.query('UPDATE products SET num_reviews = $1, rating = $2 WHERE product_id = $3', [numReviews, newRating, productId]);
        
        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC', [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { rows: reviewRows } = await db.query('SELECT * FROM reviews WHERE review_id = $1', [req.params.id]);
        if (reviewRows.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        const review = reviewRows[0];
        
        // NEW PERMISSION CHECK: User must be the review owner OR an admin
        if (review.user_id.toString() !== req.user.user_id.toString() && !req.user.is_admin) {
            return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        const productId = review.product_id;
        await db.query('DELETE FROM reviews WHERE review_id = $1', [req.params.id]);

        const { rows: remainingReviews } = await db.query('SELECT rating FROM reviews WHERE product_id = $1', [productId]);
        
        const numReviews = remainingReviews.length;
        const newRating = numReviews > 0 ? remainingReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0;
        
        await db.query('UPDATE products SET num_reviews = $1, rating = $2 WHERE product_id = $3', [numReviews, newRating, productId]);

        res.json({ message: 'Review removed' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const productResult = await db.query(
            "INSERT INTO products (name, price, image_url, brand, category, count_in_stock, description) VALUES ('Sample name', 0, '/images/sample.jpg', 'Sample brand', 'Sample category', 0, 'Sample description') RETURNING *",
        );
        res.status(201).json(productResult.rows[0]);
    } catch(e) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM products WHERE product_id = $1', [req.params.id]);
        if (rows.length > 0) {
            const updatedProduct = await db.query(
                "UPDATE products SET name = $1, price = $2, description = $3, image_url = $4, brand = $5, category = $6, count_in_stock = $7 WHERE product_id = $8 RETURNING *",
                [name, price, description, image, brand, category, countInStock, req.params.id]
            );
            res.json(updatedProduct.rows[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch(e) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM products WHERE product_id = $1', [req.params.id]);
        if (rows.length > 0) {
            await db.query('DELETE FROM products WHERE product_id = $1', [req.params.id]);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch(e) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProducts, getProductById, createProductReview, getProductReviews, createProduct, updateProduct, deleteProduct, deleteReview };