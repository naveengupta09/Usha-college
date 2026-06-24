'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Bell, X, Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { adminApi, publicApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const typeColors: Record<string, string> = {
  general: 'bg-gray-100 text-gray-700',
  urgent: 'bg-red-50 text-red-700',
  admission: 'bg-blue-50 text-blue-700',
  result: 'bg-emerald-50 text-emerald-700',
  event: 'bg-purple-50 text-purple-700',
};

export default function AdminNoticesPage() {
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['home-content'],
    queryFn: () => publicApi.getHome(),
  });

  const notices = data?.data?.data?.notices || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteNotice(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['home-content'] }); toast.success('Notice deleted'); },
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)} className="bg-uipe-navy text-white flex items-center gap-2">
          <Plus size={16} /> Add Notice
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-5 border-b border-gray-50 animate-pulse h-16" />)
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bell size={36} className="mb-3 opacity-30" />
            <p className="text-sm">No notices yet. Add your first notice.</p>
          </div>
        ) : notices.map((notice: { _id: string; title?: string; content?: string; createdAt?: string }, i: number) => (
          <motion.div key={notice._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
            <div className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 mt-0.5 ${typeColors[notice.type] || typeColors.general}`}>
              {notice.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{notice.title}</p>
              {notice.content && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notice.content}</p>}
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {notice.createdAt ? format(new Date(notice.createdAt), 'dd MMM yyyy') : 'Recent'}
                </span>
                {notice.expiresAt && <span>Expires: {format(new Date(notice.expiresAt), 'dd MMM')}</span>}
                <span className={notice.isActive ? 'text-emerald-500' : 'text-gray-400'}>
                  {notice.isActive ? '● Active' : '○ Inactive'}
                </span>
              </div>
            </div>
            <button onClick={() => deleteMutation.mutate(notice._id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0">
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <NoticeModal onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); qc.invalidateQueries({ queryKey: ['home-content'] }); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NoticeModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', content: '', type: 'general', isActive: true, expiresAt: '', link: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.addNotice(form);
      toast.success('Notice added!');
      onSuccess();
    } catch {
      toast.error('Failed to add notice');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-bold text-uipe-navy">Add Notice</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Title *</label>
            <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Type</label>
            <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy bg-white">
              {['general', 'urgent', 'admission', 'result', 'event'].map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Content</label>
            <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Link (optional)</label>
            <input value={form.link} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Expires At (optional)</label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-uipe-navy" />
            <span className="text-sm text-gray-600">Active / Visible</span>
          </label>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-uipe-navy text-white">
              {loading ? <><Loader2 size={14} className="animate-spin mr-2" />Adding...</> : 'Add Notice'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}