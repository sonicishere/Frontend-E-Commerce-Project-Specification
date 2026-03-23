import { Container } from 'react-bootstrap';
export default function Footer() {
    return (
        <footer className="app-footer">
            <Container className="text-center">
                <p className="text-muted small mb-0">
                    &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
                </p>
            </Container>
        </footer>
    );
}
