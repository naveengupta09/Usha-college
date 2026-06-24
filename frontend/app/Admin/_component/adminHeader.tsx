'use client';
import { Bell, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BREADCRUMB: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/faculty': 'Faculty Management',
  '/admin/courses': 'Course Management',
  '/admin/gallery': 'Gallery',
  '/admin/admissions': 'Admissions',
  '/admin/contacts': 'Contacts',
  '/admin/notices': 'Notices',
  '/admin/settings': 'Settings',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = BREADCRUMB[pathname] || 'Admin Panel';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
      <div>
        <h1 className="font-heading font-bold text-uipe-navy text-xl">{title}</h1>
        <p className="text-gray-400 text-xs">UIPE Management Portal</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Search size={15} className="text-gray-400" />
          <input className="bg-transparent text-sm outline-none w-40 placeholder:text-gray-400" placeholder="Search..." />
        </div>

        {/* Visit Site */}
        <Link href="/" target="_blank"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-uipe-navy border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
          <ExternalLink size={13} />
          <span className="hidden md:block">View Site</span>
        </Link>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}