'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, User, X, Upload, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DEPARTMENTS } from '@/data/constants';

type FacultyMember = {
  _id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  email?: string;
  phone?: string;
  bio?: string;
  isActive: boolean;
  isFeatured: boolean;
  image?: { url?: string };
  specialization?: string[];
};

type FacultyFormData = {
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string | number;
  email: string;
  phone: string;
  bio: string;
  isActive: boolean;
  isFeatured: boolean;
  specialization: string;
};

export default function FacultyAdminPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<FacultyMember | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-faculty', deptFilter],
    queryFn: () => adminApi.getFaculty({ department: deptFilter || undefined }),
  });

  const faculty = ((data?.data?.data || []) as FacultyMember[]).filter((f) =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteFaculty(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faculty'] }); toast.success('Faculty deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const handleEdit = (item: FacultyMember) => { setEditItem(item); setShowModal(true); };
  const handleAdd = () => { setEditItem(null); setShowModal(true); };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy w-56"
              placeholder="Search faculty..." />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy bg-white">
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <Button onClick={handleAdd} className="bg-uipe-navy hover:bg-uipe-navy/90 text-white flex items-center gap-2 shrink-0">
          <Plus size={16} /> Add Faculty
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Faculty</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">Department</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">Designation</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">Experience</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-10 bg-gray-100 rounded-lg animate-pulse" /></td></tr>
                ))
              ) : faculty.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">No faculty members found.</td></tr>
              ) : (
                faculty.map((member: FacultyMember) => (
                  <motion.tr key={member._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-uipe-navy/5 shrink-0 flex items-center justify-center">
                          {member.image?.url
                            ? <Image src={member.image.url} alt={member.name} width={36} height={36} className="object-cover w-full h-full" />
                            : <User size={16} className="text-gray-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><span className="text-sm text-gray-600">{member.department}</span></td>
                    <td className="px-4 py-4"><span className="text-sm text-gray-600">{member.designation}</span></td>
                    <td className="px-4 py-4"><span className="text-sm text-gray-600">{member.experience} yrs</span></td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${member.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => handleEdit(member)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-uipe-navy hover:border-uipe-navy transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteMutation.mutate(member._id)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <FacultyModal item={editItem} onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); qc.invalidateQueries({ queryKey: ['admin-faculty'] }); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function FacultyModal({ item, onClose, onSuccess }: { item: FacultyMember | null; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<FacultyFormData>({
    name: item?.name || '', designation: item?.designation || '', department: item?.department || '',
    qualification: item?.qualification || '', experience: item?.experience || '', email: item?.email || '',
    phone: item?.phone || '', bio: item?.bio || '', isActive: item?.isActive ?? true, isFeatured: item?.isFeatured ?? false,
    specialization: item?.specialization?.join(', ') || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (image) fd.append('image', image);
      if (item) await adminApi.updateFaculty(item._id, fd);
      else await adminApi.createFaculty(fd);
      toast.success(item ? 'Faculty updated!' : 'Faculty added!');
      onSuccess();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading font-bold text-uipe-navy text-xl">{item ? 'Edit Faculty' : 'Add Faculty'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'name' as keyof FacultyFormData, required: true },
            { label: 'Designation', key: 'designation' as keyof FacultyFormData, required: true },
            { label: 'Qualification', key: 'qualification' as keyof FacultyFormData, required: true },
            { label: 'Experience (years)', key: 'experience' as keyof FacultyFormData, type: 'number', required: true },
            { label: 'Email', key: 'email' as keyof FacultyFormData, type: 'email' },
            { label: 'Phone', key: 'phone' as keyof FacultyFormData },
            { label: 'Specialization (comma separated)', key: 'specialization' as keyof FacultyFormData, col2: true },
          ].map(({ label, key, type = 'text', required, col2 }: { label: string; key: keyof FacultyFormData; type?: string; required?: boolean; col2?: boolean }) => {
            const stringValue: string = `${form[key]}`;
            return (
            <div key={key} className={col2 ? 'col-span-2' : ''}>
              <label className="text-xs font-medium text-gray-600 mb-1 block">{label}{required && ' *'}</label>
              <input type={type} value={stringValue} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                required={required}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
            </div>
            );
          })}

          {/* Department */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Department *</label>
            <select value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy bg-white">
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Profile Photo</label>
            <label className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-uipe-navy transition-colors">
              <Upload size={14} className="text-gray-400" />
              <span className="text-gray-400">{image ? image.name : 'Upload photo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Bio */}
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy resize-none" />
          </div>

          {/* Toggles */}
          <div className="col-span-2 flex gap-6">
            {[{ label: 'Active', key: 'isActive' as keyof FacultyFormData }, { label: 'Featured', key: 'isFeatured' as keyof FacultyFormData }].map(({ label, key }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key] as boolean} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.checked }))}
                  className="w-4 h-4 accent-uipe-navy rounded" />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>

          <div className="col-span-2 flex gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-uipe-navy text-white">
              {loading ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : (item ? 'Update Faculty' : 'Add Faculty')}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}