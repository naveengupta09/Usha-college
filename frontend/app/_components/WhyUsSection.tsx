'use client';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, Briefcase, IndianRupee, BookOpen, Star, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WHY_US = [
  { icon: GraduationCap, title: 'Expert Faculty', desc: 'Learn from experienced professors with proven academic and industry expertise.', color: 'bg-blue-500' },
  { icon: Building2, title: 'Modern Infrastructure', desc: 'State-of-the-art labs, library, and smart classrooms for enhanced learning.', color: 'bg-emerald-500' },
  { icon: Briefcase, title: 'Placement Support', desc: 'Dedicated placement cell with industry connections for career opportunities.', color: 'bg-purple-500' },
  { icon: IndianRupee, title: 'Affordable Fees', desc: 'Quality education at transparent and affordable fee structure.', color: 'bg-orange-500' },
  { icon: BookOpen, title: 'Rich Library', desc: 'Extensive collection of books, journals, and digital resources.', color: 'bg-cyan-500' },
  { icon: Star, title: 'NAAC Accreditation', desc: 'Recognized institution affiliated with B.R.A Bihar University, Muzaffarpur.', color: 'bg-rose-500' },
];

const SAMPLE_NOTICES = [
  { title: 'Admission Open 2024-25', type: 'admission', date: 'Oct 2024' },
  { title: 'University Exam Schedule Released', type: 'result', date: 'Sep 2024' },
  { title: 'Annual Cultural Fest - Utsav 2024', type: 'event', date: 'Nov 2024' },
  { title: 'Scholarship Applications Invited', type: 'general', date: 'Sep 2024' },
  { title: 'New BCA Batch Commencing', type: 'general', date: 'Aug 2024' },
];

const typeColor: Record<string, string> = {
  admission: 'bg-blue-100 text-blue-700',
  result: 'bg-emerald-100 text-emerald-700',
  event: 'bg-purple-100 text-purple-700',
  urgent: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-600',
};

export default function WhyUsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-14">
          {/* Why Us - 2 cols */}
          <div className="lg:col-span-2">
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-block text-uipe-gold font-semibold text-sm tracking-widest uppercase mb-3">
              Why Choose UIPE
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-heading text-4xl font-bold text-uipe-navy mb-10">
              Your Success is Our<br />
              <span className="text-gradient">Top Priority</span>
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {WHY_US.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group flex gap-4 p-5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-default">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0 text-white group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-uipe-navy mb-1">{title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Notices - 1 col */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-uipe-gold" />
                <h3 className="font-heading font-bold text-uipe-navy text-xl">Notices</h3>
              </div>
              <Link href="/notices" className="text-xs text-uipe-sky hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {SAMPLE_NOTICES.map((notice, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group p-4 rounded-xl border border-gray-100 hover:border-uipe-navy/20 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[notice.type]}`}>
                      {notice.type}
                    </span>
                    <span className="text-xs text-gray-400">{notice.date}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-uipe-navy transition-colors leading-snug">
                    {notice.title}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Card */}
            <div className="mt-6 p-6 rounded-2xl bg-linear-to-br from-uipe-navy to-blue-900 text-white">
              <h4 className="font-heading font-bold text-xl mb-2">Ready to Join?</h4>
              <p className="text-white/70 text-sm mb-4">Apply for admission to the 2024-25 academic year before the deadline.</p>
              <Link href="/admission"
                className="flex items-center justify-center gap-2 bg-uipe-gold hover:bg-uipe-gold/90 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors">
                Apply Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}