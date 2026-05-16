import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'Azari Parfumes | Lüks Ətir Butiki',
  description: 'Lüks ətirlər dünyasını kəşf edin. Dünyanın ən seçkin ətirlərindən ibarət kolleksiya.',
  openGraph: {
    title: 'Azari Parfumes | Lüks Ətir Butiki',
    description: 'Lüks ətirlər dünyasını kəşf edin. Dünyanın ən seçkin ətirlərindən ibarət kolleksiya.',
    type: 'website',
    locale: 'az_AZ',
    siteName: 'Azari Parfumes',
  },
  keywords: ['ətir', 'parfum', 'lüks', 'kolonya', 'qoxu', 'oriental', 'floral', 'odunsu'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
