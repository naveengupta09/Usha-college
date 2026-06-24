'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Clock, Users, ChevronRight, ArrowRight } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

type Course = {
  _id?: string;
  category: string;
  name: string;
  code: string;
  description: string;
  duration: string;
  totalSeats: number;
  fees?: { annual: number };
};

const categoryColor: Record<string, string> = {
  undergraduate: 'bg-blue-100 text-blue-700',
  postgraduate: 'bg-purple-100 text-purple-700',
  diploma: 'bg-emerald-100 text-emerald-700',
  certificate: 'bg-orange-100 text-orange-700',
};

export default function CoursesSection() {
  const { data } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => publicApi.getCourses({ featured: true }),
  });

  const courses: Course[] = data?.data?.data || [];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-uipe-gold font-semibold text-sm tracking-widest uppercase mb-3">
            Academic Programs
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-bold text-uipe-navy mb-4">
            Courses We Offer
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-lg">
            Discover our wide range of undergraduate, postgraduate, and diploma programs designed to shape your career.
          </motion.p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {(courses.length > 0 ? courses : PLACEHOLDER_COURSES).map((course: Course, i: number) => (
            <motion.div key={course._id || i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/courses/${course._id || '#'}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-uipe-navy/20 transition-all duration-300 card-hover">
                {/* Card Header */}
                <div className="h-2 bg-linear-to-r from-uipe-navy to-uipe-sky" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-uipe-navy/5 border border-uipe-navy/10 flex items-center justify-center group-hover:bg-uipe-navy group-hover:border-uipe-navy transition-all">
                      <BookOpen size={22} className="text-uipe-navy group-hover:text-white transition-colors" />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor[course.category] || 'bg-gray-100 text-gray-600'}`}>
                      {course.category}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-uipe-navy text-lg mb-1 group-hover:text-uipe-sky transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs text-uipe-gold font-medium mb-3">Code: {course.code}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {course.totalSeats} Seats</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <p className="text-uipe-navy font-bold">
                      ₹{course.fees?.annual?.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-400">/year</span>
                    </p>
                    <span className="flex items-center gap-1 text-xs font-semibold text-uipe-sky group-hover:gap-2 transition-all">
                      Details <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-uipe-navy text-uipe-navy hover:bg-uipe-navy hover:text-white group">
            <Link href="/courses" className="flex items-center gap-2">
              View All Programs
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const PLACEHOLDER_COURSES = [
  { name: 'Bachelor of Arts', code: 'BA', category: 'undergraduate', duration: '3 Years', totalSeats: 120, description: 'A comprehensive undergraduate program covering humanities and social sciences.', fees: { annual: 8000 } },
  { name: 'Bachelor of Science', code: 'BSC', category: 'undergraduate', duration: '3 Years', totalSeats: 80, description: 'Rigorous undergraduate science program with laboratory training.', fees: { annual: 10000 } },
  { name: 'Bachelor of Commerce', code: 'BCOM', category: 'undergraduate', duration: '3 Years', totalSeats: 100, description: 'Industry-oriented commerce program with practical exposure.', fees: { annual: 9000 } },
  { name: 'Master of Arts', code: 'MA', category: 'postgraduate', duration: '2 Years', totalSeats: 60, description: 'Advanced postgraduate program in Arts and Humanities.', fees: { annual: 10000 } },
  { name: 'BCA', code: 'BCA', category: 'undergraduate', duration: '3 Years', totalSeats: 60, description: 'Technology-focused program preparing students for the IT industry.', fees: { annual: 15000 } },
  { name: 'Diploma in Computer Science', code: 'DCS', category: 'diploma', duration: '1 Year', totalSeats: 40, description: 'Practical computer science diploma for skill development.', fees: { annual: 8000 } },
];