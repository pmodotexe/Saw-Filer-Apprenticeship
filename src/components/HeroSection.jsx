
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ShimmerButton } from './ui/ShimmerButton';

export default function HeroSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Full Width Wooden Sign Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-4/5 mx-auto mb-12 md:mb-16"
      >
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/5fd3f8d3f_Removebackgroundproject1.png" 
          alt="Wooden sign for Saw Filer Apprenticeship Program" 
          className="w-full h-auto"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* Left Column: Main Headline */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                CLOSE THE
              </span>
              <br />
              <span className="text-slate-900">SKILLS GAP</span>
            </h1>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-light text-slate-600 mb-12"
            >
              WITHOUT LEAVING THE MILL.
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ShimmerButton
                background="linear-gradient(to right, #3b82f6, #6366f1)"
                shimmerDuration="5s"
                className="px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-4 font-semibold text-base sm:text-lg md:text-xl shadow-lg shadow-blue-500/20"
                onClick={() => window.open('https://app.smartsheet.com/b/form/8316a4445300487cbf556d013b0e6fc1', '_blank', 'noopener,noreferrer')}
              >
                REGISTER NOW
              </ShimmerButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="text-slate-600 text-sm sm:text-base md:text-lg max-w-md text-center lg:text-left"
            >
              Cost-Effective, Standardized Training with Flexible, Anywhere Access
            </motion.p>
          </motion.div>
        </div>

        {/* Right Column: Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-6 md:p-8 space-y-4 md:space-y-6"
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-slate-900 leading-tight">
            ELEVATE YOUR SAW FILER SKILLS WITH THE NATION'S PREMIER APPRENTICESHIP
          </h3>
          <p className="font-semibold text-blue-800 bg-blue-100/50 p-3 rounded-lg text-center text-xs sm:text-sm md:text-base">
            AMERICA'S ONLY DEPARTMENT OF LABOR REGISTERED SAW FILER APPRENTICESHIP PROGRAM
          </p>
          <ul className="space-y-4 text-slate-700 text-xs sm:text-sm md:text-base">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-1 flex-shrink-0" />
              <span>Benefit from our first-year curriculum focused on our best in class and renowned Essential Craft Skills™ that set the foundational skills for mastery.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-1 flex-shrink-0" />
              <span>Engage in a holistic learning experience that merge hands-on training fortified by mentors with in-depth theoretical knowledge.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-1 flex-shrink-0" />
              <span>Earn while you learn!</span>
            </li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
}
