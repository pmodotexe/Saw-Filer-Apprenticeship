
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ApprenticePortal() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'SFA2021') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isAuthenticated) {
    return (
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <div className="flex justify-center mb-6"><div className="p-4 bg-green-100 rounded-full"><CheckCircle className="w-16 h-16 text-green-600" /></div></div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6"><span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Welcome</span></h2>
            <p className="text-slate-600 text-lg">Access granted to the Apprentice Portal</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="bg-white border border-gray-200 rounded-3xl p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6"><h3 className="text-xl font-bold text-slate-800 mb-4">Course Materials</h3><p className="text-slate-600 mb-4">Access your learning materials and resources</p><Button className="w-full bg-blue-600 hover:bg-blue-700">View Materials</Button></div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6"><h3 className="text-xl font-bold text-slate-800 mb-4">Progress Tracking</h3><p className="text-slate-600 mb-4">Monitor your learning progress and achievements</p><Button className="w-full bg-blue-600 hover:bg-blue-700">View Progress</Button></div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6"><h3 className="text-xl font-bold text-slate-800 mb-4">Assessments</h3><p className="text-slate-600 mb-4">Complete assignments and track your scores</p><Button className="w-full bg-blue-600 hover:bg-blue-700">View Assessments</Button></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-md mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="flex justify-center mb-6"><div className="p-4 bg-blue-100 rounded-full"><Shield className="w-16 h-16 text-blue-600" /></div></div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"><span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Apprentice Portal</span></h2>
          <p className="text-slate-600 text-lg">Enter your access code to continue</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 pointer-events-none" />
              <Input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter access code" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="pl-12 pr-12 bg-white border-gray-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30" 
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm text-center">{error}</motion.div>)}
            <Button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">Access Portal</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
