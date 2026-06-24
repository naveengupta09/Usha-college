import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '@/lib/api';
import { toast } from 'sonner';

// ─── Public Hooks ──────────────────────────────────────────────────────────

export const useHome = () =>
  useQuery({ queryKey: ['home'], queryFn: () => publicApi.getHome(), staleTime: 5 * 60 * 1000 });

export const useAbout = () =>
  useQuery({ queryKey: ['about'], queryFn: () => publicApi.getAbout(), staleTime: 10 * 60 * 1000 });

export const useCourses = (params?: Record<string, any>) =>
  useQuery({ queryKey: ['courses', params], queryFn: () => publicApi.getCourses(params), staleTime: 5 * 60 * 1000 });

export const useCourse = (id: string) =>
  useQuery({ queryKey: ['course', id], queryFn: () => publicApi.getCourse(id), enabled: !!id });

export const useFaculty = (params?: Record<string, any>) =>
  useQuery({ queryKey: ['faculty', params], queryFn: () => publicApi.getFaculty(params), staleTime: 5 * 60 * 1000 });

export const useGallery = (params?: Record<string, any>) =>
  useQuery({ queryKey: ['gallery', params], queryFn: () => publicApi.getGallery(params), staleTime: 5 * 60 * 1000 });

// ─── Admin Hooks ───────────────────────────────────────────────────────────

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => adminApi.getDashboardStats(),
    refetchInterval: 30 * 1000,
  });

export const useAdminFaculty = (params?: Record<string, any>) =>
  useQuery({ queryKey: ['admin-faculty', params], queryFn: () => adminApi.getFaculty(params) });

export const useAdminCourses = () =>
  useQuery({ queryKey: ['admin-courses'], queryFn: () => adminApi.getCourses() });

export const useAdminGallery = (params?: Record<string, any>) =>
  useQuery({ queryKey: ['admin-gallery', params], queryFn: () => adminApi.getGallery(params) });

export const useAdminAdmissions = (params?: Record<string, any>) =>
  useQuery({ queryKey: ['admin-admissions', params], queryFn: () => adminApi.getAdmissions(params) });

export const useAdminContacts = (params?: Record<string, any>) =>
  useQuery({ queryKey: ['admin-contacts', params], queryFn: () => adminApi.getContacts(params) });

// ─── Mutation Hooks ────────────────────────────────────────────────────────

export const useDeleteFaculty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteFaculty(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faculty'] }); toast.success('Faculty deleted'); },
    onError: () => toast.error('Failed to delete faculty'),
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCourse(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-courses'] }); toast.success('Course deleted'); },
    onError: () => toast.error('Failed to delete course'),
  });
};

export const useUpdateAdmissionStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, adminRemarks }: { id: string; status: string; adminRemarks?: string }) =>
      adminApi.updateAdmissionStatus(id, { status, adminRemarks }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-admissions'] }); toast.success('Status updated'); },
    onError: () => toast.error('Failed to update status'),
  });
};

export const useSubmitContact = () =>
  useMutation({
    mutationFn: (data: Record<string, any>) => publicApi.submitContact(data),
    onSuccess: () => toast.success('Message sent! We\'ll get back to you soon.'),
    onError: () => toast.error('Failed to send message. Please try again.'),
  });

export const useSubmitAdmission = () =>
  useMutation({
    mutationFn: (data: Record<string, any>) => publicApi.submitAdmission(data),
    onError: (err: any) => toast.error(err.response?.data?.message || 'Submission failed'),
  });