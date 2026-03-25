import { Navbar, Nav, Container, Button, Dropdown, Image, Badge } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUsers, FiGrid, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function AppNavbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="app-navbar" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-logo">
                    <span className="brand-icon">EC</span>
                    <span className="brand-text">E-Commerce</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end className="nav-item-link">
                            Products
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/carts" className="nav-item-link" style={{ position: 'relative' }}>
                            <FiShoppingCart className="me-1" /> Cart
                            {totalItems > 0 && (
                                <Badge pill bg="danger" style={{ position: 'absolute', top: 2, right: 2, fontSize: '0.65rem', minWidth: 18 }}>
                                    {totalItems}
                                </Badge>
                            )}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/users" className="nav-item-link">
                            <FiUsers className="me-1" /> Users
                        </Nav.Link>
                        {isAdmin && (
                            <Nav.Link as={NavLink} to="/dashboard" className="nav-item-link">
                                <FiGrid className="me-1" /> Dashboard
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="user-dropdown p-0 border-0">
                                    <Image
                                        src={user?.image || `https://dummyjson.com/icon/${user?.username}/40`}
                                        roundedCircle
                                        width={36}
                                        height={36}
                                        className="me-2"
                                        alt={user?.firstName}
                                    />
                                    <span className="user-name">{user?.firstName}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-dark">
                                    <Dropdown.Header>{user?.email}</Dropdown.Header>
                                    {isAdmin && (
                                        <>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
                                        </>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>
                                        <FiLogOut className="me-2" /> Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <div className="d-flex gap-2">
                                <Button as={Link} to="/login" variant="outline-light" size="sm" className="auth-btn">
                                    <FiLogIn className="me-1" /> Login
                                </Button>
                                <Button as={Link} to="/register" variant="primary" size="sm" className="auth-btn">
                                    <FiUserPlus className="me-1" /> Register
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
