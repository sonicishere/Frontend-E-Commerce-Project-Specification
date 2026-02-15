import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import cartService from '../../services/cartService';
import Pagination from '../../components/Pagination';

const LIMIT = 10;

export default function CartsManager() {
    const [carts, setCarts] = useState([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [form, setForm] = useState({ userId: '', products: [{ id: '', quantity: '' }] });

    const fetchCarts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await cartService.getAll(LIMIT, skip);
            setCarts(data.carts);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [skip]);

    useEffect(() => { fetchCarts(); }, [fetchCarts]);

    const clearForm = () => setForm({ userId: '', products: [{ id: '', quantity: '' }] });

    const openAdd = () => {
        setEditing(null);
        clearForm();
        setShowModal(true);
    };

    const openEdit = (cart) => {
        setEditing(cart);
        setForm({
            userId: cart.userId?.toString() || '',
            products: cart.products?.map((p) => ({ id: p.id.toString(), quantity: p.quantity.toString() })) || [{ id: '', quantity: '' }],
        });
        setShowModal(true);
    };

    const addProductRow = () => {
        setForm({ ...form, products: [...form.products, { id: '', quantity: '' }] });
    };

    const updateProductRow = (index, field, value) => {
        const updated = [...form.products];
        updated[index][field] = value;
        setForm({ ...form, products: updated });
    };

    const removeProductRow = (index) => {
        const updated = form.products.filter((_, i) => i !== index);
        setForm({ ...form, products: updated.length ? updated : [{ id: '', quantity: '' }] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                userId: parseInt(form.userId),
                products: form.products.filter((p) => p.id && p.quantity).map((p) => ({
                    id: parseInt(p.id),
                    quantity: parseInt(p.quantity),
                })),
            };

            if (editing) {
                await cartService.update(editing.id, { ...payload, merge: false });
                setAlert({ type: 'success', msg: `Cart #${editing.id} updated!` });
            } else {
                await cartService.add(payload);
                setAlert({ type: 'success', msg: 'New cart created!' });
            }
            setShowModal(false);
            fetchCarts();
        } catch (err) {
            setAlert({ type: 'danger', msg: err.response?.data?.message || 'Operation failed.' });
        }
        setTimeout(() => setAlert(null), 4000);
    };

    const handleDelete = async (cart) => {
        if (!window.confirm(`Delete cart #${cart.id}?`)) return;
        try {
            await cartService.remove(cart.id);
            setAlert({ type: 'success', msg: `Cart #${cart.id} deleted.` });
            fetchCarts();
        } catch (err) {
            setAlert({ type: 'danger', msg: 'Delete failed.' });
        }
        setTimeout(() => setAlert(null), 4000);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 style={{ fontWeight: 700 }}><FiShoppingCart className="me-2" />Carts Manager</h3>
                    <p className="text-muted mb-0">Manage all shopping carts</p>
                </div>
                <Button onClick={openAdd}><FiPlus className="me-1" /> Add Cart</Button>
            </div>

            {alert && <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</Alert>}

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
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Discounted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carts.map((c) => (
                                <tr key={c.id}>
                                    <td><Badge bg="secondary">#{c.id}</Badge></td>
                                    <td>{c.userId}</td>
                                    <td>{c.totalProducts}</td>
                                    <td>{c.totalQuantity}</td>
                                    <td style={{ fontWeight: 600 }}>${c.total?.toFixed(2)}</td>
                                    <td style={{ color: 'var(--success)' }}>${c.discountedTotal?.toFixed(2)}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(c)}><FiEdit2 /></Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(c)}><FiTrash2 /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <Pagination current={skip} total={total} limit={LIMIT} onPageChange={setSkip} />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? `Edit Cart #${editing.id}` : 'Add New Cart'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>User ID *</Form.Label>
                            <Form.Control type="number" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
                        </Form.Group>

                        <Form.Label>Products</Form.Label>
                        {form.products.map((p, i) => (
                            <Row key={i} className="g-2 mb-2 align-items-end">
                                <Col>
                                    <Form.Control type="number" placeholder="Product ID" value={p.id} onChange={(e) => updateProductRow(i, 'id', e.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Control type="number" placeholder="Quantity" value={p.quantity} onChange={(e) => updateProductRow(i, 'quantity', e.target.value)} />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="outline-light" size="sm" onClick={() => removeProductRow(i)}>✕</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="outline-primary" size="sm" onClick={addProductRow} className="mt-2"><FiPlus className="me-1" /> Add Item</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">{editing ? 'Update' : 'Create'} Cart</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
