import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Badge, Row, Col, Image } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import userService from '../../services/userService';
import Pagination from '../../components/Pagination';

const LIMIT = 10;

export default function UsersManager() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', age: '', phone: '' });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userService.getAll(LIMIT, skip);
            setUsers(data.users);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [skip]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const clearForm = () => setForm({ firstName: '', lastName: '', email: '', username: '', age: '', phone: '' });

    const openAdd = () => {
        setEditing(null);
        clearForm();
        setShowModal(true);
    };

    const openEdit = (user) => {
        setEditing(user);
        setForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            username: user.username || '',
            age: user.age?.toString() || '',
            phone: user.phone || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, age: parseInt(form.age) || 0 };
            if (editing) {
                await userService.update(editing.id, payload);
                setAlert({ type: 'success', msg: `User "${form.firstName}" updated!` });
            } else {
                await userService.add(payload);
                setAlert({ type: 'success', msg: `User "${form.firstName}" added!` });
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            setAlert({ type: 'danger', msg: err.response?.data?.message || 'Operation failed.' });
        }
        setTimeout(() => setAlert(null), 4000);
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user "${user.firstName} ${user.lastName}"?`)) return;
        try {
            await userService.remove(user.id);
            setAlert({ type: 'success', msg: `User deleted.` });
            fetchUsers();
        } catch (err) {
            setAlert({ type: 'danger', msg: 'Delete failed.' });
        }
        setTimeout(() => setAlert(null), 4000);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 style={{ fontWeight: 700 }}><FiUsers className="me-2" />Users Manager</h3>
                    <p className="text-muted mb-0">Manage all user accounts</p>
                </div>
                <Button onClick={openAdd}><FiPlus className="me-1" /> Add User</Button>
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
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td><Badge bg="secondary">#{u.id}</Badge></td>
                                    <td>
                                        <Image
                                            src={u.image || `https://dummyjson.com/icon/${u.username}/32`}
                                            roundedCircle width={32} height={32}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                                    <td className="text-muted">@{u.username}</td>
                                    <td className="truncate" style={{ maxWidth: 200 }}>{u.email}</td>
                                    <td>{u.age}</td>
                                    <td><Badge className="category-badge">{u.role}</Badge></td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(u)}><FiEdit2 /></Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(u)}><FiTrash2 /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <Pagination current={skip} total={total} limit={LIMIT} onPageChange={setSkip} />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit User' : 'Add New User'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name *</Form.Label>
                                    <Form.Control value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name *</Form.Label>
                                    <Form.Control value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        </Form.Group>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">{editing ? 'Update' : 'Add'} User</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
