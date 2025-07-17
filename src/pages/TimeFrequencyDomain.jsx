import React from 'react';
import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';

export default function TimeFrequencyDomain() {
  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <Waves className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Time & Frequency Domain
            </span>
          </h1>
          <p className="text-slate-600 text-2xl font-light">
            Coming Soon!
          </p>
          <p className="text-slate-500 text-lg mt-4">
            This interactive tool is currently under development. Analyze signals in a new way soon!
          </p>
        </motion.div>
      </div>
    </div>
  );
}