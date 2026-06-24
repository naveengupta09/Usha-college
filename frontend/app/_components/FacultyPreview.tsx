'use client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, User } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

type FacultyMember = {
  _id?: string;
  name: string;
  designation: string;
  department: string;
  experience: number;
  qualification?: string;
  email?: string;
  image?: {
    url?: string;
  };
};

export default function FacultyPreview() {
  const { data } = useQuery({
    queryKey: ['faculty-featured'],
    queryFn: () => publicApi.getFaculty({ featured: true, limit: 4 }),
  });

  const faculty = data?.data?.data || PLACEHOLDER_FACULTY;

  return (
    <section className="section-padding" style={{ background: 'linear-gradient(135deg, #0D1B4B 0%, #1a2f6e 100%)' }}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-block text-uipe-gold font-semibold text-sm tracking-widest uppercase mb-3">
              Our Team
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl font-bold text-white">
              Meet Our Faculty
            </motion.h2>
          </div>
          <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 self-start md:self-auto">
            <Link href="/faculty" className="flex items-center gap-2">
              View All Faculty <ArrowRight size={15} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.map((member: FacultyMember, i: number) => (
            <motion.div key={member._id || i}
              initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group glass-card rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
              {/* Photo */}
              <div className="relative h-56 bg-white/5 flex items-center justify-center overflow-hidden">
                {member.image?.url ? (
                  <Image src={member.image.url} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-uipe-gold/20 border border-uipe-gold/40 flex items-center justify-center">
                    <User size={36} className="text-uipe-gold" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-uipe-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-white text-lg mb-0.5">{member.name}</h3>
                <p className="text-uipe-gold text-sm font-medium mb-1">{member.designation}</p>
                <p className="text-white/50 text-xs mb-3">{member.department}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs">{member.experience}+ Years Exp.</span>
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-white/40 hover:text-uipe-gold transition-colors">
                      <Mail size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLACEHOLDER_FACULTY = [
  { name: 'Dr. Amit Kumar', designation: 'Associate Professor', department: 'Arts', experience: 15, qualification: 'Ph.D.' },
  { name: 'Prof. Sunita Devi', designation: 'Assistant Professor', department: 'Science', experience: 10, qualification: 'M.Sc.' },
  { name: 'Dr. Ravi Shankar', designation: 'Professor', department: 'Commerce', experience: 20, qualification: 'Ph.D.' },
  { name: 'Ms. Priya Singh', designation: 'Assistant Professor', department: 'Computer Science', experience: 7, qualification: 'M.Tech' },
];