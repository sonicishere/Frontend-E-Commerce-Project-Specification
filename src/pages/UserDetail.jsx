import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Image, Badge } from 'react-bootstrap';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase } from 'react-icons/fi';
import userService from '../services/userService';

export default function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        userService.getById(id)
            .then(setUser)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading-wrapper"><Spinner animation="border" /></div>;
    if (!user) return <div className="empty-state"><p>User not found.</p></div>;

    return (
        <div className="page-wrapper">
            <Container className="py-4 flex-grow-1">
                <Button as={Link} to="/users" variant="outline-light" className="mb-4" size="sm">
                    <FiArrowLeft className="me-2" /> Back to Users
                </Button>

                <Row className="g-4">
                    <Col lg={4} className="animate-in">
                        <div className="glass-card user-profile-card">
                            <Image
                                src={user.image || `https://dummyjson.com/icon/${user.username}/120`}
                                roundedCircle
                                width={120}
                                height={120}
                                style={{ border: '3px solid var(--accent)', objectFit: 'cover' }}
                            />
                            <h3 style={{ fontWeight: 700 }} className="mt-3">{user.firstName} {user.lastName}</h3>
                            <p className="text-muted">@{user.username}</p>
                            <Badge className="status-badge in-stock">{user.role}</Badge>
                            <div className="mt-3">
                                <p className="small mb-1"><FiMail className="me-1" /> {user.email}</p>
                                <p className="small mb-1"><FiPhone className="me-1" /> {user.phone}</p>
                                <p className="small mb-0"><FiCalendar className="me-1" /> {user.birthDate} (Age: {user.age})</p>
                            </div>
                        </div>
                    </Col>

                    <Col lg={8} className="animate-in" style={{ animationDelay: '0.1s' }}>
                        <div className="glass-card p-4 mb-4">
                            <h5 style={{ fontWeight: 700 }} className="mb-3">Personal Information</h5>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="label">Gender</div>
                                    <div className="value">{user.gender}</div>
                                </div>
                                <div className="info-item">
                                    <div className="label">Blood Group</div>
                                    <div className="value">{user.bloodGroup}</div>
                                </div>
                                <div className="info-item">
                                    <div className="label">Height</div>
                                    <div className="value">{user.height} cm</div>
                                </div>
                                <div className="info-item">
                                    <div className="label">Weight</div>
                                    <div className="value">{user.weight} kg</div>
                                </div>
                                <div className="info-item">
                                    <div className="label">Eye Color</div>
                                    <div className="value">{user.eyeColor}</div>
                                </div>
                                <div className="info-item">
                                    <div className="label">Hair</div>
                                    <div className="value">{user.hair?.color} - {user.hair?.type}</div>
                                </div>
                            </div>
                        </div>

                        {user.address && (
                            <div className="glass-card p-4 mb-4">
                                <h5 style={{ fontWeight: 700 }} className="mb-3"><FiMapPin className="me-2" />Address</h5>
                                <p className="mb-0">{user.address.address}, {user.address.city}, {user.address.state} {user.address.postalCode}</p>
                            </div>
                        )}

                        {user.company && (
                            <div className="glass-card p-4 mb-4">
                                <h5 style={{ fontWeight: 700 }} className="mb-3"><FiBriefcase className="me-2" />Company</h5>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <div className="label">Company</div>
                                        <div className="value">{user.company.name}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="label">Title</div>
                                        <div className="value">{user.company.title}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="label">Department</div>
                                        <div className="value">{user.company.department}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user.university && (
                            <div className="glass-card p-4">
                                <h5 style={{ fontWeight: 700 }} className="mb-3">Education</h5>
                                <p className="mb-0">{user.university}</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
