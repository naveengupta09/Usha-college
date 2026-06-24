'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Search, Eye, CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, X } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ADMISSION_STATUSES } from '@/data/constants';

type StatusConfig = { color: string; icon: React.ComponentType<{ size?: number; className?: string }> | React.ComponentType; label: string };
const statusConfig: Record<string, StatusConfig> = {
  pending:      { color: 'bg-yellow-50 text-yellow-700 border-yellow-100', icon: Clock, label: 'Pending' },
  under_review: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: AlertCircle, label: 'Under Review' },
  approved:     { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle, label: 'Approved' },
  rejected:     { color: 'bg-red-50 text-red-700 border-red-100', icon: XCircle, label: 'Rejected' },
  waitlisted:   { color: 'bg-purple-50 text-purple-700 border-purple-100', icon: AlertCircle, label: 'Waitlisted' },
  enrolled:     { color: 'bg-teal-50 text-teal-700 border-teal-100', icon: CheckCircle, label: 'Enrolled' },
};

export default function AdminAdmissionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState<{ _id: string; name?: string; email?: string; status?: string } | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-admissions', statusFilter, search, page],
    queryFn: () => adminApi.getAdmissions({ status: statusFilter || undefined, search: search || undefined, page, limit: 15 }),
  });

  const admissions = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const pages = data?.data?.pages || 1;

  const updateStatus = useMutation({
    mutationFn: ({ id, status, adminRemarks }: { id: string; status: string; adminRemarks?: string }) =>
      adminApi.updateAdmissionStatus(id, { status, adminRemarks }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-admissions'] }); toast.success('Status updated!'); },
    onError: () => toast.error('Failed to update status'),
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {['pending','under_review','approved','rejected','waitlisted','enrolled'].map((s) => {
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          const count = admissions.filter((a: { status: string }) => a.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
              className={`p-3 rounded-xl border text-left transition-all ${statusFilter === s ? cfg.color + ' shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
              <Icon size={15} className="mb-1 opacity-70" />
              <p className="text-lg font-bold">{count || '—'}</p>
              <p className="text-xs capitalize">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy"
            placeholder="Search by name, application no, email..." />
        </div>
        {statusFilter && (
          <button onClick={() => setStatusFilter('')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-uipe-navy/5 text-uipe-navy border border-uipe-navy/10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
            <X size={13} /> Clear filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{total} Applications</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['App. No.', 'Applicant', 'Course', 'Status', 'Applied On', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : admissions.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 text-sm py-12">No applications found.</td></tr>
              ) : admissions.map((a: { _id: string; name?: string; email?: string; status?: string; createdAt?: string }) => {
                const cfg = statusConfig[a.status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <tr key={a._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-uipe-navy font-semibold">{a.applicationNumber}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-800">{a.firstName} {a.lastName}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-600">{a.courseApplied?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{a.academicYear}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-400">{format(new Date(a.createdAt), 'dd MMM yyyy')}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewItem(a)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-uipe-navy hover:border-uipe-navy transition-colors">
                          <Eye size={13} />
                        </button>
                        <StatusDropdown current={a.status} onSelect={(s) => updateStatus.mutate({ id: a._id, status: s })} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === pages}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewItem && <AdmissionViewModal item={viewItem} onClose={() => setViewItem(null)} />}
      </AnimatePresence>
    </div>
  );
}

function StatusDropdown({ current, onSelect }: { current: string; onSelect: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
        Status <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
          {ADMISSION_STATUSES.map((s) => (
            <button key={s} onClick={() => { onSelect(s); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-50 ${current === s ? 'font-semibold text-uipe-navy' : 'text-gray-600'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AdmissionViewModal({ item, onClose }: { item: { _id: string; name?: string; email?: string; status?: string; phone?: string; message?: string } | null; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-uipe-navy">Application Details</h2>
            <p className="text-xs text-uipe-gold font-mono">{item.applicationNumber}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-5">
          <Section title="Personal Information">
            <Grid>
              <Field label="Full Name" value={`${item.firstName} ${item.lastName}`} />
              <Field label="Gender" value={item.gender} />
              <Field label="Date of Birth" value={item.dateOfBirth ? format(new Date(item.dateOfBirth), 'dd MMM yyyy') : '—'} />
              <Field label="Category" value={item.category?.toUpperCase()} />
            </Grid>
          </Section>
          <Section title="Contact Information">
            <Grid>
              <Field label="Email" value={item.email} />
              <Field label="Phone" value={item.phone} />
              <Field label="Address" value={`${item.address?.city || ''}, ${item.address?.district || ''}, ${item.address?.state || ''} - ${item.address?.pincode || ''}`} />
            </Grid>
          </Section>
          <Section title="Academic Information">
            <Grid>
              <Field label="Course Applied" value={item.courseApplied?.name || '—'} />
              <Field label="Academic Year" value={item.academicYear} />
            </Grid>
          </Section>
          <Section title="Application Status">
            <Grid>
              <Field label="Status" value={item.status?.replace('_', ' ')} />
              <Field label="Applied On" value={item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : '—'} />
              {item.adminRemarks && <Field label="Admin Remarks" value={item.adminRemarks} full />}
            </Grid>
          </Section>
        </div>
      </motion.div>
    </motion.div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">{title}</h3>
    {children}
  </div>
);
const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-2 gap-3">{children}</div>;
const Field = ({ label, value, full }: { label: string; value: string; full?: boolean }) => (
  <div className={full ? 'col-span-2' : ''}>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-800 capitalize">{value || '—'}</p>
  </div>
);