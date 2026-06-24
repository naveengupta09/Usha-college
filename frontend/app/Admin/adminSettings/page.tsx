'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Lock, Save, User, Loader2, CheckCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { admin } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  return (
    <div className="max-w-2xl space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {(['profile', 'password'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-uipe-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-uipe-navy/40'}`}>
            {tab === 'profile' ? <span className="flex items-center gap-2"><User size={14} />Profile</span>
              : <span className="flex items-center gap-2"><Lock size={14} />Password</span>}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <ProfileForm admin={admin} />}
      {activeTab === 'password' && <PasswordForm />}
    </div>
  );
}

type Admin = { name?: string; email?: string; role?: string; image?: string };

function ProfileForm({ admin }: { admin: Admin | null }) {
  const { admin } = useAuthStore();
  const [name, setName] = useState(admin?.name || '');
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: () => adminApi.changePassword({ name }),
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500); toast.success('Profile updated!'); },
    onError: () => toast.error('Update failed'),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <h3 className="font-heading font-bold text-uipe-navy text-lg">Profile Information</h3>
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-uipe-navy flex items-center justify-center text-white font-bold text-2xl">
          {admin?.name?.[0] || 'A'}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{admin?.name}</p>
          <p className="text-sm text-gray-400">{admin?.email}</p>
          <span className="inline-block text-xs bg-uipe-gold/10 text-uipe-gold font-medium px-2 py-0.5 rounded-full mt-1 capitalize">{admin?.role}</span>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Email Address</label>
        <input value={admin?.email || ''} disabled
          className="w-full px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Role</label>
          <input value={admin?.role || ''} disabled
            className="w-full px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed capitalize" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">College Code</label>
          <input value="443" disabled
            className="w-full px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
        </div>
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}
        className={`flex items-center gap-2 ${saved ? 'bg-emerald-600' : 'bg-uipe-navy'}`}>
        {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
        {mutation.isPending ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </Button>
    </motion.div>
  );
}

function PasswordForm(): React.ReactElement {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await adminApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <h3 className="font-heading font-bold text-uipe-navy text-lg">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Current Password', key: 'currentPassword' },
          { label: 'New Password', key: 'newPassword' },
          { label: 'Confirm New Password', key: 'confirmPassword' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
            <input type="password" value={String(form[key])}
              onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
          </div>
        ))}
        <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
          Password must be at least 8 characters and contain uppercase, lowercase, and numbers.
        </div>
        <Button type="submit" disabled={loading} className="flex items-center gap-2 bg-uipe-navy text-white">
          {loading ? <><Loader2 size={14} className="animate-spin" />Updating...</> : <><Lock size={14} />Change Password</>}
        </Button>
      </form>
    </motion.div>
  );
}