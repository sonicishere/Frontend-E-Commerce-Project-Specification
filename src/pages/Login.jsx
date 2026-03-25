import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            const data = await login(username, password);
            navigate(data.role === 'admin' ? '/dashboard' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <div className="text-center mb-4">
                    <div className="brand-icon mx-auto mb-3" style={{ width: 56, height: 56, fontSize: '1.2rem' }}>EC</div>
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Sign in to your E-Commerce account</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label><FiUser className="me-1" /> Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label><FiLock className="me-1" /> Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100 mb-3" size="lg" disabled={loading}>
                        {loading ? (
                            <Spinner animation="border" size="sm" className="me-2" />
                        ) : (
                            <FiLogIn className="me-2" />
                        )}
                        Sign In
                    </Button>
                </Form>

                <div className="auth-divider">or</div>

                <div className="text-center">
                    <p className="text-muted small mb-2">Don't have an account?</p>
                    <Button as={Link} to="/register" variant="outline-primary" className="w-100">
                        Create Account
                    </Button>
                </div>

            </div>
        </div>
    );
}
