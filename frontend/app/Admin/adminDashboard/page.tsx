'use client';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { BarChart3, Users, BookOpen, MessageSquare } from 'lucide-react';

export default function AdminDashboardPage() {
  const { admin } = useAuthStore();

  const stats = [
    { label: 'Total Courses', value: '12', icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Faculty', value: '8', icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Students', value: '254', icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Messages', value: '24', icon: MessageSquare, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-uipe-navy">Welcome, {admin?.name || 'Admin'}!</h1>
        <p className="text-gray-600 mt-2">Here&apos;s your dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-heading font-bold text-uipe-navy mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-uipe-navy" size={24} />
          <h2 className="text-xl font-heading font-bold text-uipe-navy">Quick Stats</h2>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <p>✓ All systems operational</p>
          <p>✓ Database connected</p>
          <p>✓ API services active</p>
        </div>
      </motion.div>
    </motion.div>
  );
}