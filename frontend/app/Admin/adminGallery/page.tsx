'use client';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, Trash2, Star, Grid3X3, List, Loader2, CheckSquare } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GALLERY_CATEGORIES } from '@/data/constants';

export default function AdminGalleryPage() {
  const [category, setCategory] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery', category],
    queryFn: () => adminApi.getGallery({ category: category || undefined, limit: 50 }),
  });

  const images = data?.data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteGallery(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); toast.success('Deleted'); },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => adminApi.bulkDeleteGallery(ids),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); setSelected([]); toast.success(`${selected.length} images deleted`); },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      fd.append('category', category || 'campus');
      fd.append('title', 'Gallery Image');
      await adminApi.uploadGallery(fd);
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success(`${files.length} image(s) uploaded!`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  return (
    <div className="space-y-5">
      {/* Top Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!category ? 'bg-uipe-navy text-white border-uipe-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-uipe-navy'}`}>
            All
          </button>
          {GALLERY_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all ${category === c ? 'bg-uipe-navy text-white border-uipe-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-uipe-navy'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <Button onClick={() => bulkDeleteMutation.mutate(selected)} size="sm" variant="destructive" className="flex items-center gap-1.5">
              <Trash2 size={13} /> Delete {selected.length}
            </Button>
          )}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-uipe-navy text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Grid3X3 size={15} /></button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-uipe-navy text-white' : 'text-gray-400 hover:bg-gray-50'}`}><List size={15} /></button>
          </div>
          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-uipe-gold text-white hover:bg-uipe-gold/90'}`}>
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Uploading...' : 'Upload Photos'}
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Upload drop zone when empty */}
      {!isLoading && images.length === 0 && (
        <label className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-gray-200 hover:border-uipe-navy cursor-pointer transition-colors bg-gray-50">
          <Upload size={36} className="text-gray-300 mb-3" />
          <p className="text-gray-400 font-medium">Upload your first images</p>
          <p className="text-gray-300 text-sm mt-1">Click or drag images here</p>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
      )}

      {/* Grid View */}
      {view === 'grid' && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {images.map((img: { _id: string; title?: string; category?: string; image?: { url?: string }; isFeatured?: boolean }) => (
            <motion.div key={img._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={`relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer ring-2 transition-all ${selected.includes(img._id) ? 'ring-uipe-gold' : 'ring-transparent hover:ring-uipe-navy/30'}`}
              onClick={() => toggleSelect(img._id)}>
              {img.image?.url && (
                <Image src={img.image.url} alt={img.title} fill className="object-cover" />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(img._id); }}
                  className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600">
                  <Trash2 size={13} />
                </button>
              </div>
              {/* Selected indicator */}
              {selected.includes(img._id) && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-uipe-gold flex items-center justify-center">
                  <CheckSquare size={11} className="text-white" />
                </div>
              )}
              {img.isFeatured && (
                <div className="absolute top-2 left-2"><Star size={13} className="text-uipe-gold fill-uipe-gold" /></div>
              )}
              {/* Category badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-xs truncate">{img.title}</p>
                <span className="text-white/60 text-xs capitalize">{img.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && images.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Image</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Category</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Featured</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {images.map((img: { _id: string; title?: string; category?: string; image?: { url?: string }; isFeatured?: boolean }) => (
                <tr key={img._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {img.image?.url && <Image src={img.image.url} alt={img.title} width={48} height={48} className="object-cover w-full h-full" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{img.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{img.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    {img.isFeatured ? <Star size={15} className="text-uipe-gold fill-uipe-gold" /> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => deleteMutation.mutate(img._id)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}