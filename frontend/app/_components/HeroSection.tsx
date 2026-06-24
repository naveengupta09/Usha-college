'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Play, GraduationCap, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const SLIDES = [
  {
    id: 1,
    title: 'Excellence in',
    highlight: 'Higher Education',
    subtitle: 'Shaping futures, building careers, transforming lives through quality professional education.',
    bg: 'from-uipe-navy via-blue-900 to-indigo-900',
    accent: '#C9A227',
  },
  {
    id: 2,
    title: 'Discover Your',
    highlight: 'True Potential',
    subtitle: 'Join thousands of students who have built successful careers with UIPE\'s comprehensive programs.',
    bg: 'from-slate-900 via-uipe-navy to-blue-900',
    accent: '#C9A227',
  },
  {
    id: 3,
    title: 'World-Class',
    highlight: 'Faculty & Facilities',
    subtitle: 'Learn from experienced educators in a modern campus environment designed for academic excellence.',
    bg: 'from-blue-950 via-uipe-navy to-slate-900',
    accent: '#C9A227',
  },
];

const STATS = [
  { label: 'Years of Excellence', value: 15, suffix: '+', icon: Award },
  { label: 'Students Enrolled', value: 5000, suffix: '+', icon: Users },
  { label: 'Courses Offered', value: 20, suffix: '+', icon: BookOpen },
  { label: 'Qualified Faculty', value: 50, suffix: '+', icon: GraduationCap },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
      {/* Animated background */}
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-linear-to-br ${slide.bg}`}>
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-uipe-gold blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
          </div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-uipe-gold animate-pulse" />
              <span className="text-white/90 text-xs font-medium">Admission Open {new Date().getFullYear()}-{new Date().getFullYear() + 1}</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7 }}>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-2 leading-tight">
                  {slide.title}
                </h1>
                <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight text-gradient-gold">
                  {slide.highlight}
                </h1>
                <p className="text-white/75 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-uipe-gold hover:bg-uipe-gold/90 text-white font-semibold px-8 shadow-lg shadow-uipe-gold/30 group">
                <Link href="/admission" className="flex items-center gap-2">
                  Apply Now
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur px-8">
                <Link href="/courses" className="flex items-center gap-2">
                  <Play size={16} />
                  Explore Courses
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div ref={ref} className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/10">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x divide-white/10">
            {STATS.map(({ label, value, suffix, icon: Icon }, i) => (
              <div key={i} className="px-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-uipe-gold/20 border border-uipe-gold/30 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-uipe-gold" />
                </div>
                <div>
                  <p className="text-white font-bold text-2xl leading-tight">
                    {inView ? <CountUp end={value} duration={2.5} suffix={suffix} /> : `0${suffix}`}
                  </p>
                  <p className="text-white/60 text-xs leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-24 right-8 z-20 flex flex-col gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`w-1.5 rounded-full transition-all duration-300 ${i === current ? 'h-8 bg-uipe-gold' : 'h-4 bg-white/30'}`} />
        ))}
      </div>
    </section>
  );
}