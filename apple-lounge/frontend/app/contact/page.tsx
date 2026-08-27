'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send, Loader2 } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263771234567';

const contactMethods = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+263 77 123 4567',
    href: 'tel:+263771234567',
    description: 'Call us directly',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@apparelounge.co.zw',
    href: 'mailto:info@apparelounge.co.zw',
    description: 'Send us an email',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+263 77 123 4567',
    href: generateWhatsAppUrl(whatsappPhone, 'Hello Apple Lounge! I need assistance.'),
    description: 'Chat instantly',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Victoria Falls, Zimbabwe',
    href: '#map',
    description: 'Visit our store',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setSubmitting(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-apple-dark text-white pt-32 pb-24 md:pt-44 md:pb-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05]"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-xl text-apple-gray mt-6 max-w-xl mx-auto"
          >
            We&apos;re here to help. Reach out to us anytime.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactMethods.map(({ icon: Icon, label, value, href, description }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-apple-light rounded-3xl p-8 text-center hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-apple-blue group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-apple-blue group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-apple-gray mb-2">{label}</p>
                <p className="font-semibold text-apple-dark mb-1">{value}</p>
                <p className="text-sm text-apple-gray">{description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Column: Form + Info */}
      <section className="py-20 md:py-28 bg-apple-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left — Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-apple-dark tracking-tight mb-3">
                Send us a Message
              </h2>
              <p className="text-apple-gray mb-10 text-lg">
                Fill out the form and we&apos;ll get back to you shortly.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-10 text-center"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Send className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-apple-dark mb-2">Message Sent!</h3>
                  <p className="text-apple-gray mb-6">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-apple-blue font-semibold hover:underline text-sm"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-apple-dark mb-2">Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3.5 bg-white border border-apple-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-apple-dark mb-2">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3.5 bg-white border border-apple-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-dark mb-2">Subject</label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-apple-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-dark mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-5 py-3.5 bg-white border border-apple-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 bg-apple-blue text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-apple-blue-hover transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right — Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <a
                href={generateWhatsAppUrl(whatsappPhone, 'Hello Apple Lounge! I need assistance.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 bg-green-500 text-white p-6 rounded-3xl hover:bg-green-600 transition-colors duration-300"
              >
                <MessageCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lg">Chat on WhatsApp</p>
                  <p className="text-sm text-green-100">Get instant responses from our team</p>
                </div>
              </a>

              <div className="bg-white rounded-3xl p-8">
                <h3 className="font-semibold text-apple-dark text-lg mb-5">Business Hours</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-apple-gray">Monday — Friday</span>
                    <span className="font-semibold text-apple-dark">8:00 AM — 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-apple-gray">Saturday</span>
                    <span className="font-semibold text-apple-dark">8:00 AM — 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-apple-gray">Sunday</span>
                    <span className="font-semibold text-apple-dark">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section id="map" className="py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-apple-dark tracking-tight mb-4">
              Find Us
            </h2>
            <p className="text-lg text-apple-gray">Victoria Falls, Zimbabwe</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden bg-apple-light h-[350px] md:h-[450px] flex items-center justify-center"
          >
            <div className="text-center text-apple-gray">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-apple-blue" strokeWidth={1.5} />
              <p className="font-medium text-apple-dark">Victoria Falls, Zimbabwe</p>
              <p className="text-sm mt-1">Interactive map coming soon</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
