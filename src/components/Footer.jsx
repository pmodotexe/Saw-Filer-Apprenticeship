
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Linkedin, Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PolicyModal from './PolicyModal';

const policyData = {
  privacy: {
    title: 'Privacy Policy',
    text: `
      <h2>1. Introduction</h2>
      <p>Welcome to Reliability Solutions. We are committed to protecting your privacy and complying with applicable data protection laws. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
      
      <h2>2. Information We Collect</h2>
      <p>We may collect personal information such as your name, email address, phone number, company information, educational background, and employment details when you voluntarily provide it to us through our contact forms, registration process, or apprenticeship applications.</p>
      
      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to: provide and manage our services, process apprenticeship applications, respond to your inquiries, send you program-related communications, conduct assessments and evaluations, maintain records for compliance purposes, and improve our website and offerings.</p>
      
      <h2>4. Data Security</h2>
      <p>We implement appropriate administrative, technical, and physical security measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      
      <h2>5. Data Retention</h2>
      <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
      
      <h2>6. Your Rights</h2>
      <p>You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at the information provided below.</p>
      
      <h2>7. Contact Information</h2>
      <p>For privacy-related inquiries, please contact us at paolomorales@reliabilitysolutions.net or write to us at 4389 Hamman Avenue, Pensacola, Florida 32514, U.S.A.</p>
    `
  },
  terms: {
    title: 'Terms of Use',
    text: `
      <h2>1. Agreement to Terms</h2>
      <p>By accessing or using our website and services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
      
      <h2>2. Intellectual Property Rights</h2>
      <p>The content on our site, including but not limited to text, graphics, logos, images, audio clips, video clips, data compilations, and software, is the property of Reliability Solutions or its content suppliers and is protected by United States and international copyright laws.</p>
      
      <h2>3. User Conduct</h2>
      <p>You agree not to use the site for any unlawful purpose or to solicit others to perform or participate in any unlawful acts. You may not violate any local, state, federal, or international law while using our services.</p>
      
      <h2>4. Limitation of Liability</h2>
      <p>In no event shall Reliability Solutions, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the website or services.</p>
      
      <h2>5. Indemnification</h2>
      <p>You agree to defend, indemnify, and hold harmless Reliability Solutions from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses arising from your use of the website or services.</p>
      
      <h2>6. Modifications</h2>
      <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.</p>
    `
  },
  legal: {
    title: 'Legal Information',
    text: `
      <h2>Disclaimer</h2>
      <p>The information provided on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
      
      <h2>Professional Services Disclaimer</h2>
      <p>Our apprenticeship programs are designed for educational and professional development purposes. Results may vary based on individual effort, prior experience, and market conditions. We do not guarantee employment outcomes or specific career advancement.</p>
      
      <h2>Limitation of Liability</h2>
      <p>In no event shall Reliability Solutions, nor any of its officers, directors, employees, or agents, be liable to you for anything arising out of or in any way connected with your use of this website or our services, whether such liability is under contract, tort, or otherwise.</p>
      
      <h2>Governing Law</h2>
      <p>These terms and conditions are governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions.</p>
      
      <h2>Severability</h2>
      <p>If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
    `
  },
  cancellation: {
    title: 'Cancellation & Withdrawal Policy',
    text: `
      <h2>1. Cancellation Requirements</h2>
      <p>To cancel your enrollment or to stop future billing, you must provide written notice. Acceptable formats include:</p>
      <ul>
        <li>An email sent to accounting@reliabilitysolutions.net</li>
        <li>A formal letter mailed to the address below:<br>
        Reliability Solutions<br>4389 Hamman Avenue<br>
        Pensacola, Florida 32514, U.S.A</li>
      </ul>
      <p>Verbal cancellations or failure to attend do not constitute formal withdrawal and may result in continued billing or forfeiture of fees.</p>
      
      <h2>2. Timing and Fees</h2>
      <p>To avoid charges for a future cohort, written notice must be received at least 30 days before the next cohort start date.</p>
    `
  },
  sitemap: {
    title: 'Site Map',
    text: `
      <div class="space-y-4">
        <div>
          <a href="${createPageUrl('Home')}" class="text-black text-lg font-bold hover:underline">Home</a>
        </div>
        
        <div>
          <a href="${createPageUrl('Register')}" class="text-black text-lg font-bold hover:underline">Register</a>
        </div>

        <div>
          <a href="${createPageUrl('LearnEngage')}" class="text-black text-lg font-bold hover:underline">Learn & Engage</a>
          <ul class="ml-4 mt-2 space-y-1">
            <li><a href="${createPageUrl('About')}" class="text-blue-600 hover:underline text-sm">About</a></li>
            <li><a href="${createPageUrl('LearnEngage')}#lumber-library" class="text-blue-600 hover:underline text-sm">Lumber Library</a></li>
            <li><a href="${createPageUrl('LearnEngage')}#redwood-roundtable" class="text-blue-600 hover:underline text-sm">Redwood Roundtable</a></li>
          </ul>
        </div>
        
        <div>
          <a href="${createPageUrl('Home')}#contact" class="text-black text-lg font-bold hover:underline">Contact</a>
        </div>

        <div>
          <a href="${createPageUrl('ApprenticePortal')}" class="text-black text-lg font-bold hover:underline">Apprentice Portal</a>
          <ul class="ml-4 mt-2 space-y-1">
            <li><a href="${createPageUrl('ApprenticePortal')}" class="text-blue-600 hover:underline text-sm">Apprentice Portal Login</a></li>
            <li><a href="${createPageUrl('SawdustSocial')}" class="text-blue-600 hover:underline text-sm">Sawdust Social</a></li>
          </ul>
        </div>
      </div>
    `
  }
};

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const navLinks = [
    { name: 'Home', to: createPageUrl('Home') },
    { name: 'Register', to: createPageUrl('Register') },
    { name: 'Learn & Engage', to: createPageUrl('LearnEngage') },
    { name: 'Contact', to: `${createPageUrl('Home')}#contact` },
    { name: 'Apprentice Portal', to: createPageUrl('ApprenticePortal') },
  ];

  const currentYear = new Date().getFullYear();

  const handleLinkClick = (policyKey) => {
    setModalContent(policyData[policyKey]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className="content-section py-16 px-4 overflow-hidden">
        {/* Full Desktop Footer */}
        <div className="hidden md:block max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 mb-12 text-center md:text-left"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5ea9e8f9_4b166bb8-6fcd-4789-aa92-a5b103590f60.png"
                  alt="SFA Logo"
                  className="h-12 w-12"
                />
                <h3 className="text-2xl font-bold text-slate-900">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Saw Filer</span>
                  <br />Apprenticeship Program
                </h3>
              </div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/79910d1fc_c31d5184-0a17-480b-b8dc-577313fc99ef.png"
                alt="Sharpen Up or Step Aside"
                className="mt-4 w-full max-w-[250px] mx-auto md:mx-0"
              />
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">Quick Links</h4>
              <nav className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.to}
                      className="block text-slate-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">Get in Touch</h4>
              <div className="space-y-3">
                <a href="mailto:paolomorales@reliabilitysolutions.net" className="flex items-center justify-center md:justify-start gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">paolomorales@reliabilitysolutions.net</span>
                </a>
                <a href="mailto:sales@reliabilitysolutions.net" className="flex items-center justify-center md:justify-start gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">sales@reliabilitysolutions.net</span>
                </a>
                <a href="tel:251-490-2999" className="flex items-center justify-center md:justify-start gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">251-490-2999</span>
                </a>
                <a href="https://reliabilitysolutions.net" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">reliabilitysolutions.net - See our other offerings</span>
                </a>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <p className="text-slate-500 text-sm">© {currentYear} Reliability Solutions. All rights reserved.</p>
            <div className="flex gap-4">
              <motion.a
                href="https://www.facebook.com/profile.php?id=61556337221420"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/reliability-solutions"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Simplified Mobile Footer */}
        <div className="md:hidden text-center font-light" style={{ fontFamily: 'Lato' }}>
          <p className="text-xs text-gray-500 mb-3">© {currentYear} Reliability Solutions. All rights reserved.</p>
          <div className="w-full h-px bg-gray-300 opacity-30 mb-3"></div>
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-xs text-gray-500">
            <button onClick={() => handleLinkClick('privacy')} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <span className="text-gray-400">|</span>
            <button onClick={() => handleLinkClick('terms')} className="hover:text-blue-600 transition-colors">Terms of Use</button>
            <span className="text-gray-400">|</span>
            <button onClick={() => handleLinkClick('legal')} className="hover:text-blue-600 transition-colors">Legal</button>
            <span className="text-gray-400">|</span>
            <button onClick={() => handleLinkClick('cancellation')} className="hover:text-blue-600 transition-colors">Cancellation & Withdrawal</button>
            <span className="text-gray-400">|</span>
            <button onClick={() => handleLinkClick('sitemap')} className="hover:text-blue-600 transition-colors">Site Map</button>
          </div>
        </div>
      </footer>

      <PolicyModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        content={modalContent} 
      />
    </>
  );
}
