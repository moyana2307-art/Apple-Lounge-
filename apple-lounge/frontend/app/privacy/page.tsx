import Link from 'next/link';

const sections = [
  {
    title: 'Information We Collect',
    content: `When you visit Apple Lounge Zimbabwe, we may collect certain information about your device and your use of our website. This may include:

• Personal information you provide voluntarily (name, email, phone number) when placing an order or contacting us
• Device information such as your IP address, browser type, and operating system
• Usage data including pages visited, time spent on pages, and navigation patterns`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect for the following purposes:

• To process and fulfill your orders for Apple products
• To communicate with you about your orders, inquiries, and promotions
• To improve our website, products, and services
• To ensure the security and integrity of our platform
• To comply with legal obligations`,
  },
  {
    title: 'Order Information',
    content: `When you place an order through our website, we collect:

• Your full name and contact information (phone number, email)
• Delivery address (if you choose delivery)
• Order details including products selected and payment preferences

This information is necessary to process and deliver your order. We do not store payment card details on our servers.`,
  },
  {
    title: 'Information Sharing',
    content: `We do not sell, trade, or otherwise transfer your personal information to outside parties except:

• To trusted third-party service providers who assist us in operating our website and conducting our business
• When required by law or to protect our rights
• To delivery partners to fulfill your orders (with your consent)`,
  },
  {
    title: 'Data Security',
    content: `We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: 'Cookies',
    content: `Our website may use cookies to enhance your experience. You can choose to disable cookies through your browser settings, though this may affect the functionality of the website.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to:

• Access the personal information we hold about you
• Request correction of inaccurate information
• Request deletion of your personal information
• Opt out of marketing communications`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at:

Email: info@apparelounge.co.zw
Phone: +263 77 123 4567
Location: Victoria Falls, Zimbabwe`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-apple-dark text-white pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
            Privacy Policy
          </h1>
          <p className="text-lg text-apple-gray">Last updated: January 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-lg md:text-xl text-apple-gray leading-relaxed mb-14">
            At Apple Lounge Zimbabwe, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
          </p>

          <div className="space-y-14">
            {sections.map((section, i) => (
              <div key={section.title}>
                <h2 className="text-xl sm:text-2xl font-bold text-apple-dark mb-4 tracking-tight">
                  {section.title}
                </h2>
                <div className="text-apple-gray leading-[1.85] whitespace-pre-line text-[15px]">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-apple-border">
            <Link href="/" className="text-apple-blue hover:underline text-sm font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
