// === IMPORTS ===

import { Cinzel, Nunito } from 'next/font/google';
import '@/styles/globals.scss';

// === FONTS ===

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});

// === METADATA ===

export const metadata = {
  title: 'HAGANE — Katana Forge',
  description:
    'An immersive 3D katana customizer with ambient Japanese environments, real-time blade customization and stunning Three.js effects.',
  keywords: [
    'hagane',
    'katana',
    'sword',
    'three.js',
    'react',
    'nextjs',
    'webgl',
    '3d',
    'japanese',
    'samurai',
  ],
  authors: [{ name: 'TheLeon' }],
  icons: {
    icon: [{ url: '/img/logo/ronin_white.png', type: 'image/png' }],
    apple: '/img/logo/ronin_white.png',
  },
  openGraph: {
    title: 'HAGANE',
    description:
      'Immersive 3D katana customizer with ambient Japanese environments',
    type: 'website',
  },
};

// === VIEWPORT ===

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// === COMPONENT ===

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
