
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Home, 
  Calculator, 
  GraduationCap, 
  MessageCircle, 
  Menu,
  X,
  ChevronUp,
  User,
  BookOpen,
  Phone,
  Info
} from 'lucide-react';

const mainNavItems = [
  {
    name: 'Home',
    href: createPageUrl('Home'),
    icon: Home,
    color: 'text-blue-600'
  },
  {
    name: 'Calculator',
    href: createPageUrl('Calculator'),
    icon: Calculator,
    color: 'text-green-600'
  },
  {
    name: 'Portal',
    href: createPageUrl('ApprenticePortal'),
    icon: GraduationCap,
    color: 'text-purple-600'
  },
  {
    name: 'Social',
    href: createPageUrl('SawdustSocial'),
    icon: MessageCircle,
    color: 'text-orange-600'
  }
];

const moreMenuItems = [
  {
    name: 'Learn & Engage',
    href: createPageUrl('LearnEngage'),
    icon: BookOpen,
    color: 'text-indigo-600'
  },
  {
    name: 'Register',
    href: createPageUrl('Register'),
    icon: User,
    color: 'text-cyan-600'
  },
  {
    name: 'About',
    href: createPageUrl('About'),
    icon: Info,
    color: 'text-teal-600'
  },
  {
    name: 'Contact',
    href: `${createPageUrl('Home')}#contact`,
    icon: Phone,
    color: 'text-pink-600'
  }
];

export default function BottomNavigation() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  const isActive = (href) => {
    if (href === createPageUrl('Home')) {
      return location.pathname === '/' || location.pathname === '/Home';
    }
    return location.pathname === href.replace(createPageUrl(''), '/');
  };

  const toggleMore = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  return (
    <>
      {/* Bottom Navigation - Only show on mobile/tablet */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
        {/* More Menu Overlay */}
        <AnimatePresence>
          {isMoreOpen && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg"
            >
              <div className="grid grid-cols-2 gap-1 p-4">
                {moreMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className={`w-6 h-6 mb-2 ${item.color}`} />
                    <span className="text-xs font-medium text-gray-700">{item.name}</span>
                  </Link>
                ))}
              </div>
              
              {/* Close Button */}
              <div className="flex justify-center pb-2">
                <button
                  onClick={toggleMore}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {mainNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
                >
                  <motion.div
                    className={`flex flex-col items-center justify-center transition-all duration-300 ${
                      active ? 'transform -translate-y-1' : ''
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`p-2 rounded-full transition-all duration-300 ${
                        active 
                          ? 'bg-blue-100 shadow-lg' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <item.icon 
                        className={`w-6 h-6 transition-colors duration-300 ${
                          active ? item.color : 'text-gray-500'
                        }`} 
                      />
                    </div>
                    <span 
                      className={`text-xs font-medium mt-1 transition-colors duration-300 ${
                        active ? item.color : 'text-gray-500'
                      }`}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                  
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 w-2 h-2 bg-blue-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            
            {/* More Button */}
            <button
              onClick={toggleMore}
              className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              <motion.div
                className={`flex flex-col items-center justify-center transition-all duration-300 ${
                  isMoreOpen ? 'transform -translate-y-1' : ''
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: isMoreOpen ? 180 : 0 }}
              >
                <div
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isMoreOpen 
                      ? 'bg-gray-200 shadow-lg' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {isMoreOpen ? (
                    <X className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <span 
                  className={`text-xs font-medium mt-1 transition-colors duration-300 ${
                    isMoreOpen ? 'text-gray-600' : 'text-gray-500'
                  }`}
                >
                  More
                </span>
              </motion.div>
              
              {/* Active Indicator */}
              {isMoreOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 w-2 h-2 bg-gray-600 rounded-full"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
