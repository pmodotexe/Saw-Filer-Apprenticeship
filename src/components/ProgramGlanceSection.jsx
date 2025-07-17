
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  GraduationCap,
  Award,
  ChevronDown,
  Target,
  CheckCircle
} from 'lucide-react';

const programData = [
  {
    id: 'duration',
    title: 'Program Duration',
    icon: Clock,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    content: [
      'Three-Year Program (RS) + One-Year OJL from Sponsoring Company.',
      'Includes weekly 2-hour, instructor-led training sessions, with the exception of the last week of the month.'
    ]
  },
  {
    id: 'eligibility',
    title: 'Eligibility Criteria',
    icon: GraduationCap,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    content: [
      'Must have a High School Diploma or equivalent.',
      'No less than 16 years of age, unless specified by state laws, regulations or the sponsoring company.'
    ]
  },
  {
    id: 'investment',
    title: 'Investment & Certification',
    icon: Award,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    content: [
      'Apprentices: $3,500 per year ($10,500 for the entire program)',
      'Mentors: $1,500 per year ($4,500 for the entire program)',
      'Certification: Apprentices will receive a DOL Journeyperson Credential upon satisfactory completion of the program.',
      'Note: Price excludes the cost of books, tools, materials and additional hands-on training with preferred training providers.'
    ]
  },
  {
    id: 'highlights',
    title: 'Program Highlights',
    icon: Target,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    content: [
      "The first-year curriculum emphasizes on Reliability Solutions' best-in-class and world-renowned Essential Craft Skills™, laying the foundation for mastery.",
      'Every aspect is designed to be readily applicable and actionable, allowing apprentices to immediately apply skills in real-world settings.',
      'Assignments and projects are specifically designed to drive improvements in your mill.',
      'Sponsored by the SLMA, ensuring alignment with the highest industry standards.'
    ]
  }
];

export default function ProgramGlanceSection() {
  const [openCards, setOpenCards] = useState(new Set());

  const toggleCard = (cardId) => {
    const newOpenCards = new Set(openCards);
    if (newOpenCards.has(cardId)) {
      newOpenCards.delete(cardId);
    } else {
      newOpenCards.add(cardId);
    }
    setOpenCards(newOpenCards);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, scale: 1.02 }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Program
            </span>
            <br />
            <span className="text-slate-900">At A Glance</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Everything you need to know about our comprehensive apprenticeship program
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programData.map((item, index) => {
            const Icon = item.icon;
            const isOpen = openCards.has(item.id);

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleCard(item.id)}
                  className="w-full p-6 text-left hover:bg-white/20 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${item.bgColor}`}>
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        animate={!isOpen ? { scale: [1, 1.1, 1] } : {}}
                        transition={!isOpen ? { duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' } : {}}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      </motion.div>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {item.title}
                  </h3>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <ul className="space-y-3">
                          {item.content.map((point, pointIndex) => (
                            <motion.li
                              key={pointIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: pointIndex * 0.1 }}
                              className="flex items-start gap-3 text-slate-600"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{point}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join America's only Department of Labor registered Saw Filer Apprenticeship Program
              and become part of an elite group of skilled professionals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://app.smartsheet.com/b/form/8316a4445300487cbf556d013b0e6fc1', '_blank', 'noopener,noreferrer')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
            >
              Apply Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
