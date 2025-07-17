
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SearchModal from './SearchModal';

const navLinks = [
  { name: 'Home', href: '/', isPage: true, sectionId: 'hero' },
  { name: 'Register', href: '/Register', isPage: true },
  {
    name: 'Learn & Engage',
    href: '/LearnEngage',
    isPage: true,
    children: [
      { name: 'About', href: '/About', isPage: true },
      { name: 'Lumber Library', href: '/LearnEngage#lumber-library', isPage: false },
      { name: 'Redwood Roundtable', href: '/LearnEngage#redwood-table', isPage: false }
    ]
  },
  { name: 'Contact', href: '/#contact', isPage: false, sectionId: 'contact' },
  {
    name: 'Apprentice Portal',
    href: '/ApprenticePortal',
    isPage: true,
    children: [
      { name: 'Sawdust Social', href: '/SawdustSocial', isPage: true }
    ]
  }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]); // New state for mobile collapsed items
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Call once on mount to check initial scroll position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setExpandedItems([]); // Reset expanded items when menu closes
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setHoveredIndex(null);
    setExpandedItems([]);
  }

  const toggleExpanded = (index) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link
                to={createPageUrl('Home')}
                className="flex items-center gap-3 text-xl font-bold"
              >
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5ea9e8f9_4b166bb8-6fcd-4789-aa92-a5b103590f60.png"
                  alt="SFA Logo"
                  className="h-16 w-16"
                />
              </Link>
            </div>
            <div className="hidden md:block">
              <nav className="flex items-center space-x-1">
                {navLinks.map((link, index) => (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      to={link.isPage ? createPageUrl(link.href.replace('/', '')) : link.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-md"
                    >
                      {link.name}
                      {link.children && <ChevronDown className="w-4 h-4" />}
                    </Link>
                    <AnimatePresence>
                      {hoveredIndex === index && link.children && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max"
                        >
                          <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-lg p-2">
                            {link.children.map(childLink => (
                              <Link
                                key={childLink.name}
                                to={childLink.isPage ? createPageUrl(childLink.href.replace('/', '')) : childLink.href}
                                onClick={handleLinkClick}
                                className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-md transition-colors"
                              >
                                {childLink.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-md text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 border border-transparent hover:border-gray-200"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                   <div className="hidden lg:flex items-center gap-1 text-xs text-slate-400">
                    <kbd className="font-sans">⌘</kbd>
                    <kbd className="font-sans">K</kbd>
                  </div>
                </button>
              </nav>
            </div>
            <div className="md:hidden flex items-center gap-2">
               <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-gray-100"
                >
                  <Search className="w-6 h-6" />
              </button>
              <button onClick={toggleMenu} className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-gray-100">
                  <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={toggleMenu}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-6">
                <button onClick={toggleMenu} className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-gray-100">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="px-4 pb-8">
                {navLinks.map((link, i) => (
                  <div key={link.name} className="mb-2">
                    <motion.div
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex items-center justify-between"
                    >
                      {link.children ? (
                        <button
                          onClick={() => toggleExpanded(i)}
                          className="flex items-center justify-between w-full text-left text-lg font-semibold text-slate-700 hover:text-blue-600 py-3 px-2 rounded-md hover:bg-gray-50"
                        >
                          <span>{link.name}</span>
                          <motion.div
                            animate={{ rotate: expandedItems.includes(i) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </button>
                      ) : (
                        <Link
                          to={link.isPage ? createPageUrl(link.href.replace('/', '')) : link.href}
                          className="block w-full text-lg font-semibold text-slate-700 hover:text-blue-600 py-3 px-2 rounded-md hover:bg-gray-50"
                          onClick={handleLinkClick}
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.div>
                    
                    <AnimatePresence>
                      {link.children && expandedItems.includes(i) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 space-y-1 pt-2">
                            {link.children.map((childLink, childIndex) => (
                              <motion.div
                                key={childLink.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: childIndex * 0.05 }}
                              >
                                <Link
                                  to={childLink.isPage ? createPageUrl(childLink.href.replace('/', '')) : childLink.href}
                                  className="block text-base font-medium text-slate-500 hover:text-blue-600 py-2 px-2 rounded-md hover:bg-gray-50"
                                  onClick={handleLinkClick}
                                >
                                  {childLink.name}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
