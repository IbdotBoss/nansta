import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'nansta — smart money intelligence',
  description: 'Where does smart money deploy capital in DeFi? Lending, LP, staking, farming — analyzed across chains.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: 'dark' }}
    >
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-black text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
