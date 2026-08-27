import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Apple Lounge Zimbabwe | Premium iPhones in Victoria Falls',
  description: 'Apple Lounge Zimbabwe - Your premium destination for brand-new iPhones and Apple products in Victoria Falls. Empowering Connections.',
  keywords: 'iPhone, Apple, Victoria Falls, Zimbabwe, iPhone 17, iPhone 16, iPad, Mac, Apple Watch',
  openGraph: {
    title: 'Apple Lounge Zimbabwe | Premium iPhones in Victoria Falls',
    description: 'Your premium destination for brand-new iPhones and Apple products in Victoria Falls.',
    type: 'website',
    locale: 'en_ZW',
    siteName: 'Apple Lounge Zimbabwe',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
