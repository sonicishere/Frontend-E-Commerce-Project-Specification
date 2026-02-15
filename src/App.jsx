import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Carts from './pages/Carts';
import CartDetail from './pages/CartDetail';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Dashboard from './pages/Dashboard';
import ProductsManager from './pages/dashboard/ProductsManager';
import CartsManager from './pages/dashboard/CartsManager';
import UsersManager from './pages/dashboard/UsersManager';

export default function App() {
    return (
        <>
            <AppNavbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/carts" element={<Carts />} />
                <Route path="/carts/:id" element={<CartDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />

                {/* Protected Dashboard Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsManager />} />
                    <Route path="carts" element={<CartsManager />} />
                    <Route path="users" element={<UsersManager />} />
                </Route>
            </Routes>
            <Footer />
        </>
    );
}
