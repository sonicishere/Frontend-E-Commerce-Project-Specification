import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const LIMIT = 12;

export default function Products() {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        productService.getCategories().then(setCategories).catch(() => { });
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            if (search.trim()) {
                data = await productService.search(search, LIMIT, skip);
            } else if (category) {
                data = await productService.getByCategory(category, LIMIT, skip);
            } else {
                data = await productService.getAll(LIMIT, skip, sortBy, order);
            }
            setProducts(data.products);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    }, [search, category, sortBy, order, skip]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setSkip(0);
        setCategory('');
    };

    const handleCategory = (e) => {
        setCategory(e.target.value);
        setSkip(0);
        setSearch('');
    };

    const handleSort = (e) => {
        const val = e.target.value;
        if (!val) { setSortBy(''); setOrder('asc'); return; }
        const [field, dir] = val.split('-');
        setSortBy(field);
        setOrder(dir);
        setSkip(0);
    };

    return (
        <div className="page-wrapper">
            <Container className="py-4 flex-grow-1">
                <div className="page-header">
                    <h1>Explore <span className="text-gradient">Products</span></h1>
                    <p>Browse our curated collection of {total} products</p>
                </div>

                <div className="filter-bar">
                    <Row className="g-3 align-items-end">
                        <Col md={4}>
                            <Form.Label>Search</Form.Label>
                            <InputGroup>
                                <InputGroup.Text style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                    <FiSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <Form.Label>Category</Form.Label>
                            <Form.Select value={category} onChange={handleCategory}>
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label>Sort By</Form.Label>
                            <Form.Select value={sortBy ? `${sortBy}-${order}` : ''} onChange={handleSort}>
                                <option value="">Default</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating-desc">Rating: Best First</option>
                                <option value="rating-asc">Rating: Low First</option>
                                <option value="title-asc">Name: A-Z</option>
                                <option value="title-desc">Name: Z-A</option>
                            </Form.Select>
                        </Col>
                        <Col md={2} className="text-end">
                            <span className="text-muted small">{total} products found</span>
                        </Col>
                    </Row>
                </div>

                {loading ? (
                    <div className="loading-wrapper">
                        <Spinner animation="border" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <FiSearch style={{ fontSize: '3rem' }} />
                        <p className="mt-3">No products found. Try a different search or filter.</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {products.map((product, i) => (
                            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="animate-in" style={{ animationDelay: `${i * 0.03}s` }}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}

                <Pagination current={skip} total={total} limit={LIMIT} onPageChange={setSkip} />
            </Container>
        </div>
    );
}
