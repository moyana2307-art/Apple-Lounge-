import Link from 'next/link';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing and using the Apple Lounge Zimbabwe website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.`,
  },
  {
    title: 'Products and Pricing',
    content: `• All products listed are genuine, brand-new Apple devices and accessories
• Prices are displayed in USD and are subject to change without notice
• We reserve the right to limit the quantity of items purchased per person or per order
• Product images are for illustration purposes; actual products may vary slightly
• Availability of products is subject to stock levels`,
  },
  {
    title: 'Orders and Payment',
    content: `• Placing an order does not guarantee acceptance; we reserve the right to refuse any order
• Payment can be made via the methods available at checkout or upon delivery (if applicable)
• Orders are subject to verification and fraud prevention checks
• We reserve the right to cancel orders that appear fraudulent or unauthorized`,
  },
  {
    title: 'Delivery and Pickup',
    content: `• In-store pickup is available at our Victoria Falls location
• Delivery is available nationwide; delivery times and costs may vary
• Risk of loss and title for items pass to you upon delivery or pickup
• We are not responsible for delays caused by shipping carriers or customs`,
  },
  {
    title: 'Warranty and Returns',
    content: `• All Apple devices come with the standard Apple manufacturer warranty
• Returns are accepted within 14 days of purchase for unopened items in original packaging
• Opened items may be eligible for exchange if defective
• Refunds will be processed to the original payment method
• Warranty claims should be directed to Apple Support or our store`,
  },
  {
    title: 'User Accounts',
    content: `• You are responsible for maintaining the confidentiality of your account credentials
• You must be at least 18 years old to create an account
• We reserve the right to suspend or terminate accounts that violate these terms
• You are responsible for all activities that occur under your account`,
  },
  {
    title: 'Prohibited Activities',
    content: `When using our website, you agree not to:

• Use the website for any unlawful purpose
• Attempt to gain unauthorized access to any part of the website
• Interfere with or disrupt the website or servers
• Use automated systems to access the website without permission
• Resell products purchased through our website without authorization`,
  },
  {
    title: 'Limitation of Liability',
    content: `Apple Lounge Zimbabwe shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our website or products. Our total liability shall not exceed the amount paid by you for the product in question.`,
  },
  {
    title: 'Governing Law',
    content: `These Terms of Service are governed by and construed in accordance with the laws of Zimbabwe. Any disputes shall be subject to the exclusive jurisdiction of the courts of Zimbabwe.`,
  },
  {
    title: 'Contact',
    content: `For questions about these Terms of Service, please contact us at:

Email: info@apparelounge.co.zw
Phone: +263 77 123 4567
Location: Victoria Falls, Zimbabwe`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-apple-dark text-white pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
            Terms of Service
          </h1>
          <p className="text-lg text-apple-gray">Last updated: January 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-lg md:text-xl text-apple-gray leading-relaxed mb-14">
            Welcome to Apple Lounge Zimbabwe. These Terms of Service govern your use of our website and services. Please read them carefully before making a purchase.
          </p>

          <div className="space-y-14">
            {sections.map((section) => (
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
