import axios from 'axios';

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_CREATE_REQUEST' });

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, order, config);

        dispatch({ type: 'ORDER_CREATE_SUCCESS', payload: data });
        dispatch({ type: 'CART_CLEAR_ITEMS' });
        localStorage.removeItem('cartItems');

    } catch (error) {
        dispatch({
            type: 'ORDER_CREATE_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_DETAILS_REQUEST' });

        const { userLogin: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, config);

        dispatch({ type: 'ORDER_DETAILS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'ORDER_DETAILS_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_LIST_MY_REQUEST' });

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/myorders`, config);

        dispatch({ type: 'ORDER_LIST_MY_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'ORDER_LIST_MY_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};