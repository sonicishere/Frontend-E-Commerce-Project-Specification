import { Container } from 'react-bootstrap';
import { FiHeart } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="app-footer">
            <Container className="text-center">
                <p className="mb-1">
                    Made with <FiHeart className="text-danger" /> using React &amp; DummyJSON API
                </p>
                <p className="text-muted small mb-0">
                    &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
                </p>
            </Container>
        </footer>
    );
}
