import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Gamepad2, 
  Building, 
  RotateCcw, 
  Waves, 
  Settings 
} from 'lucide-react';

const tools = [
  {
    id: 1,
    title: "5S Game",
    description: "Interactive workplace organization game based on 5S methodology",
    icon: Gamepad2,
    href: "FiveSGame",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 2,
    title: "RS Lego Builder",
    description: "Build and design with virtual Lego blocks for problem-solving",
    icon: Building,
    href: "RSLegoBuilder",
    color: "from-red-500 to-pink-600"
  },
  {
    id: 3,
    title: "Spinning Disk Simulation",
    description: "Simulate spinning disk mechanics and physics",
    icon: RotateCcw,
    href: "SpinningDiskSimulation",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 4,
    title: "Time & Frequency Domain",
    description: "Analyze signals in both time and frequency domains",
    icon: Waves,
    href: "TimeFrequencyDomain",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 5,
    title: "Static Unbalance Simulator",
    description: "Understand and visualize static unbalance in rotating machinery",
    icon: Settings,
    href: "StaticUnbalanceSimulator",
    color: "from-orange-500 to-red-600"
  }
];

export default function Interactive() {
  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-sm p-4 sm:p-8">
      <div className="max-w-6xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Interactive
            </span>
            <br />
            Tools
          </h1>
          <p className="text-slate-600 text-lg">Hands-on simulations to hone your skills.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Link key={tool.id} to={createPageUrl(tool.href)}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                className="group h-full"
              >
                <Card className="backdrop-blur-lg bg-white/60 border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-lg h-full flex flex-col">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">{tool.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-grow flex flex-col pt-0">
                    <p className="text-slate-600 text-sm mb-6 flex-grow text-center">{tool.description}</p>
                    
                    <div
                      className={`w-full mt-auto font-medium text-center py-3 text-white rounded-lg transition-all duration-300 group-hover:shadow-lg bg-gradient-to-r ${tool.color}`}
                    >
                      Launch Tool
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}