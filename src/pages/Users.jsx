import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiSearch, FiUsers, FiMail, FiMapPin } from 'react-icons/fi';
import userService from '../services/userService';
import Pagination from '../components/Pagination';

const LIMIT = 12;

export default function Users() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            if (search.trim()) {
                data = await userService.search(search, LIMIT, skip);
            } else {
                data = await userService.getAll(LIMIT, skip);
            }
            setUsers(data.users);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    }, [search, skip]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    return (
        <div className="page-wrapper">
            <Container className="py-4 flex-grow-1">
                <div className="page-header">
                    <h1><FiUsers className="me-2" /> User <span className="text-gradient">Directory</span></h1>
                    <p>Browse and search through {total} registered users</p>
                </div>

                <div className="filter-bar">
                    <Row className="g-3 align-items-end">
                        <Col md={5}>
                            <Form.Label>Search Users</Form.Label>
                            <InputGroup>
                                <InputGroup.Text style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                    <FiSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search by name..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={7} className="text-end">
                            <span className="text-muted small">{total} users found</span>
                        </Col>
                    </Row>
                </div>

                {loading ? (
                    <div className="loading-wrapper"><Spinner animation="border" /></div>
                ) : (
                    <Row className="g-4">
                        {users.map((user, i) => (
                            <Col key={user.id} xs={12} sm={6} md={4} lg={3} className="animate-in" style={{ animationDelay: `${i * 0.03}s` }}>
                                <Card className="glass-card h-100 text-center p-3" as={Link} to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="mx-auto mb-2">
                                        <Image
                                            src={user.image || `https://dummyjson.com/icon/${user.username}/80`}
                                            roundedCircle
                                            width={70}
                                            height={70}
                                            style={{ border: '2px solid var(--border-light)', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <Card.Body className="p-0">
                                        <Card.Title style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {user.firstName} {user.lastName}
                                        </Card.Title>
                                        <p className="small text-muted mb-1">@{user.username}</p>
                                        <p className="small mb-1" style={{ color: 'var(--text-secondary)' }}>
                                            <FiMail className="me-1" style={{ fontSize: '0.75rem' }} />
                                            {user.email}
                                        </p>
                                        {user.address && (
                                            <p className="small text-muted mb-0">
                                                <FiMapPin className="me-1" style={{ fontSize: '0.75rem' }} />
                                                {user.address.city}, {user.address.state}
                                            </p>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <Pagination current={skip} total={total} limit={LIMIT} onPageChange={setSkip} />
            </Container>
        </div>
    );
}
