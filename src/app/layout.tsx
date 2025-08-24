// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Home Dashboard',
  description: 'IoT управление на умен дом',
  keywords: ['IoT', 'умен дом', 'автоматизация', 'управление'],
  authors: [{ name: 'Smart Home Solutions' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e293b',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div id="root" className="h-full">
            {children}
          </div>
        </Providers>

        {/* Global loading spinner portal */}
        <div id="loading-portal"></div>
        
        {/* Modal portal */}
        <div id="modal-portal"></div>
        
        {/* Toast notifications portal */}
        <div id="toast-portal"></div>
      </body>
    </html>
  );
}