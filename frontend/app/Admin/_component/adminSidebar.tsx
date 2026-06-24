'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Image, FileText, MessageSquare,
  Bell, Settings, LogOut, GraduationCap, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Faculty', href: '/admin/faculty', icon: Users },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Admissions', href: '/admin/admissions', icon: FileText },
  { label: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
  { label: 'Notices', href: '/admin/notices', icon: Bell },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 h-full bg-uipe-navy flex flex-col shadow-2xl shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-uipe-gold/20 border border-uipe-gold/40 flex items-center justify-center">
            <GraduationCap size={20} className="text-uipe-gold" />
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm">UIPE Admin</p>
            <p className="text-white/40 text-xs">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-uipe-gold/20 flex items-center justify-center text-uipe-gold font-bold text-sm">
            {admin?.name?.[0] || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
            <p className="text-white/40 text-xs capitalize">{admin?.role || 'admin'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}>
              <Icon size={17} className={isActive ? 'text-uipe-gold' : 'group-hover:text-uipe-gold/80 transition-colors'} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={13} className="text-uipe-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-red-500/20 transition-all group">
          <LogOut size={17} className="group-hover:text-red-400 transition-colors" />
          <span>Logout</span>
        </button>
        <p className="text-center text-white/20 text-xs mt-3">UIPE v1.0.0</p>
      </div>
    </aside>
  );
}