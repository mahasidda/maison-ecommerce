import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminProducts.css';

const EMPTY = { name:'', brand:'', description:'', price:'', originalPrice:'', category:'women', subCategory:'', sizes:'S,M,L', colors:'Black,White', stock:'10', isNew:false, isFeatured:false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () => getProducts({ limit: 100 }).then(({ data }) => setProducts(data.products));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ ...p, sizes: p.sizes.join(','), colors: p.colors.join(','), originalPrice: p.originalPrice || '' });
    setEditing(p._id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      sizes: form.sizes.split(',').map(s=>s.trim()),
      colors: form.colors.split(',').map(c=>c.trim()),
    };
    try {
      if (editing) await updateProduct(editing, payload);
      else await createProduct(payload);
      toast.success(editing ? 'Product updated!' : 'Product created!');
      setShowForm(false); load();
    } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id); toast.success('Deleted'); load();
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <h1 className="admin-page-title" style={{margin:0}}>Products</h1>
        <button className="btn btn-accent btn-sm" onClick={openCreate}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="ap-form-wrap">
          <h3>{editing ? 'Edit Product' : 'New Product'}</h3>
          <form className="ap-form" onSubmit={handleSubmit}>
            {[
              {key:'name',label:'Product Name'},{key:'brand',label:'Brand'},
              {key:'description',label:'Description'},{key:'price',label:'Price (₹)',type:'number'},
              {key:'originalPrice',label:'Original Price (₹, optional)',type:'number'},
              {key:'stock',label:'Stock',type:'number'},
              {key:'sizes',label:'Sizes (comma separated, e.g. S,M,L)'},
              {key:'colors',label:'Colors (comma separated)'},
              {key:'subCategory',label:'Sub-category (e.g. tops, dresses)'},
            ].map((f) => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type||'text'} value={form[f.key]}
                  onChange={(e) => setForm({...form,[f.key]:e.target.value})}
                  required={!['originalPrice','subCategory'].includes(f.key)} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => setForm({...form,category:e.target.value})}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div className="ap-checkboxes">
              <label><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({...form,isNew:e.target.checked})} /> Mark as New</label>
              <label><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({...form,isFeatured:e.target.checked})} /> Featured</label>
            </div>
            <div style={{display:'flex',gap:'1rem'}}>
              <button className="btn btn-accent" type="submit" disabled={loading}>{loading?'Saving...':'Save Product'}</button>
              <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><strong>{p.name}</strong>{p.isNew && <span className="badge badge-new" style={{marginLeft:'.5rem'}}>New</span>}</td>
                <td>{p.brand}</td>
                <td style={{textTransform:'capitalize'}}>{p.category}</td>
                <td>₹{p.price.toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} style={{marginRight:'.5rem'}}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
