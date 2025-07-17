
import React from 'react';
import { motion } from 'framer-motion';
import RegisterSection from '../components/RegisterSection';
import { PricingSection } from '../components/ui/pricing-section';
import { GraduationCap, ShieldCheck } from 'lucide-react';

const tiers = [
  {
    name: "Apprentice Plan",
    price: {
      monthly: 3500, // Annual Installment
      yearly: 9000,   // One-Time Payment
    },
    description: "Choose the payment plan that works best for you and your team.",
    icon: <GraduationCap className="w-7 h-7" />,
    features: [
      { name: "Full 3-Year Program Access", included: true },
      { name: "DOL Journeyperson Credential", included: true },
      { name: "Weekly Instructor-Led Training", included: true },
      { name: "All Digital Learning Materials", included: true },
    ],
    highlight: true,
    badge: "Save $1,500",
  },
  {
    name: "Mentor Plan",
    price: {
      monthly: 1500, // Annual Installment
      yearly: 3000,   // One-Time Payment
    },
    description: "Choose the payment plan that works best for you and your team.",
    icon: <ShieldCheck className="w-7 h-7" />,
    features: [
      { name: "Full 3-Year Program Access", included: true },
      { name: "Weekly Instructor-Led Training", included: true },
      { name: "All Digital Learning Materials", included: true },
      { name: "Network with a Community of Industry Experts", included: true }, // Changed feature
    ],
    badge: "Save $1,500",
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-sm">
      <div className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4 max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Join an Upcoming Cohort
            </span>
          </h1>
          <p className="text-slate-600 text-lg">
            Register now to start your journey toward becoming a Department of Labor Credentialed Journeyman Saw Filer. 
            Choose an available cohort below or register your interest for future programs.
          </p>
        </motion.div>
        <RegisterSection />
        <PricingSection 
          tiers={tiers}
          title="Program Investment"
          description="Choose the payment plan that works best for you and your team."
          billingPeriodLabels={{ monthly: 'Annual Installments', yearly: 'One-Time Payment' }}
          billingFrequencyLabels={{ monthly: 'per year (total: $10,500 for Apprentice, $4,500 for Mentor)', yearly: 'total (save $1,500)' }}
        />
      </div>
    </div>
  );
}
