import { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign } from 'react-icons/fi';
import { FaHandPeace, FaBoxOpen, FaShoppingCart, FaUserFriends } from 'react-icons/fa';
import productService from '../services/productService';
import cartService from '../services/cartService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ products: 0, carts: 0, users: 0, categories: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [prods, carts, users, cats] = await Promise.all([
                    productService.getAll(1, 0),
                    cartService.getAll(1, 0),
                    userService.getAll(1, 0),
                    productService.getCategories(),
                ]);
                setStats({
                    products: prods.total,
                    carts: carts.total,
                    users: users.total,
                    categories: cats.length,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="loading-wrapper"><Spinner animation="border" /></div>;

    return (
        <div>
            <div className="mb-4">
                <h2 style={{ fontWeight: 800 }}>
                    Welcome back, <span className="text-gradient">{user?.firstName || 'Admin'}</span> <FaHandPeace className="ms-1" style={{ color: 'var(--warning)' }} />
                </h2>
                <p className="text-muted">Here's what's happening in your store</p>
            </div>

            <Row className="g-4 mb-4">
                <Col sm={6} lg={3} className="animate-in">
                    <div className="stat-card purple">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="stat-value">{stats.products}</div>
                                <div className="stat-label">Total Products</div>
                            </div>
                            <div className="stat-icon purple"><FiPackage /></div>
                        </div>
                    </div>
                </Col>
                <Col sm={6} lg={3} className="animate-in" style={{ animationDelay: '0.05s' }}>
                    <div className="stat-card pink">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="stat-value">{stats.carts}</div>
                                <div className="stat-label">Active Carts</div>
                            </div>
                            <div className="stat-icon pink"><FiShoppingCart /></div>
                        </div>
                    </div>
                </Col>
                <Col sm={6} lg={3} className="animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card blue">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="stat-value">{stats.users}</div>
                                <div className="stat-label">Registered Users</div>
                            </div>
                            <div className="stat-icon blue"><FiUsers /></div>
                        </div>
                    </div>
                </Col>
                <Col sm={6} lg={3} className="animate-in" style={{ animationDelay: '0.15s' }}>
                    <div className="stat-card green">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="stat-value">{stats.categories}</div>
                                <div className="stat-label">Categories</div>
                            </div>
                            <div className="stat-icon green"><FiDollarSign /></div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={6} className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-card p-4">
                        <h5 style={{ fontWeight: 700 }}>Quick Actions</h5>
                        <p className="text-muted small">Manage your store resources from the sidebar</p>
                        <ul className="list-unstyled mt-3">
                            <li className="mb-2"><FaBoxOpen className="me-2" style={{ color: 'var(--accent)' }} /><strong>Products</strong> — Add, edit, or remove products</li>
                            <li className="mb-2"><FaShoppingCart className="me-2" style={{ color: 'var(--accent)' }} /><strong>Carts</strong> — Manage customer shopping carts</li>
                            <li className="mb-2"><FaUserFriends className="me-2" style={{ color: 'var(--accent)' }} /><strong>Users</strong> — View and manage user accounts</li>
                        </ul>
                    </div>
                </Col>
                <Col md={6} className="animate-in" style={{ animationDelay: '0.25s' }}>
                    <div className="glass-card p-4">
                        <h5 style={{ fontWeight: 700 }}>Your Profile</h5>
                        <div className="d-flex align-items-center gap-3 mt-3">
                            <img
                                src={user?.image || `https://dummyjson.com/icon/${user?.username}/60`}
                                alt={user?.firstName}
                                style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid var(--accent)', objectFit: 'cover' }}
                            />
                            <div>
                                <div style={{ fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
                                <div className="small text-muted">{user?.email}</div>
                                <div className="small text-muted">Role: {user?.role || 'User'}</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
