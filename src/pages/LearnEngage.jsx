
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calculator, BookOpen, Play, Zap, Phone, Mail, Linkedin, Facebook
} from 'lucide-react';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const projects = [
  {
    id: 1,
    title: "Calculator",
    description: "Advanced saw filing calculations and measurements",
    icon: Calculator,
    href: "Calculator"
  },
  {
    id: 2,
    title: "Literature",
    description: "Comprehensive guides and technical manuals",
    icon: BookOpen,
    href: "Literature"
  },
  {
    id: 3,
    title: "Media",
    description: "Video tutorials and interactive content",
    icon: Play,
    href: "Media"
  },
  {
    id: 4,
    title: "Interactive",
    description: "Hands-on tools and simulations",
    icon: Zap,
    href: "Interactive"
  }
];

const knights = [
  {
    name: "Franklin Goforth",
    title: "President: Filing Solutions LLC, Consultant, SME, Mentor",
    location: "South Carolina",
    phone: "(843)-319-7556",
    email: "franklingoforth@gmail.com",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/221e30702_franklinpicture.jpg",
    social: {
      type: "linkedin",
      href: "https://www.linkedin.com/in/robert-goforth-70862233/"
    },
    bio: [
      "With a remarkable 47-year career dedicated to the art and science of saw filing, Robert Goforth is a nationally recognized expert in the field. As the President of Filing Solutions LLC, Goforth has built a reputation for excellence in band and circular saw filing, servicing a diverse range of wood species from hardwood and pine to west coast doug fir and hemlock.",
      "Goforth's expertise extends across the United States, with extensive experience working from northern Maine to Florida, and a significant 20-year tenure on the west coast. This broad geographic experience has provided Goforth with a deep understanding of the unique challenges and requirements of different regions and wood types.",
      "In addition to Goforth's hands-on experience, he is a highly respected educator and mentor in the saw filing industry. Having personally trained 10 head saw filers over the course of his career, Goforth's commitment to knowledge sharing and professional development is evident. This commitment is further underscored by his current role as a contracted subject matter expert for major lumber manufacturers.",
      "Goforth's numerous accomplishments and contributions to the saw filing industry have earned him a place in the Saw Filing Hall of Fame. This prestigious recognition, combined with his extensive experience and expertise, solidifies Goforth's position as a leading figure in the field.",
      "Goforth's passion for saw filing extends beyond the technical aspects of the craft. He deeply values the relationships and camaraderie forged throughout his career, emphasizing the importance of friendship, mentorship, ownership and collaboration in achieving success.",
      "With a proven track record of success and an unwavering dedication to the craft, Goforth continues to be a driving force in the saw filing industry, inspiring and empowering the next generation of saw filers."
    ],
    quote: "The saw is the heart of the mill, The guide is the heart of the saw."
  },
  {
    name: "Mitch White",
    title: "Owner: Whitehouse Saws, Consultant, Instructor, SME",
    location: "Washington State",
    phone: "(425)-530-5890",
    email: "mitch.whitehouse.saws@gmail.com",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7a90f9656_mitchwhite.jpg",
    social: {
      type: "facebook",
      href: "https://www.facebook.com/mitch.white.3388630"
    },
    bio: [
      "With 48 years of experience in the sawmill industry, I have dedicated the past 30 years to serving as Head Saw Filer across various sawmills, mastering the intricacies of sawmill operations and saw maintenance. My expertise has been further honed through a decade of consulting with Saw-Pro, providing insights and solutions to diverse sawmill challenges across numerous locations.",
      "For the last three years, I have been an instructor at Northcentral Technical College in Antigo, Wisconsin, home to the nation's only fully accredited 'hands-on' saw filer program. This unique position allows me to impart my extensive knowledge to the next generation of saw filers, ensuring they are well-prepared for the demands of the industry.",
      "Outside my teaching responsibilities, I remain actively engaged in the field, available for consulting and fill-in work nationwide. As a third-generation saw filer, I come from a legacy where saw filing runs deep in my family, with 13 saw filers among us at one time. This rich heritage has instilled in me a profound understanding of the importance of mentoring and guiding upcoming saw filers, ensuring the continuation of excellence in this critical trade."
    ],
    quote: null
  }
];

export default function LearnEngage() {
  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-sm">
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Learn &
              </span>
              <br />
              <span className="text-slate-900">Engage</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-4xl mx-auto">
              Here you'll find what you need to enhance your skills in saw filing from calculators, 
              books, videos to reference tables, consultants & technical manuals.
            </p>
          </motion.div>

          {/* Quote Section with Spline Background */}
          <div className="relative mb-20 h-[180px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
            {/* Spline Background */}
            <div className="absolute inset-0 w-full h-full opacity-60 md:opacity-70 z-0">
              <iframe 
                src='https://my.spline.design/particleaibrain-884Tsloqdf8XX5hN0JQTpGs9/' 
                frameBorder='0' 
                width='100%' 
                height='100%'
                className="pointer-events-none"
              />
            </div>
            
            {/* Dark Overlay for Better Text Visibility */}
            <div className="absolute inset-0 bg-black/30 z-5"></div>
            
            {/* Animated Quote */}
            <motion.blockquote 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative z-10 text-center px-4 sm:px-6 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light text-white max-w-4xl mx-auto leading-relaxed"
              style={{ textShadow: '3px 3px 12px rgba(0, 0, 0, 0.8)' }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="block mb-2 sm:mb-4"
              >
                "It's not just the blade that needs sharpening —
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-blue-200 font-medium block"
              >
                It's the mind behind it"
              </motion.span>
            </motion.blockquote>
          </div>

          {/* Lumber Library Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
            id="lumber-library"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
                Lumber Library
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-4xl mx-auto">
              Your comprehensive resource center for technical knowledge, industry standards, and best practices in saw filing and lumber processing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <Link key={project.id} to={createPageUrl(project.href)}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group h-full"
                >
                  <Card className="backdrop-blur-lg bg-white/60 border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-lg h-full flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <project.icon className="w-16 h-16 text-blue-600" />
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{project.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 flex-grow">{project.description}</p>
                      
                      <div
                        className="w-full mt-auto font-medium text-center py-2 text-white rounded-lg transition-all duration-300 group-hover:shadow-lg"
                        style={{ background: "linear-gradient(to right, #3b82f6, #6366f1)" }}
                      >
                        Explore
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Redwood Roundtable Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mt-20"
            id="redwood-roundtable"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                Redwood Roundtable
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-4xl mx-auto mb-4">
              <span className="font-semibold text-slate-800">TAP INTO DECADES OF SAW FILING EXPERIENCE</span>
              <br />
              These experienced consultants and mentors are ready to guide you through any sawmill challenge.
              <br />
              From troubleshooting to process improvement, access insights, solve technical problems, and optimize your operations.
            </p>
            
            {/* Enhanced Knights of the Redwood Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 mb-8"
            >
              <div className="relative inline-block">
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-red-600 to-amber-800 bg-clip-text text-transparent mb-2">
                  Knights of the Redwood
                </h3>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-full"></div>
              </div>
              <p className="text-slate-700 text-lg mt-6 font-medium italic">
                Masters of the Craft • Guardians of Tradition • Mentors of Excellence
              </p>
            </motion.div>
          </motion.div>

          {/* Knights Profile Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            {knights.map((knight, index) => (
              <motion.div
                key={knight.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-lg flex flex-col"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <img src={knight.image} alt={knight.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-md" />
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold text-slate-800">{knight.name}</h3>
                    <p className="text-blue-600 font-semibold">{knight.title}</p>
                    <p className="text-slate-500">{knight.location}</p>
                    <div className="flex flex-col items-center sm:items-start gap-2 mt-3 text-sm">
                       <a href={`mailto:${knight.email}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                          <Mail className="w-5 h-5 flex-shrink-0" />
                          <span>{knight.email}</span>
                      </a>
                      <a href={`tel:${knight.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          <span>{knight.phone}</span>
                      </a>
                      <div className="flex gap-4 pt-1">
                        {knight.social.type === 'linkedin' && (
                          <a href={knight.social.href} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {knight.social.type === 'facebook' && (
                          <a href={knight.social.href} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  {knight.bio.map((paragraph, pIndex) => <p key={pIndex}>{paragraph}</p>)}
                  {knight.quote && <p className="font-semibold italic text-slate-700 mt-4 text-center">"{knight.quote}"</p>}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16 text-slate-700">
            <p className="text-2xl font-bold mb-2">More to come!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
