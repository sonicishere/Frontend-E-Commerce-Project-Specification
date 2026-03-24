import { Container, Table, Button, Badge, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Carts() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

    const getDiscountedPrice = (item) => {
        return item.price * (1 - item.discountPercentage / 100);
    };

    return (
        <div className="page-wrapper">
            <Container className="py-4 flex-grow-1">
                <div className="page-header">
                    <h1><FiShoppingCart className="me-2" /> Shopping <span className="text-gradient">Cart</span></h1>
                    <p>Manage the products in your shopping cart</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-state glass-card p-5 text-center">
                        <FiShoppingBag style={{ fontSize: '4rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h4 style={{ fontWeight: 700 }}>Your cart is empty</h4>
                        <p className="text-muted mb-3">You haven't added any products yet</p>
                        <Button as={Link} to="/" variant="primary">
                            <FiArrowLeft className="me-2" />Browse Products
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">{totalItems} item(s) in cart</span>
                            <Button variant="outline-light" size="sm" onClick={clearCart}>
                                <FiTrash2 className="me-1" /> Clear Cart
                            </Button>
                        </div>

                        <Row className="g-4">
                            <Col lg={8}>
                                <div className="table-responsive">
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item) => {
                                                const discountedPrice = getDiscountedPrice(item);
                                                return (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Image
                                                                    src={item.thumbnail}
                                                                    alt={item.title}
                                                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                                                />
                                                                <div>
                                                                    <Link to={`/products/${item.id}`} className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                                                                        {item.title}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontWeight: 600 }}>
                                                            ${discountedPrice.toFixed(2)}
                                                            {item.discountPercentage > 0 && (
                                                                <small className="text-muted d-block text-decoration-line-through">${item.price.toFixed(2)}</small>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Button variant="outline-light" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                                    <FiMinus size={14} />
                                                                </Button>
                                                                <Badge bg="secondary" style={{ minWidth: 32, fontSize: '0.85rem' }}>{item.quantity}</Badge>
                                                                <Button variant="outline-light" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                    <FiPlus size={14} />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                        <td className="text-gradient" style={{ fontWeight: 700 }}>
                                                            ${(discountedPrice * item.quantity).toFixed(2)}
                                                        </td>
                                                        <td>
                                                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                                                                <FiTrash2 />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>

                            <Col lg={4}>
                                <div className="glass-card p-4">
                                    <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Items</span>
                                        <span style={{ fontWeight: 600 }}>{totalItems}</span>
                                    </div>
                                    <hr style={{ borderColor: 'var(--border-color)' }} />
                                    <div className="d-flex justify-content-between mb-3">
                                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                        <span className="text-gradient" style={{ fontWeight: 800, fontSize: '1.3rem' }}>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <Button className="w-100" size="lg" style={{ fontWeight: 600 }}>
                                        Checkout
                                    </Button>
                                    <Button as={Link} to="/" variant="outline-light" className="w-100 mt-2" size="sm">
                                        <FiArrowLeft className="me-1" /> Continue Shopping
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </div>
    );
}
