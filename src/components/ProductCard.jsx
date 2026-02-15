import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiStar, FiTag } from 'react-icons/fi';

export default function ProductCard({ product }) {
    const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

    return (
        <Card className="product-card h-100" as={Link} to={`/products/${product.id}`}>
            <div className="product-img-wrapper">
                <Card.Img
                    variant="top"
                    src={product.thumbnail}
                    alt={product.title}
                    className="product-img"
                />
                {product.discountPercentage > 5 && (
                    <Badge bg="danger" className="discount-badge">
                        -{Math.round(product.discountPercentage)}%
                    </Badge>
                )}
            </div>
            <Card.Body className="d-flex flex-column">
                <div className="mb-1">
                    <Badge bg="secondary" className="category-badge">
                        <FiTag className="me-1" />
                        {product.category}
                    </Badge>
                </div>
                <Card.Title className="product-title">{product.title}</Card.Title>
                <Card.Text className="product-desc text-muted small">
                    {product.description?.substring(0, 80)}...
                </Card.Text>
                <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2">
                        <FiStar className="text-warning me-1" />
                        <span className="rating-value">{product.rating?.toFixed(1)}</span>
                        <span className="text-muted ms-1 small">({product.reviews?.length || 0})</span>
                    </div>
                    <div className="price-row">
                        <span className="price-current">${discountedPrice}</span>
                        {product.discountPercentage > 0 && (
                            <span className="price-original">${product.price.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
