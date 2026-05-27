import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    const params = { limit: 12 };
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (search) params.search = search;

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category, sort, search]);

  const set = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
          <span className="products-count"> ({total})</span>
        </h1>
        <div className="products-controls">
          <input
            className="form-input search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => set('search', e.target.value)}
          />
          <select className="form-select" value={sort} onChange={(e) => set('sort', e.target.value)}>
            <option value="">Sort: Featured</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-layout">
        <aside className="products-sidebar">
          <h3>Category</h3>
          {[
            { label: 'All', value: '' },
            { label: 'Women', value: 'women' },
            { label: 'Men', value: 'men' },
            { label: 'Accessories', value: 'accessories' },
          ].map((c) => (
            <button
              key={c.value}
              className={`filter-item ${category === c.value ? 'active' : ''}`}
              onClick={() => set('category', c.value)}
            >
              {c.label}
            </button>
          ))}
        </aside>

        <div className="products-grid">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <p className="text-muted text-center mt-4">No products found.</p>
          ) : (
            products.map((p) => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </div>
    </div>
  );
}