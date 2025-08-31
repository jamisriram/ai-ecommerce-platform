import axios from 'axios';

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_LIST_REQUEST' });
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
    dispatch({ type: 'PRODUCT_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'PRODUCT_LIST_FAIL', payload: error.message });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_DETAILS_REQUEST' });
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
    dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'PRODUCT_DETAILS_FAIL', payload: error.message });
  }
};

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_CREATE_REVIEW_REQUEST' });
        const { userLogin: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        await axios.post(`${process.env.REACT_APP_API_URL}/api/products/${productId}/reviews`, review, config);
        dispatch({ type: 'PRODUCT_CREATE_REVIEW_SUCCESS' });
    } catch (error) {
        dispatch({
            type: 'PRODUCT_CREATE_REVIEW_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const deleteProductReview = (reviewId) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_DELETE_REVIEW_REQUEST' });
        const { userLogin: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/reviews/${reviewId}`, config);
        dispatch({ type: 'PRODUCT_DELETE_REVIEW_SUCCESS' });
    } catch (error) {
        dispatch({
            type: 'PRODUCT_DELETE_REVIEW_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_DELETE_REQUEST' });
        const { userLogin: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, config);
        dispatch({ type: 'PRODUCT_DELETE_SUCCESS' });
    } catch (error) {
        dispatch({
            type: 'PRODUCT_DELETE_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const createProduct = () => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_CREATE_REQUEST' });
        const { userLogin: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, {}, config);
        dispatch({ type: 'PRODUCT_CREATE_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'PRODUCT_CREATE_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_UPDATE_REQUEST' });
        const { userLogin: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${product.product_id}`, product, config);
        dispatch({ type: 'PRODUCT_UPDATE_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'PRODUCT_UPDATE_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};