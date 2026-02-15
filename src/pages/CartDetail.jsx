import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Badge, Button, Row, Col } from 'react-bootstrap';
import { FiArrowLeft, FiUser, FiShoppingCart } from 'react-icons/fi';
import cartService from '../services/cartService';

export default function CartDetail() {
    const { id } = useParams();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        cartService.getById(id)
            .then(setCart)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading-wrapper"><Spinner animation="border" /></div>;
    if (!cart) return <div className="empty-state"><p>Cart not found.</p></div>;

    return (
        <div className="page-wrapper">
            <Container className="py-4 flex-grow-1">
                <Button as={Link} to="/carts" variant="outline-light" className="mb-4" size="sm">
                    <FiArrowLeft className="me-2" /> Back to Carts
                </Button>

                <div className="page-header">
                    <h1><FiShoppingCart className="me-2" /> Cart <span className="text-gradient">#{cart.id}</span></h1>
                    <p><FiUser className="me-1" /> User ID: {cart.userId}</p>
                </div>

                <Row className="g-4">
                    <Col lg={8} className="animate-in">
                        <div className="glass-card p-4">
                            <h5 style={{ fontWeight: 700 }} className="mb-3">Cart Items ({cart.totalProducts})</h5>
                            {cart.products?.map((product) => (
                                <div key={product.id} className="cart-product-row">
                                    <img src={product.thumbnail} alt={product.title} className="cart-product-thumb" />
                                    <div className="flex-grow-1">
                                        <Link to={`/products/${product.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {product.title}
                                        </Link>
                                        <div className="small text-muted">
                                            ${product.price.toFixed(2)} × {product.quantity}
                                            {product.discountPercentage > 0 && (
                                                <Badge bg="danger" className="ms-2" style={{ fontSize: '0.65rem' }}>
                                                    -{Math.round(product.discountPercentage)}%
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div style={{ fontWeight: 600 }}>${product.total?.toFixed(2)}</div>
                                        {product.discountedTotal && (
                                            <div className="small" style={{ color: 'var(--success)' }}>
                                                ${(product.discountedTotal || product.discountedPrice)?.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>

                    <Col lg={4} className="animate-in" style={{ animationDelay: '0.1s' }}>
                        <div className="cart-summary">
                            <h5 style={{ fontWeight: 700 }} className="mb-3">Order Summary</h5>
                            <div className="summary-row">
                                <span>Products</span>
                                <span>{cart.totalProducts}</span>
                            </div>
                            <div className="summary-row">
                                <span>Total Quantity</span>
                                <span>{cart.totalQuantity}</span>
                            </div>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${cart.total?.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span style={{ color: 'var(--success)' }}>Discount</span>
                                <span style={{ color: 'var(--success)' }}>-${(cart.total - cart.discountedTotal)?.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span className="text-gradient">${cart.discountedTotal?.toFixed(2)}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
