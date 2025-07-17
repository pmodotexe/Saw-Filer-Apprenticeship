import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => onLoadComplete(), 800);
          return 100;
        }
        // Calculate increment to ensure we don't go over 100
        const remaining = 100 - prev;
        const increment = Math.min(Math.random() * 8 + 2, remaining);
        return prev + increment;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.8, delay: isComplete ? 0.2 : 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5ea9e8f9_4b166bb8-6fcd-4789-aa92-a5b103590f60.png"
            alt="Saw Filer Apprenticeship Logo"
            className="w-48 h-48 mx-auto"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <div className="w-80 mx-auto">
          <div className="bg-gray-200/20 backdrop-blur-sm rounded-full p-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-black text-sm mt-4 font-medium"
          >
            Closing The Skills Gap... {Math.min(Math.round(progress), 100)}%
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}