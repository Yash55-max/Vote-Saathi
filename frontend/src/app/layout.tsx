import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'VoteSaathi — Your Election Companion',
  description:
    'CivicGuide AI: A context-aware election assistant to help Indian citizens navigate the voting process with personalized, multilingual guidance.',
  keywords: 'India election, voting guide, voter registration, AI assistant, civic education',
  openGraph: {
    title: 'VoteSaathi — Your Election Companion',
    description: 'Personalized AI-powered election guidance for every Indian voter.',
    type: 'website',
  },
};

import AccessibilityToolbar from '@/components/AccessibilityToolbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-background min-h-screen antialiased" suppressHydrationWarning>
        <AccessibilityToolbar />
        <div id="main-content">
          {children}
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#161829',
              color: '#F0F0F5',
              border: '1px solid #2a2d4a',
            },
          }}
        />
      </body>
    </html>
  );
}
