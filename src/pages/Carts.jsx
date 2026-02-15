import { useState, useEffect, useCallback } from 'react';
import { Container, Table, Spinner, Badge, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiSearch } from 'react-icons/fi';
import cartService from '../services/cartService';
import Pagination from '../components/Pagination';

const LIMIT = 10;

export default function Carts() {
    const [carts, setCarts] = useState([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userIdSearch, setUserIdSearch] = useState('');

    const fetchCarts = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            if (userIdSearch.trim()) {
                data = await cartService.getByUser(userIdSearch.trim());
            } else {
                data = await cartService.getAll(LIMIT, skip);
            }
            setCarts(data.carts);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to fetch carts', err);
        } finally {
            setLoading(false);
        }
    }, [skip, userIdSearch]);

    useEffect(() => { fetchCarts(); }, [fetchCarts]);

    return (
        <div className="page-wrapper">
            <Container className="py-4 flex-grow-1">
                <div className="page-header">
                    <h1><FiShoppingCart className="me-2" /> Shopping <span className="text-gradient">Carts</span></h1>
                    <p>View all carts and their contents</p>
                </div>

                <div className="filter-bar">
                    <Row className="g-3 align-items-end">
                        <Col md={4}>
                            <Form.Label>Search by User ID</Form.Label>
                            <InputGroup>
                                <InputGroup.Text style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                    <FiSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Enter user ID..."
                                    value={userIdSearch}
                                    onChange={(e) => { setUserIdSearch(e.target.value); setSkip(0); }}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={8} className="text-end">
                            <span className="text-muted small">{total} carts found</span>
                        </Col>
                    </Row>
                </div>

                {loading ? (
                    <div className="loading-wrapper"><Spinner animation="border" /></div>
                ) : (
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User ID</th>
                                    <th>Products</th>
                                    <th>Total Qty</th>
                                    <th>Total</th>
                                    <th>Discounted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carts.map((cart) => (
                                    <tr key={cart.id}>
                                        <td><Badge bg="secondary">#{cart.id}</Badge></td>
                                        <td>{cart.userId}</td>
                                        <td>{cart.totalProducts} items</td>
                                        <td>{cart.totalQuantity}</td>
                                        <td className="text-gradient" style={{ fontWeight: 600 }}>${cart.total?.toFixed(2)}</td>
                                        <td style={{ color: 'var(--success)' }}>${cart.discountedTotal?.toFixed(2)}</td>
                                        <td>
                                            <Button as={Link} to={`/carts/${cart.id}`} variant="outline-primary" size="sm">
                                                <FiEye className="me-1" /> View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}

                {!userIdSearch && <Pagination current={skip} total={total} limit={LIMIT} onPageChange={setSkip} />}
            </Container>
        </div>
    );
}
