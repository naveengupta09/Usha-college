export const COLLEGE = {
  name: 'Usha Institute of Professional Education',
  shortName: 'UIPE',
  tagline: 'Shaping Tomorrow\'s Leaders Today',
  address: 'Lauriya, Areraj, East Champaran, Bihar - 845411',
  phone: '+91 9006927981',
  email: 'info@uipe.org.in',
  website: 'www.uipe.org.in',
  collegeCode: '443',
  aisheCode: '73733',
  affiliation: 'B.R.A. Bihar University, Muzaffarpur',
  established: '2009',
  socialMedia: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
    twitter: '#',
  },
  mapLink: 'https://maps.google.com/?q=Lauriya+Areraj+Bihar',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Academics',
    href: '/courses',
    children: [
      { label: 'All Courses', href: '/courses' },
      { label: 'Faculty', href: '/faculty' },
    ]
  },
  { label: 'Admission', href: '/admission' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const DEPARTMENTS = ['Arts', 'Science', 'Commerce', 'Computer Science', 'Education'];
export const COURSE_CATEGORIES = ['undergraduate', 'postgraduate', 'diploma', 'certificate', 'vocational'];
export const GALLERY_CATEGORIES = ['campus', 'events', 'sports', 'academics', 'cultural', 'infrastructure', 'achievements'];
export const ADMISSION_STATUSES = ['pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'enrolled'];