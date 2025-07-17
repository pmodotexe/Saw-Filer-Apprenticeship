
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    Briefcase, UserCog, Building, DollarSign, Users, Award,
    Wrench, Scale, Hammer, Shield, GitBranch, Search, History, Cpu, Globe,
    Zap, Handshake, TrendingDown, TimerOff, Activity, ShieldCheck, BookOpen, 
    Target, Eye, Cog, CheckCircle, ArrowRight, Play, ChevronDown, ChevronUp, ChevronRight,
    GraduationCap, TrendingUp, MapPin, Clock, Star
} from 'lucide-react';

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const AboutCard = ({ icon, title, children }) => (
  <motion.div
    variants={cardVariants}
    className="bg-white/50 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg h-full"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
    </div>
    <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
  </motion.div>
);

// Interactive Hero Slider for Apprenticeship
const ApprenticeshipHero = () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
            name: "Marcus Johnson",
            stat: "$45K First-Year Earnings",
            description: "From zero experience to skilled craftsman"
        },
        {
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
            name: "Sarah Chen",
            stat: "100% Hands-On Training",
            description: "Real tools, real problems, real solutions"
        },
        {
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop",
            name: "David Rodriguez",
            stat: "$3 Return on Every $1 Invested",
            description: "Training that pays for itself"
        }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl overflow-hidden min-h-[500px] flex items-center">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            
            {/* Background Slider */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${slides[currentSlide].image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </AnimatePresence>

            <div className="relative z-20 w-full px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        Earn Today, <span className="text-yellow-400">Expert Tomorrow</span>
                    </motion.h2>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <p className="text-3xl font-bold text-yellow-400 mb-2">
                                {slides[currentSlide].stat}
                            </p>
                            <p className="text-xl text-blue-200">
                                {slides[currentSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-3 mb-8">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Flip Cards for Benefits
const BenefitCard = ({ icon, title, description, details, index }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="h-64 perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
                        {React.cloneElement(icon, { className: 'w-8 h-8' })}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                    <p className="text-slate-600 text-sm">{description}</p>
                </div>
                
                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 text-white rounded-2xl p-6 flex flex-col justify-center text-center shadow-lg">
                    <h3 className="text-xl font-bold mb-4">{title}</h3>
                    <p className="text-sm leading-relaxed">{details}</p>
                </div>
            </div>
        </motion.div>
    );
};

// ROI Calculator
const ROICalculator = () => {
    const [years, setYears] = React.useState(3);
    
    const calculateROI = (years) => {
        const baseSalary = 35000;
        const yearlyIncrease = 8000;
        const trainingCost = 9000; // One-time payment for the whole program
        
        // Total earnings for a given number of years, considering yearly increase
        let totalEarnings = 0;
        for (let i = 0; i < years; i++) {
            totalEarnings += baseSalary + (yearlyIncrease * i);
        }

        const projectedSalary = baseSalary + (yearlyIncrease * (years - 1)); // Salary at the end of 'years'
        const netReturn = totalEarnings - trainingCost;
        
        // Calculate break-even point in months
        // This is a simplified calculation and assumes uniform monthly earnings
        let currentEarnings = 0;
        let months = 0;
        const monthlyBase = baseSalary / 12;
        const monthlyIncrease = yearlyIncrease / 12;

        while (currentEarnings < trainingCost) {
            months++;
            currentEarnings += monthlyBase + (monthlyIncrease * Math.floor((months - 1) / 12));
        }

        return {
            projectedSalary,
            totalEarnings,
            netReturn,
            breakEvenMonths: months,
            roi: ((netReturn / trainingCost) * 100).toFixed(0)
        };
    };

    const roi = calculateROI(years);

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">See Your Payoff</h3>
            
            <div className="mb-8 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-700">
                        <strong>Program Investment:</strong> $9,000 one-time payment for the complete 4-year apprenticeship program
                    </p>
                </div>
            </div>
            
            <div className="mb-8">
                <label htmlFor="years-slider" className="block text-slate-700 font-medium mb-3">
                    Years After Graduation: {years}
                </label>
                <input
                    id="years-slider"
                    type="range"
                    min="1"
                    max="10"
                    value={years}
                    onChange={(e) => setYears(parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-slate-500 mt-1">
                    <span>1 year</span>
                    <span>10 years</span>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                        ${roi.projectedSalary.toLocaleString()}
                    </div>
                    <div className="text-slate-600 text-sm">Annual Salary</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                        ${roi.totalEarnings.toLocaleString()}
                    </div>
                    <div className="text-slate-600 text-sm">Total Earnings</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                        ${roi.netReturn.toLocaleString()}
                    </div>
                    <div className="text-slate-600 text-sm">Net Return</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                        {roi.roi}%
                    </div>
                    <div className="text-slate-600 text-sm">ROI</div>
                </div>
            </div>

            <div className="text-center mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">
                        Break-even time: {roi.breakEvenMonths} months
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                        Your investment pays for itself in less than {Math.ceil(roi.breakEvenMonths / 12)} year{Math.ceil(roi.breakEvenMonths / 12) > 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500">
                    <strong>Disclaimer:</strong> Financial projections are estimates based on industry averages and may vary significantly depending on location, company, individual performance, and market conditions. Actual earnings and career progression may differ.
                </p>
            </div>
        </div>
    );
};

// Myth Buster Accordion
const MythBuster = () => {
    const [openIndex, setOpenIndex] = React.useState(null);
    
    const myths = [
        {
            myth: "It takes too long",
            truth: "You earn from day one and gain valuable skills every week. Most apprentices see career advancement within 18 months.",
            testimonial: "I was promoted twice in my first two years." // Removed " - Sarah M."
        },
        {
            myth: "I have no experience",
            truth: "That's exactly why apprenticeships exist! We start from the basics and build your expertise systematically.",
            testimonial: "I went from zero to confident professional." // Removed " - Mike T."
        },
        {
            myth: "It's not a real job",
            truth: "Apprentices are full employees with benefits, earning competitive wages while learning from industry experts.",
            testimonial: "I have better benefits than my college friends." // Removed " - Jessica L."
        }
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Apprenticeship Myths</h3>
            {myths.map((item, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-xl overflow-hidden shadow-lg">
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/20 transition-colors"
                        aria-expanded={openIndex === index}
                        aria-controls={`myth-content-${index}`}
                    >
                        <span className="font-semibold text-slate-800">"{item.myth}"</span>
                        {openIndex === index ? (
                            <ChevronUp className="w-5 h-5 transition-transform" />
                        ) : (
                            <ChevronDown className="w-5 h-5 transition-transform" />
                        )}
                    </button>
                    
                    <AnimatePresence>
                        {openIndex === index && (
                            <motion.div
                                id={`myth-content-${index}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-4">
                                    <p className="text-slate-600 mb-3">{item.truth}</p>
                                    <p className="text-blue-600 italic text-sm">"{item.testimonial}"</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

// Career Path Explorer
const CareerPathExplorer = () => {
    const [selectedYear, setSelectedYear] = React.useState(0);
    
    const pathway = [
        {
            year: "Year 1",
            title: "Foundational Apprentice",
            subtitle: "Hands-On Foundations",
            description: "Learn essential craft skills, safety protocols, and basic maintenance techniques through Reliability Solutions training.",
            salary: "$35,000 - $42,000"
        },
        {
            year: "Year 2-3",
            title: "Advanced Apprentice",
            subtitle: "Developing Expertise",
            description: "Master complex repairs, troubleshooting, and specialized equipment operation with continued Reliability Solutions curriculum.",
            salary: "$45,000 - $55,000"
        },
        {
            year: "Year 4",
            title: "Certified Journeyperson",
            subtitle: "Full Company Integration",
            description: "Complete your apprenticeship with full company integration, applying all learned skills and earning your DOL credential while being mentored by experienced professionals.",
            salary: "$55,000 - $65,000"
        },
        {
            year: "Year 4+",
            title: "Master Craftsman & Leader",
            subtitle: "Mastery & Mentorship",
            description: "Lead projects, train new apprentices, and drive operational improvements. Opportunities for management and specialization.",
            salary: "$60,000 - $75,000+"
        }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Your Journey</h3>
            
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-700">
                    <strong>Program Structure:</strong> 3 years of training with Reliability Solutions + 1 year of company-based on-the-job learning. All 4 years are oversighted by your sponsoring company.
                </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Timeline */}
                <div className="md:w-1/3 space-y-4">
                    {pathway.map((step, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedYear(index)}
                            className={`w-full text-left p-4 rounded-lg transition-all ${
                                selectedYear === index 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'bg-white/40 text-slate-700 hover:bg-white/60'
                            }`}
                        >
                            <div className="font-bold">{step.year}</div>
                            <div className="text-sm opacity-90">{step.title}</div>
                        </button>
                    ))}
                </div>
                
                {/* Content */}
                <div className="md:w-2/3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedYear}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h4 className="text-2xl font-bold text-slate-800 mb-2">
                                {pathway[selectedYear].title}
                            </h4>
                            <p className="text-blue-600 font-semibold mb-4">
                                {pathway[selectedYear].subtitle}
                            </p>
                            <p className="text-slate-600 mb-4">
                                {pathway[selectedYear].description}
                            </p>
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block mb-4">
                                <strong>Earning Potential: {pathway[selectedYear].salary}</strong>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
                                <p className="text-xs text-slate-500">
                                    <strong>Disclaimer:</strong> Earning potential is an estimate based on industry averages and may vary based on location, company, and individual performance.
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Video Testimonials
const VideoTestimonials = () => {
    const testimonials = [
        {
            name: "Alex Thompson",
            icon: <Users className="w-16 h-16 text-blue-600" />,
            quote: "Day 1: Nervous. Day 365: Confident professional.",
            role: "2nd Year Apprentice"
        },
        {
            name: "Maria Santos",
            icon: <GraduationCap className="w-16 h-16 text-green-600" />,
            quote: "From classroom theory to real-world mastery.",
            role: "Journeyperson"
        },
        {
            name: "David Kim",
            icon: <Award className="w-16 h-16 text-purple-600" />,
            quote: "Best career decision I ever made.",
            role: "Lead Filer"
        }
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-3xl font-bold text-center text-slate-800">Apprentice Voices</h3>
            <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((person, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-all"
                    >
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="mb-4">
                                {person.icon}
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg">{person.name}</h4>
                            <p className="text-blue-600 text-sm mb-3">{person.role}</p>
                            <p className="text-slate-600 italic">"{person.quote}"</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Sticky CTA Component
const StickyApplyBar = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const heroHeight = window.innerHeight; // Approximate height of the top hero section
            setIsVisible(window.scrollY > heroHeight / 2); // Show when scrolled past half of initial viewport
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 text-white p-4 shadow-lg"
                >
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="font-semibold text-center sm:text-left">Ready to Build a Skilled Career?</span>
                        <Link to={createPageUrl('Register')}>
                            <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
                                Apply for Apprenticeship
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const MissionPanel = ({ icon, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true }}
        className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg group hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02, y: -5 }}
    >
        <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4 group-hover:bg-blue-200 transition-colors">
            {React.cloneElement(icon, { className: 'w-8 h-8' })}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{description}</p>
        <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Learn More <ArrowRight className="w-4 h-4" />
        </button>
    </motion.div>
);

const ValueQuote = ({ icon, title, quote, story, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative bg-white/40 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-lg mb-8"
    >
        <div className="flex items-start gap-6">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full flex-shrink-0">
                {React.cloneElement(icon, { className: 'w-8 h-8' })}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{title}</h3>
                <blockquote className="text-xl text-slate-700 italic mb-4 font-medium">
                    "{quote}"
                </blockquote>
                <p className="text-slate-600 text-sm leading-relaxed">{story}</p>
            </div>
        </div>
    </motion.div>
);

const AnimatedCounter = ({ value, suffix, title, description, icon }) => {
    const [count, setCount] = React.useState(0);
    const [hasAnimated, setHasAnimated] = React.useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const end = parseFloat(value);
                    const duration = 2000;
                    const increment = end / (duration / 16);

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start * 10) / 10);
                        }
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );

        const element = document.getElementById(`counter-${title.replace(/\s+/g, '-')}`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, [value, title, hasAnimated]);

    return (
        <motion.div
            id={`counter-${title.replace(/\s+/g, '-')}`}
            variants={cardVariants}
            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl text-center border border-white/50 shadow-lg"
        >
            <div className="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-4">
                {React.cloneElement(icon, { className: 'w-8 h-8' })}
            </div>
            <h3 className="text-5xl font-bold text-slate-900 mb-2">
                {count.toFixed(value.includes('.') ? 1 : 0)}<span className="text-green-600">{suffix}</span>
            </h3>
            <h4 className="font-semibold text-slate-700 mb-2">{title}</h4>
            <p className="text-sm text-slate-600">{description}</p>
        </motion.div>
    );
};

// Interactive Timeline Slider for Origins & Evolution
const OriginsEvolution = () => {
    const [selectedEra, setSelectedEra] = React.useState(0);
    
    const eras = [
        {
            period: "Late 1700s-1800s",
            title: "Pre-Industrial Roots",
            description: "Craftsmen used rasps and files to sharpen each tooth by eye. Blades were carbon-steel; every cut reflected artisan skill.",
            motivation: "Your hands shaped the very edges of America's early timber frontier.",
            icon: <History className="w-8 h-8" />,
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="grid grid-cols-8 grid-rows-8 h-full">
                            {Array.from({ length: 64 }).map((_, i) => (
                                <div key={i} className="border border-amber-300/30" />
                            ))}
                        </div>
                    </div>
                    <div className="z-10 flex items-center gap-4">
                        <Hammer className="w-16 h-16 text-amber-700" />
                        <div className="w-1 h-20 bg-amber-600 rounded-full" />
                        <Wrench className="w-12 h-12 text-amber-600" />
                    </div>
                </div>
            )
        },
        {
            period: "1900s-1950s",
            title: "Steam & Electric Age",
            description: "Steam-powered mills demanded standardized tooth profiles. Introduction of templates, gauges, early power grinders.",
            motivation: "You stepped off the farm and into the heartbeat of manufacturing's golden era.",
            icon: <Zap className="w-8 h-8" />,
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-300 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-full bg-slate-400/20"
                                style={{ left: `${i * 16}%` }}
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                        ))}
                    </div>
                    <div className="z-10 flex items-center gap-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Cog className="w-20 h-20 text-slate-600" />
                        </motion.div>
                        <Zap className="w-16 h-16 text-yellow-500" />
                    </div>
                </div>
            )
        },
        {
            period: "1960s-1990s",
            title: "Metallurgy & Hardfacing",
            description: "Stellite and carbide tips extended blade life—saw filers became repair specialists. Welding cracks and re-profiling saved mills thousands per blade.",
            motivation: "A single weld you lay down could pay for your next car.",
            icon: <Shield className="w-8 h-8" />,
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0">
                        {/* Welding sparks effect */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                style={{ 
                                    top: `${50 + Math.sin(i) * 20}%`, 
                                    left: `${50 + Math.cos(i) * 25}%` 
                                }}
                                animate={{ 
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1.5, 0.5]
                                }}
                                transition={{ 
                                    duration: 0.8, 
                                    repeat: Infinity, 
                                    delay: i * 0.2 
                                }}
                            />
                        ))}
                    </div>
                    <div className="z-10 flex items-center gap-4">
                        <Shield className="w-16 h-16 text-blue-600" />
                        <motion.div
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="relative"
                        >
                            {/* Welding rod */}
                            <div className="w-12 h-2 bg-orange-500 rounded-full" />
                            <div className="absolute -top-1 right-0 w-3 h-4 bg-yellow-300 rounded-full opacity-80" />
                            {/* Sparks from welding */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                                    style={{ 
                                        top: `${-2 - i * 2}px`, 
                                        right: `${2 + i * 3}px` 
                                    }}
                                    animate={{ 
                                        opacity: [0, 1, 0],
                                        y: [-5, -15, -25]
                                    }}
                                    transition={{ 
                                        duration: 1, 
                                        repeat: Infinity, 
                                        delay: i * 0.3 
                                    }}
                                />
                            ))}
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="w-14 h-14 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-1 bg-blue-300 rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            )
        },
        {
            period: "2000s-Present",
            title: "Digital & CNC Revolution",
            description: "Programmable grinders, laser profiling, and auto-tensioners yield repeatable perfection. Data-driven diagnostics augment the filer's eye.",
            motivation: "You're not just a fitter—you're a data scientist of steel.",
            icon: <Cpu className="w-8 h-8" />,
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-20">
                        {Array.from({ length: 96 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="border border-green-300 bg-green-200"
                                animate={{ opacity: [0.1, 0.8, 0.1] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: (i % 12) * 0.1 }}
                            />
                        ))}
                    </div>
                    <div className="z-10 flex items-center gap-4">
                        <Cpu className="w-16 h-16 text-green-600" />
                        <Eye className="w-12 h-12 text-emerald-500" />
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <Target className="w-14 h-14 text-green-700" />
                        </motion.div>
                    </div>
                </div>
            )
        },
        {
            period: "2022-Today",
            title: "The Apprenticeship Era",
            description: "Launch of the first U.S. DOL-registered Saw Filer Apprenticeship by Reliability Solutions. Structured 4-year program blending traditional skills with modern technology.",
            motivation: "Become a certified guardian of this heritage trade—and write its next chapter.",
            icon: <GraduationCap className="w-8 h-8" />,
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0">
                        <motion.div
                            className="absolute inset-4 border-2 border-dashed border-purple-300 rounded-lg"
                            animate={{ borderColor: ['#c4b5fd', '#8b5cf6', '#c4b5fd'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </div>
                    <div className="z-10 flex items-center gap-6">
                        <GraduationCap className="w-20 h-20 text-purple-600" />
                        <div className="flex flex-col gap-2">
                            <BookOpen className="w-12 h-12 text-indigo-500" />
                            <Award className="w-12 h-12 text-purple-500" />
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Origins & Evolution</h3>
            
            {/* Timeline Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {eras.map((era, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedEra(index)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedEra === index
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/60 text-slate-700 hover:bg-white/80'
                        }`}
                    >
                        {era.period}
                    </button>
                ))}
            </div>

            {/* Content Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedEra}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-2 gap-8 items-center"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                {eras[selectedEra].icon}
                            </div>
                            <h4 className="text-2xl font-bold text-slate-800">{eras[selectedEra].title}</h4>
                        </div>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            {eras[selectedEra].description}
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <p className="text-blue-800 font-medium italic">
                                "{eras[selectedEra].motivation}"
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        {eras[selectedEra].visualElement}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Interactive Hotspot Responsibilities
const CoreResponsibilities = () => {
    const [activeResponsibility, setActiveResponsibility] = React.useState(0);
    
    const responsibilities = [
        {
            icon: <Search />,
            title: "Inspect & Diagnose",
            description: "Visual, dye-penetrant, and ultrasonic checks for micro-cracks. Vibration analysis pinpoints imbalance before it stalls production.",
            impact: "Early detection can avert a week-long mill shutdown.",
            color: "bg-red-100 text-red-600"
        },
        {
            icon: <Wrench />,
            title: "Precision Filing",
            description: "Wheel selection (aluminum oxide, silicon carbide, diamond) for steel or carbide. Grinding gullets to ±.002″ tolerances—maximizing board yield.",
            impact: "A perfect file boosts saw life by 15%.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: <Scale />,
            title: "Fitting & Swaging",
            description: "Use hydraulic swagers and tip-shaping tools to achieve kerf tolerances (±.005″). Measure with micrometers and laser gauges.",
            impact: "Uniform kerf reduces material waste by up to 8%.",
            color: "bg-green-100 text-green-600"
        },
        {
            icon: <Hammer />,
            title: "Benching & Tensioning",
            description: "Doghead, twist-face, cross-face hammers on dead/live anvils. Stretcher-roller machines apply precise blade tension.",
            impact: "Proper tension cuts vibration by 10% and improves safety.",
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: <Shield />,
            title: "Welding & Repair",
            description: "TIG/MIG hardfacing with stellite rods; heat-controlled pre/post-heating. Crack stitching and profile blending to OEM specs.",
            impact: "Repair saves up to 70% vs. blade replacement.",
            color: "bg-orange-100 text-orange-600"
        },
        {
            icon: <Target />,
            title: "Troubleshooting & Optimization",
            description: "Interpret cut-quality defects (burn marks, chipping) via root-cause analyses. Adjust feed rates, wheel speeds, blade angles.",
            impact: "Optimization can increase throughput 5–12%.",
            color: "bg-teal-100 text-teal-600"
        }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Core Responsibilities</h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Responsibility List */}
                <div className="lg:col-span-1 space-y-3">
                    {responsibilities.map((resp, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveResponsibility(index)}
                            className={`w-full text-left p-4 rounded-lg transition-all ${
                                activeResponsibility === index
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white/40 text-slate-700 hover:bg-white/60'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${activeResponsibility === index ? 'bg-white/20' : resp.color}`}>
                                    {React.cloneElement(resp.icon, { 
                                        className: `w-5 h-5 ${activeResponsibility === index ? 'text-white' : ''}` 
                                    })}
                                </div>
                                <span className="font-medium">{resp.title}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content Display */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeResponsibility}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-full ${responsibilities[activeResponsibility].color}`}>
                                    {React.cloneElement(responsibilities[activeResponsibility].icon, { className: 'w-8 h-8' })}
                                </div>
                                <h4 className="text-2xl font-bold text-slate-800">
                                    {responsibilities[activeResponsibility].title}
                                </h4>
                            </div>
                            
                            <p className="text-slate-600 text-lg leading-relaxed">
                                {responsibilities[activeResponsibility].description}
                            </p>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-green-800">Impact:</span>
                                </div>
                                <p className="text-green-700">
                                    {responsibilities[activeResponsibility].impact}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Tools Carousel
const ToolsCarousel = () => {
    const [activeCategory, setActiveCategory] = React.useState(0);
    
    const toolCategories = [
        {
            name: "Hand Tools",
            icon: <Hammer />,
            tools: ["Rasps", "Broaches", "Swage Hammers", "Doghead & Twist Hammers"],
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="grid grid-cols-2 gap-6">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Hammer className="w-16 h-16 text-amber-700" />
                        </motion.div>
                        <Wrench className="w-16 h-16 text-orange-600" />
                        <Scale className="w-16 h-16 text-amber-600" />
                        <motion.div
                            animate={{ scaleY: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center">
                                <div className="w-2 h-10 bg-amber-100 rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            )
        },
        {
            name: "Grinders",
            icon: <Cog />,
            tools: ["CNC Profile Grinders", "Variable-Speed Bench Grinders", "Diamond Dressing Tools"],
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-slate-50 to-gray-200 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Cog className="w-20 h-20 text-slate-600" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-16 h-16 border-4 border-slate-500 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 bg-slate-400 rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 h-2 bg-slate-300 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500 rounded-full"
                            animate={{ width: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>
            )
        },
        {
            name: "Benching Stations",
            icon: <Scale />,
            tools: ["Manual Stretchers", "Hydraulic Tensioners", "Live-Anvil Machines"],
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-6">
                        <Scale className="w-18 h-18 text-blue-600" />
                        <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex flex-col gap-2"
                        >
                            <div className="w-16 h-4 bg-blue-400 rounded" />
                            <div className="w-16 h-4 bg-blue-500 rounded" />
                            <div className="w-16 h-4 bg-blue-600 rounded" />
                        </motion.div>
                        <div className="w-1 h-24 bg-blue-300 rounded-full relative">
                            <motion.div
                                className="absolute w-3 h-3 bg-blue-600 rounded-full"
                                animate={{ y: [0, 80, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{ left: '-5px' }}
                            />
                        </div>
                    </div>
                </div>
            )
        },
        {
            name: "Welding Gear",
            icon: <Shield />,
            tools: ["TIG/MIG Rigs", "Induction Preheaters", "Stellite/Filler Rods"],
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-orange-50 to-red-100 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-6">
                        <Shield className="w-18 h-18 text-orange-600" />
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="relative"
                        >
                            <div className="w-16 h-2 bg-yellow-400 rounded-full" />
                            <div className="absolute -top-2 left-1/2 w-2 h-6 bg-orange-500 rounded-full transform -translate-x-1/2" />
                            {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                                    style={{ 
                                        top: `${-10 - i * 3}px`, 
                                        left: `${8 + Math.sin(i) * 10}px` 
                                    }}
                                    animate={{ 
                                        opacity: [0, 1, 0],
                                        y: [-5, -15, -25]
                                    }}
                                    transition={{ 
                                        duration: 1, 
                                        repeat: Infinity, 
                                        delay: i * 0.1 
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            )
        },
        {
            name: "Measurement & Diagnostics",
            icon: <Eye />,
            tools: ["Micrometers", "Dial Indicators", "Laser Alignment", "Vibration Sensors", "Thermal Cameras"],
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-6">
                        <Eye className="w-18 h-18 text-green-600" />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Target className="w-16 h-16 text-emerald-500" />
                        </motion.div>
                        <div className="flex flex-col gap-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-12 h-1 bg-green-400 rounded-full"
                                    animate={{ scaleX: [0.5, 1, 0.5] }}
                                    transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity, 
                                        delay: i * 0.2 
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            name: "Safety Equipment",
            icon: <ShieldCheck />,
            tools: ["Cut-Resistant Gloves", "Eye/Ear Protection", "Dust Extraction"],
            visualElement: (
                <div className="w-full h-64 bg-gradient-to-br from-red-50 to-pink-100 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-6">
                        <ShieldCheck className="w-18 h-18 text-red-600" />
                        <motion.div
                            animate={{ rotateY: [0, 180, 360] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <div className="w-16 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 0.9, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-14 h-14 bg-pink-400 rounded-full flex items-center justify-center"
                        >
                            <CheckCircle className="w-8 h-8 text-white" />
                        </motion.div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Tools of the Trade</h3>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {toolCategories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveCategory(index)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            activeCategory === index
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/60 text-slate-700 hover:bg-white/80'
                        }`}
                    >
                        {React.cloneElement(category.icon, { className: 'w-5 h-5' })}
                        {category.name}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="grid md:grid-cols-2 gap-8 items-center"
                >
                    <div>
                        {toolCategories[activeCategory].visualElement}
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">
                            {toolCategories[activeCategory].name}
                        </h4>
                        <ul className="space-y-3">
                            {toolCategories[activeCategory].tools.map((tool, toolIndex) => (
                                <li key={toolIndex} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span className="text-slate-700">{tool}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Career Path Timeline
const CareerPathTimeline = () => {
    const [selectedMilestone, setSelectedMilestone] = React.useState(0);
    
    const milestones = [
        {
            year: "Year 1",
            title: "Apprentice",
            wage: "$40-60K",
            description: "Entry-level position with structured learning and mentorship"
        },
        {
            year: "Year 3",
            title: "Journeyperson", 
            wage: "$60-80K + benefits",
            description: "Certified professional with advanced skills and independence"
        },
        {
            year: "Year 5",
            title: "Master Filer / Lead Technician",
            wage: "$80-100K",
            description: "Expert level with leadership responsibilities and specialized knowledge"
        },
        {
            year: "Year 7+",
            title: "Instructor / Reliability Engineer / Shop Manager",
            wage: "$100K+",
            description: "Senior roles in training, engineering, or management"
        }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Career Path & Outlook</h3>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Timeline */}
                <div className="md:w-1/3 space-y-4">
                    {milestones.map((milestone, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedMilestone(index)}
                            className={`w-full text-left p-4 rounded-lg transition-all ${
                                selectedMilestone === index
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white/40 text-slate-700 hover:bg-white/60'
                            }`}
                        >
                            <div className="font-bold">{milestone.year}</div>
                            <div className="text-sm opacity-90">{milestone.title}</div>
                        </button>
                    ))}
                </div>
                
                {/* Content */}
                <div className="md:w-2/3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedMilestone}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h4 className="text-2xl font-bold text-slate-800 mb-2">
                                {milestones[selectedMilestone].title}
                            </h4>
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block mb-4">
                                <strong>Wage: {milestones[selectedMilestone].wage}</strong>
                            </div>
                            <p className="text-slate-600 mb-6">
                                {milestones[selectedMilestone].description}
                            </p>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <h5 className="font-bold text-blue-800 mb-2">Market Demand:</h5>
                                <ul className="space-y-1 text-blue-700">
                                    <li>• 20% workforce shortage in North America by 2028</li>
                                    <li>• Continuous hiring by sawmills, panel plants, remanufacturers</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
                                <p className="text-xs text-slate-500">
                                    <strong>Disclaimer:</strong> Wage estimates are based on industry averages and may vary significantly depending on location, company, individual performance, and market conditions. Actual earnings and career progression may differ.
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Impact ROI Section
const ImpactROI = () => {
    const stats = [
        { icon: <TrendingUp />, value: "8", suffix: "%", title: "Wood Recovery ↑", description: "Maximum yield from every log" },
        { icon: <TrendingDown />, value: "30", suffix: "%", title: "Maintenance Costs ↓", description: "Reduced downtime and repairs" },
        { icon: <Zap />, value: "5.7", suffix: "%", title: "Energy Usage ↓", description: "More efficient operations" },
        { icon: <TimerOff />, value: "40", suffix: "%", title: "Unplanned Downtime ↓", description: "Better reliability and planning" }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Impact & ROI</h3>
            <p className="text-xl text-blue-600 font-semibold mb-8">
                "Every dollar you invest in training returns $3–5 in cost avoidance."
            </p>
            
            <motion.div 
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.2 }}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        variants={cardVariants}
                        className="bg-white/60 backdrop-blur-md p-6 rounded-2xl text-center border border-white/50 shadow-lg"
                    >
                        <div className="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-4">
                            {React.cloneElement(stat.icon, { className: 'w-8 h-8' })}
                        </div>
                        <h3 className="text-4xl font-bold text-slate-900 mb-2">
                            {stat.value}<span className="text-green-600">{stat.suffix}</span>
                        </h3>
                        <h4 className="font-semibold text-slate-700 mb-2">{stat.title}</h4>
                        <p className="text-sm text-slate-600">{stat.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

// Future Trends
const FutureTrends = () => {
    const [hoveredTrend, setHoveredTrend] = React.useState(null);
    
    const trends = [
        {
            icon: <Cpu />,
            title: "AI-Driven Diagnostics",
            description: "ML models flag blade issues in real-time, predicting failures before they happen.",
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: <Eye />,
            title: "AR/VR Training",
            description: "Virtual filing labs for remote apprentices, practicing on digital twins of real equipment.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: <Globe />,
            title: "IoT-Connected Tools",
            description: "Smart grinders that log every profile and feed rate, building databases of optimal settings.",
            color: "bg-green-100 text-green-600"
        }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Future Trends</h3>
            <p className="text-center text-slate-600 mb-8">The saw filing trade continues to evolve with cutting-edge technology</p>
            
            <div className="grid md:grid-cols-3 gap-6">
                {trends.map((trend, index) => (
                    <motion.div
                        key={index}
                        className="bg-white/40 backdrop-blur-md p-6 rounded-lg border border-white/50 text-center cursor-pointer"
                        whileHover={{ y: -5, scale: 1.02 }}
                        onMouseEnter={() => setHoveredTrend(index)}
                        onMouseLeave={() => setHoveredTrend(null)}
                    >
                        <div className={`p-4 rounded-full inline-block mb-4 ${trend.color}`}>
                            {React.cloneElement(trend.icon, { className: 'w-8 h-8' })}
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-2">{trend.title}</h4>
                        <AnimatePresence>
                            <motion.p
                                className="text-slate-600 text-sm"
                                initial={{ opacity: 0.7 }}
                                animate={{ opacity: hoveredTrend === index ? 1 : 0.7 }}
                            >
                                {trend.description}
                            </motion.p>
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Interactive Timeline for Reliability Solutions Journey
const InteractiveTimeline = () => {
    const [selectedMilestone, setSelectedMilestone] = React.useState(0);
    
    const milestones = [
        {
            year: "2003",
            title: "Foundation",
            description: "Ian McKinnon and Tim Dortch establish Reliability Solutions with a vision to transform industrial maintenance.",
            icon: <Building />
        },
        {
            year: "2010",
            title: "Expansion",
            description: "Expanded training programs to cover precision maintenance and reliability engineering across North America.",
            icon: <TrendingUp />
        },
        {
            year: "2018",
            title: "Innovation",
            description: "Launched digital learning platforms and remote training capabilities to reach more facilities.",
            icon: <Globe />
        },
        {
            year: "2022",
            title: "Apprenticeship Era",
            description: "First U.S. DOL-registered Saw Filer Apprenticeship program launched, setting new standards for skilled trades training.",
            icon: <GraduationCap />
        }
    ];

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Timeline */}
                <div className="md:w-1/3 space-y-4">
                    {milestones.map((milestone, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedMilestone(index)}
                            className={`w-full text-left p-4 rounded-lg transition-all ${
                                selectedMilestone === index
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white/40 text-slate-700 hover:bg-white/60'
                            }`}
                        >
                            <div className="font-bold">{milestone.year}</div>
                            <div className="text-sm opacity-90">{milestone.title}</div>
                        </button>
                    ))}
                </div>
                
                {/* Content */}
                <div className="md:w-2/3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedMilestone}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    {React.cloneElement(milestones[selectedMilestone].icon, { className: 'w-6 h-6' })}
                                </div>
                                <h4 className="text-2xl font-bold text-slate-800">
                                    {milestones[selectedMilestone].title}
                                </h4>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {milestones[selectedMilestone].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Interactive Hero for Saw Filer Definition
const SawFilerHero = () => {
    return (
        <div className="relative bg-gradient-to-r from-slate-800 to-blue-900 rounded-3xl overflow-hidden min-h-[600px] flex items-center">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            
            {/* Background with spinning grinder effect */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-96 h-96 border-4 border-yellow-400 rounded-full opacity-20"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute top-8 left-8 w-80 h-80 border-2 border-blue-400 rounded-full opacity-30"
                    />
                </div>
            </div>

            <div className="relative z-20 w-full px-8">
                <div className="max-w-5xl mx-auto text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mb-8"
                    >
                        <Wrench className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        What is a <span className="text-yellow-400">Saw Filer?</span>
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-xl md:text-2xl mb-8 leading-relaxed"
                    >
                        The <span className="font-bold text-blue-300">precision craftsman</span> behind every perfectly cut board.
                        <br />
                        <span className="text-lg opacity-90">(aka Saw Doctor in Australia & New Zealand)</span>
                    </motion.p>

                    <Link to={createPageUrl('Register')}>
                        <motion.button
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
                        >
                            Explore the Craft <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default function AboutPage() {
  const benefitCards = [
      {
          icon: <DollarSign />,
          title: "Earn While You Learn",
          description: "Competitive wages from day one",
          details: "Start earning $35,000-$42,000 in your first year while building skills. No student debt, just steady income growth as you advance."
      },
      {
          icon: <Users />,
          title: "Mentorship from Industry Pros",
          description: "Learn from master craftsmen",
          details: "Work alongside experts with decades of experience. Get personalized guidance and insider knowledge you can't find in textbooks."
      },
      {
          icon: <Award />,
          title: "DOL-Certified Credential",
          description: "Nationally recognized certification",
          details: "Receive a Department of Labor Journeyperson credential that opens doors nationwide. Your skills will be recognized anywhere you go."
      },
      {
          icon: <TrendingUp />,
          title: "Direct Path to Journeyperson",
          description: "Clear career progression",
          details: "Follow a structured path from apprentice to journeyperson to master craftsperson. No guesswork about your next career step."
      }
  ];

  const missionPanels = [
      { 
          icon: <Target />, 
          title: "Optimize Quality & Quantity", 
          description: "Transform your operations with precision training that directly impacts product quality and production efficiency."
      },
      { 
          icon: <TrendingDown />, 
          title: "Reduce Maintenance Costs", 
          description: "Learn proven techniques that cut maintenance expenses by up to 30% while extending equipment life."
      },
      { 
          icon: <Shield />, 
          title: "Enhance Safety & Energy Efficiency", 
          description: "Implement safety protocols and energy-saving practices that protect your team and reduce operational costs."
      }
  ];

  const valueQuotes = [
      { 
          icon: <ShieldCheck />, 
          title: "Integrity & Honesty", 
          quote: "A handshake is our word",
          story: "When a client needed emergency training during a critical shutdown, we mobilized our team within 24 hours, demonstrating our commitment goes beyond contracts—it's about trust and reliability."
      },
      { 
          icon: <BookOpen />, 
          title: "Best-In-Class Value", 
          quote: "We deliver training that delights our clients",
          story: "Our continuous improvement approach means we're always refining our methods. One client saw a 40% reduction in bearing failures after implementing our updated lubrication protocols."
      },
      { 
          icon: <Users />, 
          title: "Respect & Teamwork", 
          quote: "High-performance teams deliver exceptional results",
          story: "Our instructors bring over 480 combined years of hands-on experience, working as specialists who respect both the craft and each other's expertise."
      },
      { 
          icon: <Handshake />, 
          title: "Partnership", 
          quote: "We listen, we adapt, we deliver",
          story: "Every training program is tailored to specific client needs. We don't just teach—we partner with you to ensure measurable, lasting improvements."
      }
  ];

  const stats = [
      { icon: <TimerOff />, value: "75", suffix: "%", title: "Reduction in Lost Hours", description: "From 240 to 60 hours annually—a $1.8M value creation" },
      { icon: <TrendingDown />, value: "30", suffix: "%", title: "Maintenance Cost Reduction", description: "40% fewer bearing failures, 7% lower lubrication costs" },
      { icon: <Zap />, value: "5.7", suffix: "%", title: "Energy Cost Savings", description: "$431,000 return from 287 precision-state machines" },
      { icon: <Activity />, value: "10", suffix: "%", title: "Site Vibration Reduction", description: "100 critical machines transformed for reliable operation" },
  ];

  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-sm pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Why Apprenticeship
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Discover the value of skilled trades, the critical role of a saw filer, and the mission behind our program.
          </p>
        </motion.div>

        <div className="space-y-24">
          {/* Section 1: Why an Apprenticeship - COMPLETELY REDESIGNED */}
          <motion.section
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-16"
          >
            {/* Hero */}
            <ApprenticeshipHero />

            {/* Benefit Cards */}
            <div>
                <h3 className="text-4xl font-bold text-center text-slate-800 mb-12">What You Gain</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefitCards.map((card, index) => (
                        <BenefitCard key={card.title} {...card} index={index} />
                    ))}
                </div>
            </div>

            {/* ROI Calculator */}
            <ROICalculator />

            {/* Myth Buster */}
            <MythBuster />

            {/* Career Path Explorer */}
            <CareerPathExplorer />

            {/* Video Testimonials */}
            <VideoTestimonials />

          </motion.section>

          {/* Section 2: What is a Saw Filer? - COMPLETELY REDESIGNED */}
          <motion.section
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-16"
            id="saw-filer-details"
          >
            {/* Hero */}
            <SawFilerHero />

            {/* Origins & Evolution */}
            <OriginsEvolution />

            {/* Core Responsibilities */}
            <CoreResponsibilities />

            {/* Tools of the Trade */}
            <ToolsCarousel />

            {/* Career Path & Outlook */}
            <CareerPathTimeline />

            {/* Impact & ROI */}
            <ImpactROI />

            {/* Future Trends */}
            <FutureTrends />

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
                <h3 className="text-3xl font-bold mb-4">Ready to Master Saw Filing?</h3>
                <p className="text-xl mb-6 opacity-90">Join the next generation of precision craftsmen</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to={createPageUrl('Register')}>
                        <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors">
                            Apply Now
                        </button>
                    </Link>
                    <Link to={`${createPageUrl('Home')}#contact`}>
                        <button className="bg-white/20 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/30 transition-colors">
                            Contact Us
                        </button>
                    </Link>
                </div>
            </div>

          </motion.section>

          {/* Section 3: About Reliability Solutions - KEEP EXISTING */}
          <motion.section
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-20"
          >
            {/* 1. Hero Section */}
            <div className="relative bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-blue-900/60 z-10"></div>
                <div className="relative z-20 text-center text-white px-8">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-7xl font-bold mb-4"
                    >
                        Why Reliability Solutions?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl font-light"
                    >
                        <span className="text-yellow-400">Profitable Results®</span> through <span className="text-blue-300">Reliable Manufacturing®</span>
                    </motion.p>
                </div>
            </div>

            {/* 2. Mission Panels */}
            <div>
                <h3 className="text-4xl font-bold text-center text-slate-800 mb-12">Our Mission in Action</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {missionPanels.map((panel, index) => (
                        <MissionPanel key={panel.title} {...panel} index={index} />
                    ))}
                </div>
            </div>

            {/* 3. Values with Scroll-Triggered Quotes */}
            <div>
                <h3 className="text-4xl font-bold text-center text-slate-800 mb-12">Our Values in Practice</h3>
                <div className="space-y-6">
                    {valueQuotes.map((value, index) => (
                        <ValueQuote key={value.title} {...value} index={index} />
                    ))}
                </div>
            </div>

            {/* 4. Animated Results Counters */}
            <div>
                <h3 className="text-4xl font-bold text-center text-slate-800 mb-12">Proven Impact</h3>
                <motion.div 
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map(stat => (
                        <AnimatedCounter key={stat.title} {...stat} />
                    ))}
                </motion.div>
            </div>

            {/* 5. Interactive Timeline */}
            <div>
                <h3 className="text-4xl font-bold text-center text-slate-800 mb-12">Our Journey</h3>
                <InteractiveTimeline />
            </div>

          </motion.section>
        </div>
      </div>

      {/* Sticky Apply Bar */}
      <StickyApplyBar />

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 0 3px #fff, 0 0 0 6px #3b82f6;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 3px #fff, 0 0 0 6px #3b82f6;
        }
      `}</style>
    </div>
  );
}
