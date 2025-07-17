

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import BottomNavigation from './components/BottomNavigation';

export default function Layout({ children, currentPageName }) {
  const [isLoading, setIsLoading] = useState(() => {
    // Check if the loading screen has already been shown in this session
    return !sessionStorage.getItem('loadingScreenShown');
  });
  const location = useLocation();

  // Check if we're on SawdustSocial page
  const isSawdustSocial = currentPageName === 'SawdustSocial';
  
  // Check if we're on login pages (ApprenticePortal or SawdustSocial login)
  const isLoginPage = currentPageName === 'ApprenticePortal' || currentPageName === 'SawdustSocial';

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Mark that the loading screen has been shown for this session
    sessionStorage.setItem('loadingScreenShown', 'true');
  };

  useEffect(() => {
    // Scroll to section if hash exists, otherwise scroll to top
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a timeout to ensure the page has rendered before scrolling
        setTimeout(() => {
          const headerOffset = 80; // Height of the fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      // If no hash, scroll to top on page change
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);


  useEffect(() => {
    // Add Aurora animation styles for all pages
    const style = document.createElement('style');
    style.id = 'aurora-styles';
    style.textContent = `
      :root {
        --white: #ffffff;
        --black: #000000;
        --transparent: transparent;
        --blue-500: #3b82f6;
        --indigo-300: #a5b4fc;
        --blue-300: #93c5fd;
        --violet-200: #ddd6fe;
        --blue-400: #60a5fa;
        --cyan-400: #22d3ee;
        --purple-400: #c084fc;
        --pink-300: #f9a8d4;
        --zinc-50: #fafafa;
        --zinc-900: #18181b;
      }

      @keyframes aurora {
        from {
          background-position: 50% 50%, 50% 50%;
        }
        to {
          background-position: 350% 50%, 350% 50%;
        }
      }

      @keyframes shimmer-slide {
        0% { 
          transform: translateX(-100%); 
        }
        100% { 
          transform: translateX(100%); 
        }
      }

      @keyframes shimmer {
        0% { 
          background-position: -200% 0;
        }
        100% { 
          background-position: 200% 0;
        }
      }

      @keyframes spin-around {
        0% { 
          transform: rotate(0deg); 
        }
        100% { 
          transform: rotate(360deg); 
        }
      }

      .animate-aurora {
        animation: aurora 60s linear infinite;
      }

      .animate-shimmer-slide {
        animation: shimmer-slide var(--speed, 3s) ease-in-out infinite;
      }
      
      .animate-shimmer {
        background-size: 200% 100%;
        background-repeat: no-repeat;
        animation: shimmer 1.5s infinite linear;
      }

      .animate-spin-around {
        animation: spin-around calc(var(--speed, 3s) * 2) linear infinite;
      }

      /* Aurora background animation classes */
      .aurora-background {
        --white-gradient: repeating-linear-gradient(100deg,var(--white) 0%,var(--white) 7%,var(--transparent) 10%,var(--transparent) 12%,var(--white) 16%);
        --dark-gradient: repeating-linear-gradient(100deg,var(--black) 0%,var(--black) 7%,var(--transparent) 10%,var(--transparent) 12%,var(--black) 16%);
        --aurora: repeating-linear-gradient(100deg,var(--cyan-400) 10%,var(--blue-500) 15%,var(--indigo-300) 20%,var(--purple-400) 25%,var(--pink-300) 30%);
        
        background-image: var(--white-gradient), var(--aurora);
        background-size: 300% 200%;
        background-position: 50% 50%, 50% 50%;
        filter: blur(10px);
        opacity: 0.5;
        position: absolute;
        inset: -10px;
        pointer-events: none;
        will-change: transform;
        mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
      }

      .aurora-background::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: var(--white-gradient), var(--aurora);
        background-size: 200% 100%;
        background-attachment: fixed;
        mix-blend-mode: screen;
        animation: aurora 60s linear infinite;
        pointer-events: none;
      }

      /* Dark mode support */
      .dark .aurora-background {
        background-image: var(--dark-gradient), var(--aurora);
      }

      .dark .aurora-background::after {
        background-image: var(--dark-gradient), var(--aurora);
      }

      /* Tailwind breakpoints for better mobile support */
      @media (max-width: 475px) {
        .xs\\:text-3xl {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('aurora-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  return (
    <div className="min-h-screen text-slate-800 overflow-x-hidden relative">
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}

      {/* Fixed Aurora Background - only show when not on SawdustSocial */}
      {!isSawdustSocial && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="aurora-background"></div>
          </div>
        </div>
      )}
      
      <div className className={`transition-opacity duration-500 relative z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Hide header on mobile for SawdustSocial */}
        {!(isSawdustSocial) && <Header />}
        
        <main className={`${isLoginPage ? '' : 'pt-20'} ${!isSawdustSocial ? 'pb-20 md:pb-0' : ''}`}>
          {children}
        </main>
        
        {/* Hide footer on mobile for login pages, hide completely for SawdustSocial */}
        {!isSawdustSocial && (
          <div className={isLoginPage ? 'hidden md:block' : 'block'}>
            <Footer />
          </div>
        )}
        
        {/* Bottom nav is now enabled for all pages on mobile, except SawdustSocial */}
        {!isSawdustSocial && <BottomNavigation />}
      </div>
    </div>
  );
}

