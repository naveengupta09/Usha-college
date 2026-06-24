'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const router = useRouter();

  type ApiError = {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.login({ email, password });
      if (res.data.success) {
        setAuth(res.data.admin, res.data.token);
        toast.success(`Welcome back, ${res.data.admin.name}!`);
        router.push('/admin/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'response' in err && typeof (err as ApiError).response === 'object'
          ? (err as ApiError).response?.data?.message
          : undefined;
      setError(errorMessage || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-uipe-navy via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-uipe-gold/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-br from-uipe-navy to-blue-900 px-8 py-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-uipe-gold/20 border border-uipe-gold/40 flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={32} className="text-uipe-gold" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">UIPE Admin Portal</h1>
            <p className="text-white/60 text-sm mt-1">Sign in to manage your institute</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3.5 text-sm text-red-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-uipe-navy focus:border-transparent transition-all"
                  placeholder="admin@uipe.org.in" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-uipe-navy focus:border-transparent transition-all"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} size="lg"
              className="w-full bg-uipe-navy hover:bg-uipe-navy/90 text-white font-semibold rounded-xl py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-gray-400">
              Protected portal — authorized access only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}