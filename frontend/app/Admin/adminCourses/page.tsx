'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, BookOpen, Users, IndianRupee, X, Upload, Loader2, Star } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DEPARTMENTS, COURSE_CATEGORIES } from '@/data/constants';

type Course = {
  _id: string;
  name: string;
  code: string;
  category: string;
  department: string;
  duration: string;
  totalSeats: number;
  eligibility: string;
  description: string;
  fees?: { admission: number; annual: number; examination: number };
  highlights?: string[];
  isActive: boolean;
  isFeatured: boolean;
  image?: { url?: string };
};

type FormData = {
  name: string;
  code: string;
  category: string;
  department: string;
  duration: string;
  totalSeats: string | number;
  eligibility: string;
  description: string;
  fees_admission: string | number;
  fees_annual: string | number;
  fees_examination: string | number;
  highlights: string;
  isActive: boolean;
  isFeatured: boolean;
};

type InputFieldProps = {
  label: string;
  k: keyof FormData;
  type?: string;
  required?: boolean;
  col2?: boolean;
  placeholder?: string;
};

type FComponentProps = InputFieldProps & {
  placeholder?: string;
  form: FormData;
  setForm: (fn: (f: FormData) => FormData) => void;
};

const catColor: Record<string, string> = {
  undergraduate: 'bg-blue-50 text-blue-700', postgraduate: 'bg-purple-50 text-purple-700',
  diploma: 'bg-emerald-50 text-emerald-700', certificate: 'bg-orange-50 text-orange-700', vocational: 'bg-rose-50 text-rose-700',
};

// Inline wrapper that properly handles mixed-type values
const makeInputValue = (val: string | number | boolean): string => String(val);

const F = ({ label, k, type = 'text', required = false, col2 = false, placeholder, form, setForm }: FComponentProps): React.ReactElement => {
  const inputType: React.InputHTMLAttributes<HTMLInputElement>['type'] = type as React.InputHTMLAttributes<HTMLInputElement>['type'];
  return (
    <div className={col2 ? 'col-span-2' : ''}>
      <label className="text-xs font-medium text-gray-600 mb-1 block">{label}{required && ' *'}</label>
      <input type={inputType} value={makeInputValue(form[k])} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} required={required} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
    </div>
  );
};

export default function AdminCoursesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Course | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => adminApi.getCourses(),
  });

  const courses = (data?.data?.data || []) as Course[];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCourse(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-courses'] }); toast.success('Course deleted'); },
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => { setEditItem(null); setShowModal(true); }} className="bg-uipe-navy text-white flex items-center gap-2">
          <Plus size={16} /> Add Course
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />)
          : courses.map((course: Course) => (
              <motion.div key={course._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-uipe-navy/5 flex items-center justify-center">
                    <BookOpen size={18} className="text-uipe-navy" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {course.isFeatured && <Star size={13} className="text-uipe-gold fill-uipe-gold" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor[course.category] || 'bg-gray-100 text-gray-600'}`}>
                      {course.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-heading font-bold text-uipe-navy mb-0.5">{course.name}</h3>
                <p className="text-xs text-uipe-gold font-semibold mb-2">Code: {course.code}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Users size={11} />{course.totalSeats} Seats</span>
                  <span className="flex items-center gap-1"><IndianRupee size={11} />
                    {course.fees?.annual?.toLocaleString('en-IN')}/yr
                  </span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-50">
                  <button onClick={() => { setEditItem(course); setShowModal(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-500 hover:border-uipe-navy hover:text-uipe-navy transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => deleteMutation.mutate(course._id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium border border-gray-200 rounded-lg text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <CourseModal item={editItem} onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); qc.invalidateQueries({ queryKey: ['admin-courses'] }); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseModal({ item, onClose, onSuccess }: { item: Course | null; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<FormData>({
    name: item?.name || '', code: item?.code || '', category: item?.category || 'undergraduate',
    department: item?.department || '', duration: item?.duration || '', totalSeats: item?.totalSeats || '',
    eligibility: item?.eligibility || '', description: item?.description || '',
    fees_admission: item?.fees?.admission || '', fees_annual: item?.fees?.annual || '', fees_examination: item?.fees?.examination || '',
    highlights: item?.highlights?.join('\n') || '', isActive: item?.isActive ?? true, isFeatured: item?.isFeatured ?? false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name); fd.append('code', form.code);
      fd.append('category', form.category); fd.append('department', form.department);
      fd.append('duration', form.duration); fd.append('totalSeats', form.totalSeats.toString());
      fd.append('eligibility', form.eligibility); fd.append('description', form.description);
      fd.append('fees', JSON.stringify({ admission: +form.fees_admission, annual: +form.fees_annual, examination: +form.fees_examination }));
      fd.append('highlights', JSON.stringify(form.highlights.split('\n').filter(Boolean)));
      fd.append('isActive', form.isActive.toString()); fd.append('isFeatured', form.isFeatured.toString());
      if (image) fd.append('image', image);
      if (item) await adminApi.updateCourse(item._id, fd);
      else await adminApi.createCourse(fd);
      toast.success(item ? 'Course updated!' : 'Course added!');
      onSuccess();
    } catch (err: unknown) { 
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Failed'); 
    }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading font-bold text-uipe-navy text-xl">{item ? 'Edit Course' : 'Add Course'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          <F label="Course Name" k="name" required col2 form={form} setForm={setForm} />
          <F label="Course Code" k="code" required form={form} setForm={setForm} />
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Category *</label>
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy bg-white">
              {COURSE_CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Department *</label>
            <select value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy bg-white">
              <option value="">Select</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <F label="Duration" k="duration" required placeholder="e.g. 3 Years" form={form} setForm={setForm} />
          <F label="Total Seats" k="totalSeats" type="number" required form={form} setForm={setForm} />
          <F label="Eligibility" k="eligibility" required col2 form={form} setForm={setForm} />
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy resize-none" />
          </div>
          <div className="col-span-2 grid grid-cols-3 gap-3">
            {[['Admission Fee', 'fees_admission' as keyof FormData], ['Annual Fee', 'fees_annual' as keyof FormData], ['Exam Fee', 'fees_examination' as keyof FormData]].map(([l, k]) => (
              <div key={k}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{l} (₹)</label>
                <input type="number" value={makeInputValue(form[k])} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy" />
              </div>
            ))}
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Highlights (one per line)</label>
            <textarea value={form.highlights} onChange={(e) => setForm(f => ({ ...f, highlights: e.target.value }))} rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uipe-navy resize-none"
              placeholder="Accounting&#10;Business Law&#10;Taxation" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Course Image</label>
            <label className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-uipe-navy transition-colors">
              <Upload size={14} className="text-gray-400" />
              <span className="text-gray-400 text-sm">{image ? image.name : 'Upload image'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </label>
          </div>
          <div className="flex gap-4 items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive as boolean} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-uipe-navy rounded" />
              <span className="text-sm text-gray-600">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured as boolean} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                className="w-4 h-4 accent-uipe-navy rounded" />
              <span className="text-sm text-gray-600">Featured</span>
            </label>
          </div>
          <div className="col-span-2 flex gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-uipe-navy text-white">
              {loading ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : (item ? 'Update Course' : 'Add Course')}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}