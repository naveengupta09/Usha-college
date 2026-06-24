import type { SVGProps } from 'react';
import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { COLLEGE } from '@/data/constants';

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.07c0-5.49-4.46-9.95-9.95-9.95S2.1 6.58 2.1 12.07c0 4.98 3.64 9.1 8.41 9.84v-6.97h-2.53v-2.87h2.53V9.42c0-2.5 1.5-3.88 3.79-3.88 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.57v1.9h2.79l-.45 2.87h-2.34V21.9c4.77-.74 8.41-4.86 8.41-9.83Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M16.5 7.5h.01" />
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.8 7.2a2.8 2.8 0 0 0-1.96-2C17.9 5 12 5 12 5s-5.9 0-7.84.2A2.8 2.8 0 0 0 2.2 7.2 29.7 29.7 0 0 0 2 12a29.7 29.7 0 0 0 .2 4.8 2.8 2.8 0 0 0 1.96 2C6.1 19 12 19 12 19s5.9 0 7.84-.2a2.8 2.8 0 0 0 1.96-2A29.7 29.7 0 0 0 22 12a29.7 29.7 0 0 0-.2-4.8Zm-12.2 8.2V8.6l5.4 3.4-5.4 3.4Z" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.28 4.28 0 0 0 1.88-2.36 8.56 8.56 0 0 1-2.72 1.04 4.26 4.26 0 0 0-7.28 3.88A12.1 12.1 0 0 1 3.15 4.6a4.26 4.26 0 0 0 1.32 5.68 4.21 4.21 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.42 4.18 4.28 4.28 0 0 1-1.92.07 4.26 4.26 0 0 0 3.98 2.96 8.56 8.56 0 0 1-5.3 1.83A8.8 8.8 0 0 1 2 18.13a12.07 12.07 0 0 0 6.54 1.92c7.85 0 12.14-6.5 12.14-12.13 0-.18-.01-.35-.02-.53A8.68 8.68 0 0 0 22.46 6Z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-uipe-navy text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-uipe-gold/20 border border-uipe-gold/40 flex items-center justify-center">
                <GraduationCap size={22} className="text-uipe-gold" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg leading-tight">UIPE</p>
                <p className="text-xs text-gray-400 leading-tight">Est. {COLLEGE.established}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Usha Institute of Professional Education is committed to providing quality higher education and empowering students to achieve their full potential.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FacebookIcon, href: COLLEGE.socialMedia.facebook },
                { icon: InstagramIcon, href: COLLEGE.socialMedia.instagram },
                { icon: YoutubeIcon, href: COLLEGE.socialMedia.youtube },
                { icon: TwitterIcon, href: COLLEGE.socialMedia.twitter },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-uipe-gold flex items-center justify-center transition-colors">
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-uipe-gold mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Courses', href: '/courses' },
                { label: 'Faculty', href: '/faculty' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Admissions', href: '/admission' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-uipe-gold transition-colors group">
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-heading font-semibold text-uipe-gold mb-5">Programs</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Bachelor of Arts (BA)', href: '/courses' },
                { label: 'Bachelor of Science (BSc)', href: '/courses' },
                { label: 'Bachelor of Commerce (BCom)', href: '/courses' },
                { label: 'BCA', href: '/courses' },
                { label: 'Master of Arts (MA)', href: '/courses' },
                { label: 'Diploma Programs', href: '/courses' },
              ].map((course, i) => (
                <li key={i}>
                  <Link href={course.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-uipe-gold transition-colors group">
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    {course.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-uipe-gold mb-5">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-uipe-gold mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 leading-relaxed">{COLLEGE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-uipe-gold shrink-0" />
                <a href={`tel:${COLLEGE.phone}`} className="text-sm text-gray-400 hover:text-white transition-colors">{COLLEGE.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-uipe-gold shrink-0" />
                <a href={`mailto:${COLLEGE.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">{COLLEGE.email}</a>
              </li>
            </ul>
            <div className="mt-5 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-500 mb-1">College Code: <span className="text-uipe-gold font-semibold">{COLLEGE.collegeCode}</span></p>
              <p className="text-xs text-gray-500">AISHE Code: <span className="text-uipe-gold font-semibold">{COLLEGE.aisheCode}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} {COLLEGE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Use</Link>
            <Link href="/admin" className="text-xs text-gray-500 hover:text-uipe-gold transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}