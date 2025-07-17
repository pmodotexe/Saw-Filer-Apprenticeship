import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { ShimmerButton } from './ui/ShimmerButton';
import { Cohort } from '@/api/entities';

const statusConfig = {
  open: {
    label: (seats) => `${seats} Available`,
    cardClass: 'bg-gray-50 border-gray-200 hover:border-blue-300',
    labelClass: 'bg-green-100 text-green-800'
  },
  full: {
    label: () => 'NO SEATS AVAILABLE',
    cardClass: 'bg-red-50 border-red-200 hover:border-red-300',
    labelClass: 'bg-red-100 text-red-800'
  },
  closed: {
    label: () => 'REGISTRATION CLOSED',
    cardClass: 'bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed',
    labelClass: 'bg-gray-200 text-gray-700'
  }
};

export default function RegisterSection() {
  const [cohorts, setCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCohorts = async () => {
      setIsLoading(true);
      try {
        const fetchedCohorts = await Cohort.list('-cohortNumber');
        setCohorts(fetchedCohorts);
      } catch (error) {
        console.error("Failed to fetch cohorts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCohorts();
  }, []);

  const handleRegisterClick = () => {
    window.open('https://app.smartsheet.com/b/form/8316a4445300487cbf556d013b0e6fc1', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Register
              </span>
            </h2>
            
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-800">
                Upcoming Cohorts
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Can't join the upcoming cohort? Don't worry we have other upcoming opportunities 
                to register and start your journey toward becoming a Department of Labor 
                Credentialed Journeyman Saw Filer.
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <ShimmerButton
                  background="linear-gradient(to right, #3b82f6, #6366f1)"
                  className="px-10 py-4 font-semibold shadow-lg hover:shadow-blue-500/25"
                  onClick={handleRegisterClick}
                >
                  REGISTER NOW
                </ShimmerButton>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              cohorts.map((cohort, index) => {
                const config = statusConfig[cohort.status] || statusConfig.closed;
                return (
                  <motion.div
                    key={cohort.id}
                    onClick={() => cohort.status !== 'closed' && handleRegisterClick()}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={cohort.status !== 'closed' ? { 
                      scale: 1.02, 
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    } : {}}
                    whileTap={cohort.status !== 'closed' ? { scale: 0.98 } : {}}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    viewport={{ once: true }}
                    className={`rounded-2xl p-6 border transition-all duration-300 shadow-md ${config.cardClass} ${cohort.status !== 'closed' ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-slate-800">
                        Cohort #{cohort.cohortNumber}
                      </h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${config.labelClass}`}>
                        {config.label(cohort.seatsAvailable)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-500">
                        <Calendar className="w-5 h-5" />
                        <span>{cohort.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <Clock className="w-5 h-5" />
                        <span>{cohort.time}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}