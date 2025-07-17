
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, BookOpen, Play, Zap } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "Calculator",
    description: "Advanced saw filing calculations and measurements",
    icon: Calculator,
  },
  {
    id: 2,
    title: "Literature",
    description: "Comprehensive guides and technical manuals",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Media",
    description: "Video tutorials and interactive content",
    icon: Play,
  },
  {
    id: 4,
    title: "Interactive",
    description: "Hands-on tools and simulations",
    icon: Zap,
  }
];

export default function LearnEngageSection() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Learn &
            </span>
            <br />
            <span className="text-slate-900">Engage</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-4xl mx-auto">
            Here you'll find what you need to enhance your skills in saw filing from calculators, 
            books, videos to reference tables, consultants & technical manuals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <blockquote className="text-3xl md:text-4xl font-light text-slate-800 max-w-4xl mx-auto">
            "It's not just the blade that needs sharpening —
            <br />
            <span className="text-blue-600">It's the mind behind it"</span>
          </blockquote>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
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
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    Explore
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
