import Link from 'next/link';
import { generateWhatsAppUrl } from '@/lib/utils';

const exploreLinks = [
  { href: '/', label: 'Home' },
  { href: '/products?category=iphones', label: 'iPhones' },
  { href: '/products?category=accessories', label: 'Accessories' },
  { href: '/products?sort=price_asc', label: 'Deals' },
  { href: '/about', label: 'About' },
];

const models = [
  { href: '/products?model=iPhone+17', label: 'iPhone 17' },
  { href: '/products?model=iPhone+16', label: 'iPhone 16' },
  { href: '/products?model=iPhone+15', label: 'iPhone 15' },
  { href: '/products?model=iPhone+14', label: 'iPhone 14' },
];

const whatsappUrl = generateWhatsAppUrl(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263771234567',
  'Hello Apple Lounge! I would like to inquire about your products.'
);

export default function Footer() {
  return (
    <footer className="bg-[#1d1d1f]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="mb-12">
          <div className="flex items-center gap-2.5 mb-2">
            <img src="/Pics/apple.jpeg" alt="" className="w-5 h-5 object-contain opacity-50" />
            <h2 className="text-xl font-semibold text-white tracking-tight">Apple Lounge</h2>
          </div>
          <p className="text-sm text-[#86868B] ml-7.5">Empowering Connections &middot; Victoria Falls</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-widest mb-4">Explore</h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[#86868B] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-widest mb-4">iPhone Models</h3>
            <ul className="space-y-2.5">
              {models.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[#86868B] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-widest mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:+263771234567" className="text-[13px] text-[#86868B] hover:text-white transition-colors duration-200">
                  +263 77 123 4567
                </a>
              </li>
              <li>
                <a href="mailto:info@apparelounge.co.zw" className="text-[13px] text-[#86868B] hover:text-white transition-colors duration-200">
                  info@apparelounge.co.zw
                </a>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#25D366] hover:text-[#20bd5a] transition-colors duration-200">
                  WhatsApp Us
                </a>
              </li>
              <li>
                <span className="text-[13px] text-[#86868B]">Victoria Falls, Zimbabwe</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-[13px] text-[#86868B] hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[13px] text-[#86868B] hover:text-white transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/admin" className="text-[13px] text-[#86868B] hover:text-white transition-colors duration-200">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#86868B]/60">
            Copyright &copy; {new Date().getFullYear()} Apple Lounge Zimbabwe. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[11px] text-[#86868B]/60 hover:text-white/60 transition-colors duration-200">Privacy</Link>
            <Link href="/terms" className="text-[11px] text-[#86868B]/60 hover:text-white/60 transition-colors duration-200">Terms</Link>
            <Link href="/admin" className="text-[11px] text-[#86868B]/60 hover:text-white/60 transition-colors duration-200">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
