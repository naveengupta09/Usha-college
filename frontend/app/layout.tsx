'use client';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { QueryClientProvider } from './providers';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Usha Institute of Professional Education - Quality Higher Education in Lauriya, Areraj" />
        <title>UIPE - Usha Institute of Professional Education</title>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <QueryClientProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}