import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || '',
    }
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated!', {
        style: { background: '#1e1e2e', color: '#f0ecfa', border: '1px solid #2d2d42' }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed!', {
        style: { background: '#1e1e2e', color: '#f0ecfa', border: '1px solid #2d2d42' }
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-brand-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-surface-300">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="badge bg-brand-950 text-brand-400 border border-brand-800 mt-1">Admin</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-ink-800 border border-ink-700 rounded-xl p-1 w-fit">
        {['profile', 'security'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize
              ${activeTab === tab ? 'bg-brand-600 text-white' : 'text-surface-300 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 animate-fade-in">
          <h2 className="font-display text-xl font-bold text-white mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-surface-300 mb-1.5">Full Name</label>
                <input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-surface-300 mb-1.5">Phone</label>
                <input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                  className="input-field"
                  placeholder="+880 1XXXXXXXXX"
                />
              </div>
            </div>

            <div className="border-t border-ink-700 pt-5">
              <h3 className="font-medium text-white mb-4">Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-surface-300 mb-1.5">Street</label>
                  <input
                    value={profileForm.address.street}
                    onChange={(e) => setProfileForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))}
                    className="input-field"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">City</label>
                    <input
                      value={profileForm.address.city}
                      onChange={(e) => setProfileForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">State</label>
                    <input
                      value={profileForm.address.state}
                      onChange={(e) => setProfileForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">ZIP Code</label>
                    <input
                      value={profileForm.address.zipCode}
                      onChange={(e) => setProfileForm(f => ({ ...f, address: { ...f.address, zipCode: e.target.value } }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">Country</label>
                    <input
                      value={profileForm.address.country}
                      onChange={(e) => setProfileForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary py-2.5">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={logout} className="btn-ghost text-red-400 hover:text-red-300">
                Sign Out
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card p-6 animate-fade-in">
          <h2 className="font-display text-xl font-bold text-white mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-surface-300 mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-surface-300 mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={pwForm.newPassword}
                onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-surface-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
