import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
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
                {/* Auth Routes (public) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes - require login */}
                <Route path="/" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                <Route path="/carts" element={<ProtectedRoute><Carts /></ProtectedRoute>} />
                <Route path="/carts/:id" element={<ProtectedRoute><CartDetail /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                <Route path="/users/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />

                {/* Protected Dashboard Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <AdminRoute>
                            <DashboardLayout />
                        </AdminRoute>
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
