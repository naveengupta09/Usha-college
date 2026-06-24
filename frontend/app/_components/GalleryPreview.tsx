'use client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Quote, Star, Phone, Mail, MapPin } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { COLLEGE } from '@/data/constants';

type GalleryImage = {
  _id?: string | number;
  title?: string;
  image?: {
    url?: string;
  } | null;
};

// Gallery Preview
export function GalleryPreview() {
  const { data } = useQuery({
    queryKey: ['gallery-preview'],
    queryFn: () => publicApi.getGallery({ featured: true, limit: 6 }),
  });

  const images = data?.data?.data || PLACEHOLDER_IMAGES;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-block text-uipe-gold font-semibold text-sm tracking-widest uppercase mb-3">Campus Life</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl font-bold text-uipe-navy">Photo Gallery</motion.h2>
          </div>
          <Button asChild variant="outline" className="border-uipe-navy text-uipe-navy hover:bg-uipe-navy hover:text-white self-start">
            <Link href="/gallery" className="flex items-center gap-2">View All <ArrowRight size={15} /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.slice(0, 6).map((img: GalleryImage, i: number) => (
            <motion.div key={img._id || i}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className={`relative overflow-hidden rounded-2xl bg-gray-200 group cursor-pointer ${i === 0 ? 'row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '1/1.8' : '4/3' }}>
              {img.image?.url ? (
                <Image src={img.image.url} alt={img.title || 'Gallery'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-uipe-navy/20 to-uipe-sky/20 flex items-center justify-center">
                  <span className="text-uipe-navy/30 text-sm">Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-sm font-medium">{img.title || 'Campus Life'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials
const TESTIMONIALS = [
  { name: 'Rahul Kumar', course: 'B.Com', batch: '2022', message: 'UIPE gave me the foundation I needed. The faculty is incredibly supportive and the curriculum is practically focused. I got placed immediately after graduation.', rating: 5 },
  { name: 'Priya Sharma', course: 'B.A.', batch: '2023', message: 'The college has an amazing environment for learning. The teachers are knowledgeable and always ready to help. I would highly recommend UIPE to all students.', rating: 5 },
  { name: 'Amit Singh', course: 'BCA', batch: '2022', message: 'The computer lab facilities and the quality of teaching in BCA is excellent. I now work as a software developer thanks to the skills I built here.', rating: 5 },
  { name: 'Sunita Devi', course: 'M.A.', batch: '2023', message: 'Pursuing my Masters at UIPE was the best decision. The research guidance and academic rigor prepared me well for my competitive exams.', rating: 5 },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-uipe-gold font-semibold text-sm tracking-widest uppercase mb-3">Success Stories</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-bold text-uipe-navy">What Our Students Say</motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-uipe-navy/20 hover:shadow-md transition-all">
              <Quote size={28} className="text-uipe-gold/40 mb-4" />
              <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">&quot;{t.message}&quot;</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="fill-uipe-gold text-uipe-gold" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-uipe-navy flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-uipe-navy text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.course}, Batch {t.batch}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact CTA
export function ContactCTA() {
  return (
    <section className="section-padding bg-linear-to-br from-uipe-navy to-blue-900">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-uipe-gold font-semibold text-sm tracking-widest uppercase mb-3">Get In Touch</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Have Questions?<br />We&apos;re Here to Help.
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Reach out to our admissions team for guidance on courses, fees, and the application process.
            </p>
            <div className="space-y-4">
              {[
                { icon: Phone, label: COLLEGE.phone, href: `tel:${COLLEGE.phone}` },
                { icon: Mail, label: COLLEGE.email, href: `mailto:${COLLEGE.email}` },
                { icon: MapPin, label: COLLEGE.address, href: COLLEGE.mapLink },
              ].map(({ icon: Icon, label, href }, i) => (
                <a key={i} href={href} target={i === 2 ? '_blank' : undefined} rel="noreferrer"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-uipe-gold transition-colors">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="font-heading font-bold text-uipe-navy text-2xl mb-6">Send a Message</h3>
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Your Name</label>
          <input className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-uipe-navy focus:border-transparent" placeholder="Full Name" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Phone</label>
          <input className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-uipe-navy focus:border-transparent" placeholder="+91 XXXXXXXXXX" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
        <input type="email" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-uipe-navy focus:border-transparent" placeholder="you@email.com" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Message</label>
        <textarea rows={4} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-uipe-navy focus:border-transparent resize-none" placeholder="Your message..." />
      </div>
      <Button type="submit" className="w-full bg-uipe-navy hover:bg-uipe-navy/90 text-white font-semibold py-3">
        Send Message
      </Button>
    </form>
  );
}

export default GalleryPreview;

const PLACEHOLDER_IMAGES = Array.from({ length: 6 }, (_, i) => ({ _id: i, title: `Campus ${i + 1}`, image: null }));