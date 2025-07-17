
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "Where are the training sessions held?",
    answer: "Training sessions are fully online. You can participate from your home, mill, or anywhere with internet access, using a desktop, laptop, or smartphone."
  },
  {
    question: "Is this program eligible for state funding? Can I use the GI Bill to cover costs?",
    answer: "Yes, you can use the GI Bill, and you may also be eligible for Basic Allowance for Housing (BAH) while enrolled. Consult sponsor company for assistance and fastport for guidance."
  },
  {
    question: "What happens if I miss a class?",
    answer: "If you miss a class, you will receive a recording of the session. It will be your responsibility to watch the session and complete the assignments and exams."
  },
  {
    question: "Is attendance mandatory for all sessions?",
    answer: "Yes, attendance is essential for successfully completing the program. Missing too many sessions could affect your progress."
  },
  {
    question: "Do I need a mentor?",
    answer: "Yes, a mentor is highly recommended. Mentors can participate alongside you and even complete assignments with you. They will also sign off on your competencies throughout the apprenticeship."
  },
  {
    question: "How do I access class recordings?",
    answer: "Recordings for each session are uploaded to the LMS after class. Simply log in and access the \"Pre-Recorded ILT\" section under the relevant course."
  },
  {
    question: "Can I schedule one-on-one time with instructors?",
    answer: "Yes! You can book one-on-one sessions with instructors via email or by calling them."
  },
  {
    question: "How is my progress evaluated?",
    answer: "Your progress is tracked through assignments, exams, and attendance. Instructors provide regular feedback to help you stay on track. Company-specific, your assigned mentor may also track your performance via OJL as well as your HR tracking progress through the LMS and regular updates."
  },
  {
    question: "How long do I have to complete the program?",
    answer: "You must complete the program within 4 years of your start date. 3 years with Reliability Solutions for the Distance Learning and 1 year with your employer for the completion of competencies (OJL). This allows you to work through the material, OJL, and assessments at a reasonable pace."
  },
  {
    question: "What support is available for technical issues?",
    answer: "If you experience technical issues, you can reach our support team via email in the student portal, regular email or use the LMS's \"chat\" section for assistance."
  },
  {
    question: "What will I receive upon completion?",
    answer: "Upon successful completion, you will receive a Department of Labor-endorsed Journeyperson Credential, recognizing your achievement."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white/20 backdrop-blur-sm rounded-lg m-4 p-6">
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                FAQ
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              Frequently asked questions about the Saw Filer Apprenticeship Program
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
