import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import productService from '../../services/productService';
import Pagination from '../../components/Pagination';

const LIMIT = 10;

export default function ProductsManager() {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [form, setForm] = useState({ title: '', price: '', description: '', category: '', brand: '', stock: '' });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAll(LIMIT, skip);
            setProducts(data.products);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [skip]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const clearForm = () => setForm({ title: '', price: '', description: '', category: '', brand: '', stock: '' });

    const openAdd = () => {
        setEditing(null);
        clearForm();
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setForm({
            title: product.title || '',
            price: product.price?.toString() || '',
            description: product.description || '',
            category: product.category || '',
            brand: product.brand || '',
            stock: product.stock?.toString() || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
            if (editing) {
                await productService.update(editing.id, payload);
                setAlert({ type: 'success', msg: `Product "${form.title}" updated successfully!` });
            } else {
                await productService.add(payload);
                setAlert({ type: 'success', msg: `Product "${form.title}" added successfully!` });
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setAlert({ type: 'danger', msg: err.response?.data?.message || 'Operation failed.' });
        }
        setTimeout(() => setAlert(null), 4000);
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.title}"?`)) return;
        try {
            await productService.remove(product.id);
            setAlert({ type: 'success', msg: `Product "${product.title}" deleted.` });
            fetchProducts();
        } catch (err) {
            setAlert({ type: 'danger', msg: 'Delete failed.' });
        }
        setTimeout(() => setAlert(null), 4000);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 style={{ fontWeight: 700 }}><FiPackage className="me-2" />Products Manager</h3>
                    <p className="text-muted mb-0">Manage all products in the store</p>
                </div>
                <Button onClick={openAdd}><FiPlus className="me-1" /> Add Product</Button>
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
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td><Badge bg="secondary">#{p.id}</Badge></td>
                                    <td><img src={p.thumbnail} alt={p.title} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /></td>
                                    <td className="truncate" style={{ maxWidth: 200 }}>{p.title}</td>
                                    <td><Badge className="category-badge">{p.category}</Badge></td>
                                    <td style={{ fontWeight: 600 }}>${p.price?.toFixed(2)}</td>
                                    <td>{p.stock}</td>
                                    <td><FiPackage className="text-warning me-1" />{p.rating?.toFixed(1)}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(p)}><FiEdit2 /></Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(p)}><FiTrash2 /></Button>
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
                    <Modal.Title>{editing ? 'Edit Product' : 'Add New Product'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title *</Form.Label>
                                    <Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price *</Form.Label>
                                    <Form.Control type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Control value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">{editing ? 'Update' : 'Add'} Product</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
