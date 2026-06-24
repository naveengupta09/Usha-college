'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, ChevronDown, GraduationCap } from 'lucide-react';
import { COLLEGE, NAV_LINKS } from '@/data/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-uipe-navy text-white text-xs py-1.5 hidden md:block">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-80">
              <Phone size={11} /> {COLLEGE.phone}
            </span>
            <span className="flex items-center gap-1.5 opacity-80">
              <Mail size={11} /> {COLLEGE.email}
            </span>
          </div>
          <div className="flex items-center gap-4 opacity-80">
            <span>College Code: <strong>{COLLEGE.collegeCode}</strong></span>
            <span className="w-px h-3 bg-white/30" />
            <span>AISHE: <strong>{COLLEGE.aisheCode}</strong></span>
            <span className="w-px h-3 bg-white/30" />
            <span>Affiliated: {COLLEGE.affiliation}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-uipe-navy/10 py-2'
          : 'bg-white py-3'
      )}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-uipe-navy flex items-center justify-center ring-2 ring-uipe-gold/50 group-hover:ring-uipe-gold transition-all">
              <GraduationCap size={22} className="text-uipe-gold" />
            </div>
            <div>
              <p className="font-heading font-bold text-uipe-navy leading-tight text-[15px]">UIPE</p>
              <p className="text-[9px] text-gray-500 leading-tight hidden sm:block">Usha Institute of Professional Education</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link href={link.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-uipe-navy bg-uipe-navy/8 font-semibold'
                      : 'text-gray-700 hover:text-uipe-navy hover:bg-gray-50'
                  )}>
                  {link.label}
                  {link.children && <ChevronDown size={13} className={cn('transition-transform', activeDropdown === link.label && 'rotate-180')} />}
                </Link>
                {/* Dropdown */}
                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-uipe-navy hover:text-white transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="border-uipe-navy text-uipe-navy hover:bg-uipe-navy hover:text-white">
              <Link href="/admission/check">Track Application</Link>
            </Button>
            <Button asChild size="sm" className="bg-uipe-gold hover:bg-uipe-gold/90 text-white font-semibold shadow-sm">
              <Link href="/admission">Apply Now</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-uipe-navy hover:bg-gray-100 transition-colors">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white">
              <div className="container-custom py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    <Link href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn('block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        pathname === link.href ? 'bg-uipe-navy text-white' : 'text-gray-700 hover:bg-gray-50')}>
                      {link.label}
                    </Link>
                    {link.children?.map((child) => (
                      <Link key={child.href} href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-8 py-2 text-sm text-gray-500 hover:text-uipe-navy">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Button asChild variant="outline" size="sm" className="flex-1 border-uipe-navy text-uipe-navy">
                    <Link href="/admission/check">Track Application</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-uipe-gold text-white">
                    <Link href="/admission">Apply Now</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}