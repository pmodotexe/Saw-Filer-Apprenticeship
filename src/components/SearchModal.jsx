
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Hash, FileText, Calculator, User, File } from 'lucide-react';
import { searchableContent } from './lib/searchData';
import { Link } from 'react-router-dom';

const categoryIcons = {
  FAQ: <Hash className="w-5 h-5 text-purple-500" />,
  Page: <File className="w-5 h-5 text-blue-500" />,
  Expert: <User className="w-5 h-5 text-red-500" />,
  Calculator: <Calculator className="w-5 h-5 text-green-500" />,
  Book: <FileText className="w-5 h-5 text-yellow-600" />,
  Article: <FileText className="w-5 h-5 text-orange-500" />,
  Default: <FileText className="w-5 h-5 text-gray-500" />,
};

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const flatResultsRef = useRef([]); // To hold a flat list of all items for keyboard navigation

  const handleSearch = useCallback((searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredResults = searchableContent.filter(item =>
      item.title.toLowerCase().includes(lowerCaseQuery) ||
      item.content.toLowerCase().includes(lowerCaseQuery) ||
      item.category.toLowerCase().includes(lowerCaseQuery)
    );
    setResults(filteredResults);
  }, []);

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  // Focus input and reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setQuery('');
        setResults([]);
        setSelectedIndex(-1); // Reset selected index
      }, 300); // Wait for modal to close before clearing
    } else {
      inputRef.current?.focus(); // Focus input when modal opens
      setSelectedIndex(-1); // Reset selected index when modal opens
    }
  }, [isOpen]);

  // Derive groupedResults
  const groupedResults = useMemo(() => {
    if (!results.length) return {};
    return results.reduce((acc, item) => {
      const category = item.category || 'Default'; // Ensure a default category for items without one
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [results]);

  // Flatten results for keyboard navigation and store original indices
  useEffect(() => {
    const flat = [];
    Object.keys(groupedResults).forEach(category => {
      groupedResults[category].forEach(item => {
        flat.push(item);
      });
    });
    flatResultsRef.current = flat;
    setSelectedIndex(-1); // Reset selection when grouped results change
  }, [groupedResults]);

  // Keyboard navigation logic
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const totalItems = flatResultsRef.current.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        if (selectedIndex !== -1 && totalItems > 0) {
          e.preventDefault();
          const selectedItem = flatResultsRef.current[selectedIndex];
          if (selectedItem) {
            // Programmatically click the link
            const linkElement = document.querySelector(`a[href="${selectedItem.href}"]`);
            linkElement?.click();
            onClose(); // Close modal after navigating
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, onClose, flatResultsRef]);

  // Utility to highlight search query in text
  const highlightMatch = useCallback((text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 text-black rounded-sm px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  }, []);

  // Helper to get flat index for conditional styling based on grouped results
  const getItemIndex = useCallback((currentCategory, currentItemIndex) => {
    let flatIndex = 0;
    const categories = Object.keys(groupedResults);
    for (const category of categories) {
      if (category === currentCategory) {
        return flatIndex + currentItemIndex;
      }
      flatIndex += groupedResults[category].length;
    }
    return -1; // Should not happen if logic is correct
  }, [groupedResults]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-lg outline-none placeholder:text-gray-400"
              />
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-96">
              {query.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Search the site</p>
                  <p className="text-sm">Find FAQs, calculators, literature, and more</p>
                </div>
              ) : results.length === 0 ? ( // Check results.length for no results when query is active
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg font-medium mb-2">No results found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="p-2">
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {categoryIcons[category] || categoryIcons.Default}
                        {category}s
                      </div>
                      {items.map((item, index) => (
                        <Link
                          key={item.id}
                          to={item.href}
                          onClick={onClose}
                          className="block"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-3 mx-1 rounded-lg transition-colors cursor-pointer ${
                              selectedIndex === getItemIndex(category, index) ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50'
                            }`}
                          >
                            <h3 className="font-medium text-gray-900 mb-1">
                              {highlightMatch(item.title, query)}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {highlightMatch(item.content, query)}
                            </p>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* The 'Powered by base44' footer div has been removed */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
