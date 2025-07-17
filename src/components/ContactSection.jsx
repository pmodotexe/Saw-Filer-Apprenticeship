import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';

export default function ContactSection() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Contact
            </span>
          </h2>
          <p className="text-slate-600 text-lg">
            Get in touch with us for more information about the program
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-start"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6bea24f58_momo_irl_blue_collar_worker_with_helmet_rugged_beard_handsome_29a9cb18-968d-4a87-9beb-d2dd82f04271_3.png"
              alt="Professional worker"
              className="w-full max-w-md rounded-2xl shadow-xl"
            />
          </motion.div>

          {/* Right side - Smartsheet Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full h-[600px] lg:h-full rounded-2xl overflow-hidden shadow-xl border border-gray-200/80"
          >
            <iframe 
              width="100%" 
              height="100%"
              src="https://app.smartsheet.com/b/form/32dcb69f0f044ca59b70243600fff7af"
              frameBorder="0"
              style={{ minHeight: '600px' }}
              title="Contact Form"
            ></iframe>
          </motion.div>
        </div>

        {/* Social Links Section */}
        <motion.div 
            className="flex justify-center gap-6 mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
        >
          <div className="text-center">
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Connect With Us</h4>
            <div className="flex justify-center gap-4">
              <motion.a 
                href="https://www.facebook.com/profile.php?id=61556337221420" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ scale: 1.1, y: -3 }} 
                whileTap={{ scale: 0.95 }} 
                className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors duration-300"
              >
                <Facebook className="w-6 h-6 text-blue-600" />
              </motion.a>
              
              <motion.a 
                href="https://www.linkedin.com/company/reliability-solutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ scale: 1.1, y: -3 }} 
                whileTap={{ scale: 0.95 }} 
                className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors duration-300"
              >
                <Linkedin className="w-6 h-6 text-blue-700" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}