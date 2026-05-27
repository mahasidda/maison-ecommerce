import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [addressForm, setAddressForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    phone: user?.address?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      login({ ...user, ...data });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', { address: addressForm });
      login({ ...user, ...data });
      toast.success('Address updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update address');
    } finally { setLoading(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="avatar-info">
              <div className="avatar-name">{user?.name}</div>
              <div className="avatar-email">{user?.email}</div>
              {user?.role === 'admin' && (
                <span className="badge badge-new" style={{ marginTop: '.4rem' }}>Admin</span>
              )}
            </div>
          </div>

          <nav className="profile-nav">
            {[
              { key: 'profile', icon: '👤', label: 'My Profile' },
              { key: 'address', icon: '📍', label: 'Address' },
              { key: 'password', icon: '🔐', label: 'Change Password' },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`profile-nav-item ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="profile-content">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-card">
              <h2 className="profile-card-title">My Profile</h2>
              <p className="profile-card-sub">Update your personal information</p>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input
                    className="form-input"
                    value={user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    readOnly
                    style={{ color: 'var(--muted)' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Member Since</label>
                  <input
                    className="form-input"
                    value={new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    readOnly
                    style={{ color: 'var(--muted)' }}
                  />
                </div>
                <button className="btn btn-accent" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="profile-card">
              <h2 className="profile-card-title">Delivery Address</h2>
              <p className="profile-card-sub">Your default delivery address</p>
              <form onSubmit={handleAddressUpdate}>
                {[
                  { key: 'phone', label: 'Phone Number', placeholder: '9876543210' },
                  { key: 'street', label: 'Street Address', placeholder: '123 MG Road' },
                  { key: 'city', label: 'City', placeholder: 'Hyderabad' },
                  { key: 'state', label: 'State', placeholder: 'Telangana' },
                  { key: 'pincode', label: 'Pincode', placeholder: '500032' },
                ].map((f) => (
                  <div className="form-group" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder={f.placeholder}
                      value={addressForm[f.key]}
                      onChange={(e) => setAddressForm({ ...addressForm, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
                <button className="btn btn-accent" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="profile-card">
              <h2 className="profile-card-title">Change Password</h2>
              <p className="profile-card-sub">Keep your account secure</p>
              <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button className="btn btn-accent" type="submit" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}