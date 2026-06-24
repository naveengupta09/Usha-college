'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function AdminIndex() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    router.replace(isAuthenticated ? '/admin/dashboard' : '/admin/login');
  }, [isAuthenticated, router]);
  return null;
}