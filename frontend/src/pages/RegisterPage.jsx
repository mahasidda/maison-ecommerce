import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">MAISON</div>
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
          {[
            { key:'name', label:'Full Name', type:'text' },
            { key:'email', label:'Email', type:'email' },
            { key:'password', label:'Password', type:'password' },
          ].map((f) => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" type={f.type} value={form[f.key]}
                onChange={(e) => setForm({...form, [f.key]: e.target.value})} required />
            </div>
          ))}
          <button className="btn btn-accent auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
