import React from "react";
import { motion } from "framer-motion";

const LogosCarousel = ({
  logos = [],
  className = "",
}) => {
  // Triple the logos for truly seamless infinite scroll
  const infiniteLogos = [...logos, ...logos, ...logos];

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <motion.div
            className="flex items-center space-x-16"
            animate={{
              x: [0, `-${100 / 3}%`],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            style={{ width: '300%' }}
          >
            {infiniteLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-20 px-8"
              >
                <img
                  src={logo.image}
                  alt={logo.description}
                  className="h-14 max-w-40 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  style={{ filter: 'grayscale(100%)' }}
                  onMouseEnter={(e) => e.target.style.filter = 'grayscale(0%)'}
                  onMouseLeave={(e) => e.target.style.filter = 'grayscale(100%)'}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { LogosCarousel };