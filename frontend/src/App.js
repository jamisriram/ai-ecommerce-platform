import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts and Route Protection
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Core Screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ImageSearchScreen from './screens/ImageSearchScreen';

// Checkout Screens
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

// Admin Screens
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminProductListScreen from './screens/AdminProductListScreen';
import AdminUserListScreen from './screens/AdminUserListScreen';
import AdminProductEditScreen from './screens/AdminProductEditScreen';

function App() {
  return (
    <Router>
      <Header />
      <main>
            <Routes>
              {/* Customer-Facing Routes */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/search/image" element={<ImageSearchScreen />} />

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboardScreen />} />
                    <Route path="productlist" element={<AdminProductListScreen />} />
                    <Route path="userlist" element={<AdminUserListScreen />} />
                    <Route path="product/:id/edit" element={<AdminProductEditScreen />} />
                </Route>
              </Route>
            </Routes>
      </main>
    </Router>
  );
}

export default App;