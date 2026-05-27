import { useState } from 'react';
import { toast } from 'react-toastify';
import './InfoPages.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('Message sent! We will get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="info-page">
      <div className="info-container">
        <h1 className="info-title">Contact Us</h1>
        <p className="info-subtitle">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>

        <div className="contact-grid">
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">support@maison.com</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <div className="contact-label">Phone</div>
                <div className="contact-value">+91 99999 99999</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <div>
                <div className="contact-label">Support Hours</div>
                <div className="contact-value">Mon–Sat, 9am–6pm IST</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-label">Address</div>
                <div className="contact-value">123 Fashion Street,<br />Hyderabad, Telangana 500032</div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="your@email.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" type="text" placeholder="How can we help?"
                value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" rows="5" placeholder="Tell us more..."
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ resize: 'vertical' }} required />
            </div>
            <button className="btn btn-accent" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
              Send Message
            </button>
            {sent && <p style={{ color: 'var(--success)', fontSize: 13, marginTop: '.75rem', textAlign: 'center' }}>✅ Message sent successfully!</p>}
          </form>
        </div>
      </div>
    </div>
  );
}