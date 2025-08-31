const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProductReview, 
    getProductReviews, 
    createProduct, 
    deleteProduct, 
    updateProduct,
    deleteReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router.route('/:id/reviews').get(getProductReviews).post(protect, createProductReview);

// The 'admin' middleware is removed here to allow any logged-in user to hit the endpoint
router.route('/reviews/:id').delete(protect, deleteReview);

module.exports = router;