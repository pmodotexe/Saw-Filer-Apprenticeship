
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { LogosCarousel } from './logos-carousel';

const testimonials = [
  {
    name: "Filing Team",
    role: "Apprentices, Major Lumber Producer",
    company: "Major Lumber Producer",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a5cea929e_person-icon-png-transparent-21.jpg",
    rating: 5,
    text: "By using lessons from the program, we improved communication with management about quality control. Showing them the cost of not having a metal detector resulted in a new one being approved. The detector cost $60,000 but is saving approximately $80,000 a year in saw repairs.",
    results: ["$80K Annual Savings", "Secured $60K Investment", "Improved Mgmt. Communication"]
  },
  {
    name: "M. Thompson",
    role: "Mill Manager, Western Sawmill Operations",
    company: "Western Sawmill Operations",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/76c094b87_person-icon-png-transparent-13.jpg",
    rating: 5,
    text: "The program transformed our filing department's approach to maintenance and cost control. Our apprentices now proactively identify issues before they become expensive problems. We've seen a 35% reduction in unscheduled downtime and our saw life has increased by 40%.",
    results: ["35% Less Downtime", "40% Longer Saw Life", "Proactive Maintenance Culture"]
  },
  {
    name: "Filing Department",
    role: "Production Team, Midwest Mill",
    company: "Midwest Mill",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a5cea929e_person-icon-png-transparent-21.jpg",
    rating: 5,
    text: "The figure eight bead welding technique has been a significant game changer. It creates a more sound weld and smoother finish which creates better work flow and less issues with breakage. We've reduced our saw replacement costs by thousands of dollars monthly.",
    results: ["Superior Weld Quality", "Reduced Breakage Issues", "Monthly Cost Savings"]
  },
  {
    name: "C. Caldwell",
    role: "Apprentice Filer, Southeastern US Mill",
    company: "Southeastern US Mill",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/76c094b87_person-icon-png-transparent-13.jpg",
    rating: 5,
    text: "One thing I learned was how to properly set up our oxy-acetylene torch. In class we talked about just cracking the acetylene tank open... this simple 'common sense' wasn't happening prior. This came in handy when we had a surprise OSHA inspection. Because of our class we are safer, and we also did better on our inspection.",
    results: ["Improved OSHA Inspection", "Enhanced Workplace Safety", "Corrected Unsafe Practices"]
  },
  {
    name: "R. Martinez",
    role: "Operations Manager, Southern Pine Mill",
    company: "Southern Pine Mill",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/76c094b87_person-icon-png-transparent-13.jpg",
    rating: 5,
    text: "Implementing 5S principles from the program has revolutionized our filing shop organization. We removed clutter, installed proper storage systems, and created standardized procedures. Our efficiency has improved by 25% and we've eliminated waste in parts inventory management.",
    results: ["25% Efficiency Improvement", "Eliminated Inventory Waste", "Standardized Procedures"]
  },
  {
    name: "A Filing Team",
    role: "Filing Team, North American Producer",
    company: "North American Producer",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a5cea929e_person-icon-png-transparent-21.jpg",
    rating: 5,
    text: "We started tracking all our saw changes, use, and issues and added those to our weekly site communications meetings. This has given transparency of the filing department to the site leaders which has allowed us opportunities for improvements in the shop and helps when new filers come into the shop.",
    results: ["Greater Site-Wide Transparency", "Better New Filer Onboarding", "Data-Driven Improvements"]
  },
  {
    name: "D. Johnson",
    role: "Head Filer, Hardwood Processing Facility",
    company: "Hardwood Processing Facility",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/76c094b87_person-icon-png-transparent-13.jpg",
    rating: 5,
    text: "The program taught me the scientific reasons behind our practices. Now I can explain to management and new hires WHY we use certain grinding wheels and hook angles. This has improved our supplier negotiations and reduced trial-and-error costs by 60%.",
    results: ["60% Less Trial & Error", "Better Supplier Negotiations", "Knowledge-Based Decisions"]
  },
  {
    name: "K. Anderson",
    role: "Plant Supervisor, Pacific Coast Mill",
    company: "Pacific Coast Mill",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/76c094b87_person-icon-png-transparent-13.jpg",
    rating: 5,
    text: "The apprenticeship program shifted our focus from productivity to reliability with safety. Understanding that more productivity comes from reliable equipment has transformed our maintenance philosophy. We've achieved 20% higher throughput with the same crew size.",
    results: ["20% Higher Throughput", "Same Crew Size", "Reliability-Focused Culture"]
  },
  {
    name: "S. Parker",
    role: "Filing Supervisor, Eastern Lumber Co.",
    company: "Eastern Lumber Co.",
    avatar: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/76c094b87_person-icon-png-transparent-13.jpg",
    rating: 5,
    text: "5S implementation has been transformative. Tools are organized, equipment is labeled, and workflow is smoother. We've cut our setup times in half and eliminated the chaos that used to slow down production. Employee satisfaction has noticeably improved.",
    results: ["50% Faster Setup Times", "Eliminated Production Chaos", "Higher Employee Satisfaction"]
  }
];

export function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.23, 0.86, 0.39, 0.96] 
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative py-32 bg-white/20 backdrop-blur-sm text-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/10 to-blue-50/30"></div>
      
      <motion.div 
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.4] border border-white/[0.6] backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05, borderColor: "rgba(255, 255, 255, 0.8)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-blue-600" />
            </motion.div>
            <span className="text-sm font-medium text-slate-700">
              Partner Success Stories
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>

          <motion.h2 
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tight"
            variants={fadeInUp}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Building a Skilled
            </span>
            <br />
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Future, Together
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Our program is built on strong partnerships with industry leaders who are committed to excellence and workforce development.
          </motion.p>
        </motion.div>

        {/* Logos Carousel - Now positioned here */}
        <LogosCarouselWrapper />

        {/* Main Testimonial Display */}
        <div className="relative max-w-6xl mx-auto mb-24 mt-20">
          <div className="relative h-[500px] md:h-[400px] [perspective:1000px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 }
                }}
                className="absolute inset-0"
              >
                <div className="relative h-full bg-gradient-to-br from-white/[0.6] to-white/[0.4] backdrop-blur-xl rounded-3xl border border-white/[0.8] p-8 md:p-12 overflow-hidden group shadow-xl">
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-sky-500/[0.05] to-indigo-500/[0.08] rounded-3xl"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '300% 300%'
                    }}
                  />

                  <Quote className="absolute top-8 right-8 w-16 h-16 text-slate-300/50" />

                  <div className="relative z-10 h-full flex flex-col md:flex-row items-center gap-8">
                    {/* User Info */}
                    <div className="flex-shrink-0 text-center md:text-left">
                      <motion.div
                        className="relative mb-6"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-24 h-24 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white/40 relative shadow-lg">
                          <img 
                            src={testimonials[currentIndex].avatar} 
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-blue-600 mb-4 font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                      
                      <div className="flex justify-center md:justify-start gap-1 mb-6">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                          >
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <motion.blockquote 
                        className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 font-light italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        "{testimonials[currentIndex].text}"
                      </motion.blockquote>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {testimonials[currentIndex].results.map((result, i) => (
                          <motion.div
                            key={i}
                            className="bg-white/[0.4] rounded-lg p-3 border border-white/[0.6] backdrop-blur-sm shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                          >
                            <span className="text-sm text-slate-600 font-medium">
                              {result}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <motion.button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white/[0.4] border border-white/[0.6] backdrop-blur-sm text-slate-600 hover:bg-white/[0.6] transition-all shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-slate-400 hover:bg-slate-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white/[0.4] border border-white/[0.6] backdrop-blur-sm text-slate-600 hover:bg-white/[0.6] transition-all shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
      </motion.div>
    </section>
  );
}

const LogosCarouselWrapper = () => {
  const companyLogos = [
    { id: "apprenticeship-usa", description: "ApprenticeshipUSA", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e42da17ed_apprenticshipusa-departmentoflabor.png" },
    { id: "canfor", description: "Canfor", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f96711d23_canfor1.png" },
    { id: "interfor", description: "Interfor", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7e32a84da_Interfor-logo-2011.png" },
    { id: "langdale", description: "Langdale Forest Products", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3e24b6d53_logo_forest_products_blue.png" },
    { id: "northcentral", description: "Northcentral Technical College", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/4032f84ec_ntc-w550.png" },
    { id: "socomi", description: "SOCOMI", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/88cb33198_SOCOMI.png" },
    { id: "thompson-appalachian", description: "Thompson Appalachian Hardwoods", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/87dce020b_thompson-appalachian-logo.png" },
    { id: "weyerhaeuser", description: "Weyerhaeuser", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f49bff720_Weyerhauser.png" },
    { id: "harrigan", description: "Harrigan Lumber Company", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/122967ed2_harrigan.png" },
    { id: "slma", description: "SLMA", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5bad57ad_slma-logo.png" },
    { id: "west-fraser", description: "West Fraser", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/ea4f9e7c8_WestFraser_standard_348green.png" },
  ];

  return (
    <div className="bg-white/60 rounded-2xl py-8 backdrop-blur-sm border border-white/40 shadow-lg">
      <LogosCarousel
        logos={companyLogos}
      />
    </div>
  );
};
