import { Nav, Container } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiUsers, FiHome } from 'react-icons/fi';

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h5 className="mb-0">Dashboard</h5>
                </div>
                <Nav className="flex-column sidebar-nav">
                    <Nav.Link as={NavLink} to="/dashboard" end className="sidebar-link">
                        <FiHome className="me-2" /> Overview
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/dashboard/products" className="sidebar-link">
                        <FiPackage className="me-2" /> Products
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/dashboard/carts" className="sidebar-link">
                        <FiShoppingCart className="me-2" /> Carts
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/dashboard/users" className="sidebar-link">
                        <FiUsers className="me-2" /> Users
                    </Nav.Link>
                </Nav>
            </aside>
            <main className="dashboard-main">
                <Container fluid className="p-4">
                    <Outlet />
                </Container>
            </main>
        </div>
    );
}
