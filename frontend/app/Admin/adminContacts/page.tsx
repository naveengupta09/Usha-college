'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2, Mail, Phone, X, CheckCircle, MessageSquare } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

const STATUS_TABS = ['all', 'new', 'read', 'replied', 'archived'];
const statusColor: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-emerald-50 text-emerald-700',
  archived: 'bg-orange-50 text-orange-700',
};

export default function AdminContactsPage() {
  const [tab, setTab] = useState('all');
  const [viewItem, setViewItem] = useState<{ _id: string; name?: string; email?: string; phone?: string; message?: string; status?: string } | null>(null);
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', tab, page],
    queryFn: () => adminApi.getContacts({ status: tab === 'all' ? undefined : tab, page, limit: 20 }),
  });

  const contacts = data?.data?.data || [];
  const total = data?.data?.total || 0;

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateContact(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-contacts'] }); toast.success('Updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteContact(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-contacts'] }); toast.success('Deleted'); },
  });

  const handleView = async (contact: { _id: string; status?: string }) => {
    setViewItem(contact);
    if (contact.status === 'new') updateMutation.mutate({ id: contact._id, status: 'read' });
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border whitespace-nowrap transition-all ${tab === t ? 'bg-uipe-navy text-white border-uipe-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-uipe-navy/40'}`}>
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center shrink-0">{total} messages</span>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border-b border-gray-50 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <MessageSquare size={36} className="mb-3 opacity-30" />
            <p className="text-sm">No messages found</p>
          </div>
        ) : (
          contacts.map((c: { _id: string; name?: string; email?: string; phone?: string; message?: string; status?: string; createdAt?: string }) => (
            <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`flex items-start gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors ${c.status === 'new' ? 'bg-blue-50/30' : ''}`}
              onClick={() => handleView(c)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${c.status === 'new' ? 'bg-uipe-navy text-white' : 'bg-gray-100 text-gray-500'}`}>
                {c.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-0.5">
                  <p className={`text-sm font-medium ${c.status === 'new' ? 'text-uipe-navy' : 'text-gray-700'}`}>{c.name}</p>
                  {c.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                  <span className="ml-auto text-xs text-gray-400 shrink-0">
                    {format(new Date(c.createdAt), 'dd MMM, h:mm a')}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 truncate">{c.subject}</p>
                <p className="text-xs text-gray-400 truncate">{c.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] || 'bg-gray-100 text-gray-500'}`}>
                  {c.status}
                </span>
                <button onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(c._id); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setViewItem(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-heading font-bold text-uipe-navy">Message Details</h2>
                <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-uipe-navy text-white flex items-center justify-center font-bold text-lg">
                    {viewItem.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{viewItem.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1"><Mail size={11} />{viewItem.email}</span>
                      {viewItem.phone && <span className="flex items-center gap-1"><Phone size={11} />{viewItem.phone}</span>}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Subject</p>
                  <p className="font-semibold text-gray-800">{viewItem.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{viewItem.message}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <a href={`mailto:${viewItem.email}?subject=Re: ${viewItem.subject}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-uipe-navy text-white text-sm font-medium hover:bg-uipe-navy/90 transition-colors">
                    <Mail size={14} /> Reply via Email
                  </a>
                  <button onClick={() => { updateMutation.mutate({ id: viewItem._id, status: 'replied' }); setViewItem(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition-colors">
                    <CheckCircle size={14} /> Mark Replied
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}