import PublicLayout from '@/app/_components/PublicLayout';
import HeroSection from './_components/HeroSection';
import CoursesSection from './_components/CoursesSection';
import WhyUsSection from './_components/WhyUsSection';
import FacultyPreview from './_components/FacultyPreview';
import GalleryPreview from './_components/GalleryPreview';
import TestimonialsSection from './_components/TestimonialsSection';
import ContactCTA from './_components/ContactCTA';

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <CoursesSection />
      <WhyUsSection />
      <FacultyPreview />
      <GalleryPreview />
      <TestimonialsSection />
      <ContactCTA />
    </PublicLayout>
  );
}