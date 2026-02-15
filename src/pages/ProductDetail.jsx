import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner, Button, Image } from 'react-bootstrap';
import { FiStar, FiArrowLeft, FiTag, FiTruck, FiShield, FiPackage, FiRefreshCw } from 'react-icons/fi';
import productService from '../services/productService';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        setLoading(true);
        productService.getById(id)
            .then((data) => { setProduct(data); setActiveImg(0); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading-wrapper"><Spinner animation="border" /></div>;
    if (!product) return <div className="empty-state"><p>Product not found.</p></div>;

    const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
    const images = product.images?.length ? product.images : [product.thumbnail];

    return (
        <div className="page-wrapper">
            <Container className="py-4 flex-grow-1">
                <Button as={Link} to="/" variant="outline-light" className="mb-4" size="sm">
                    <FiArrowLeft className="me-2" /> Back to Products
                </Button>

                <Row className="g-4">
                    <Col lg={6} className="animate-in">
                        <div className="glass-card p-3">
                            <Image src={images[activeImg]} alt={product.title} className="product-detail-img w-100" />
                            {images.length > 1 && (
                                <div className="d-flex gap-2 mt-3 flex-wrap">
                                    {images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`${product.title} - ${i + 1}`}
                                            className={`product-gallery-thumb ${i === activeImg ? 'active' : ''}`}
                                            onClick={() => setActiveImg(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>

                    <Col lg={6} className="animate-in" style={{ animationDelay: '0.1s' }}>
                        <Badge bg="secondary" className="category-badge mb-2"><FiTag className="me-1" />{product.category}</Badge>
                        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.5rem' }}>{product.title}</h1>
                        {product.brand && <p className="text-muted mb-3">by <strong>{product.brand}</strong></p>}

                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="d-flex align-items-center">
                                <FiStar className="text-warning me-1" />
                                <strong>{product.rating?.toFixed(1)}</strong>
                                <span className="text-muted ms-1">({product.reviews?.length || 0} reviews)</span>
                            </div>
                            <Badge className={`status-badge ${product.availabilityStatus === 'In Stock' ? 'in-stock' : product.availabilityStatus === 'Low Stock' ? 'low-stock' : 'out-of-stock'}`}>
                                {product.availabilityStatus}
                            </Badge>
                        </div>

                        <div className="mb-4">
                            <span style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">${discountedPrice}</span>
                            {product.discountPercentage > 0 && (
                                <>
                                    <span className="price-original ms-2" style={{ fontSize: '1.2rem' }}>${product.price.toFixed(2)}</span>
                                    <Badge bg="danger" className="ms-2">-{Math.round(product.discountPercentage)}%</Badge>
                                </>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>

                        <div className="info-grid mt-4">
                            <div className="info-item">
                                <div className="label"><FiTruck className="me-1" /> Shipping</div>
                                <div className="value">{product.shippingInformation}</div>
                            </div>
                            <div className="info-item">
                                <div className="label"><FiShield className="me-1" /> Warranty</div>
                                <div className="value">{product.warrantyInformation}</div>
                            </div>
                            <div className="info-item">
                                <div className="label"><FiRefreshCw className="me-1" /> Return Policy</div>
                                <div className="value">{product.returnPolicy}</div>
                            </div>
                            <div className="info-item">
                                <div className="label"><FiPackage className="me-1" /> Min. Order</div>
                                <div className="value">{product.minimumOrderQuantity} units</div>
                            </div>
                            <div className="info-item">
                                <div className="label">Stock</div>
                                <div className="value">{product.stock} available</div>
                            </div>
                            <div className="info-item">
                                <div className="label">SKU</div>
                                <div className="value">{product.sku}</div>
                            </div>
                        </div>

                        {product.tags?.length > 0 && (
                            <div className="mt-3">
                                {product.tags.map((tag) => (
                                    <Badge key={tag} bg="secondary" className="me-1 mb-1" style={{ fontWeight: 500 }}>#{tag}</Badge>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Reviews */}
                {product.reviews?.length > 0 && (
                    <div className="mt-5 animate-in" style={{ animationDelay: '0.2s' }}>
                        <h4 style={{ fontWeight: 700 }}>Customer Reviews</h4>
                        <Row className="g-3 mt-2">
                            {product.reviews.map((review, i) => (
                                <Col md={4} key={i}>
                                    <div className="review-card">
                                        <div className="d-flex align-items-center mb-2">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <FiStar key={j} style={{ color: j < review.rating ? '#f59e0b' : 'var(--text-muted)', fontSize: '0.85rem', marginRight: 2 }} />
                                            ))}
                                        </div>
                                        <p className="mb-2 small" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                                        <p className="mb-0 small text-muted">— {review.reviewerName}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Container>
        </div>
    );
}
