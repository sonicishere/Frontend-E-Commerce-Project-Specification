import { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { FiUserPlus } from 'react-icons/fi';

export default function Register() {
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', username: '', password: '', age: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!form.firstName || !form.lastName || !form.email || !form.username || !form.password) {
            setError('Please fill all required fields.');
            return;
        }

        setLoading(true);
        try {
            await userService.add({
                ...form,
                age: parseInt(form.age) || 25,
            });
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in" style={{ maxWidth: 520 }}>
                <div className="text-center mb-4">
                    <div className="brand-icon mx-auto mb-3" style={{ width: 56, height: 56, fontSize: '1.2rem' }}>EC</div>
                    <h2>Create Account</h2>
                    <p className="subtitle">Join E-Commerce today</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name *</Form.Label>
                                <Form.Control name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name *</Form.Label>
                                <Form.Control name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
                    </Form.Group>

                    <Row>
                        <Col sm={8}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username *</Form.Label>
                                <Form.Control name="username" placeholder="johndoe" value={form.username} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Age</Form.Label>
                                <Form.Control name="age" type="number" placeholder="25" value={form.age} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} />
                    </Form.Group>

                    <Button type="submit" className="w-100 mb-3" size="lg" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FiUserPlus className="me-2" />}
                        Create Account
                    </Button>
                </Form>

                <div className="auth-divider">or</div>

                <div className="text-center">
                    <p className="text-muted small mb-2">Already have an account?</p>
                    <Button as={Link} to="/login" variant="outline-primary" className="w-100">
                        Sign In
                    </Button>
                </div>
            </div>
        </div>
    );
}
