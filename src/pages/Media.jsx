
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, Clock, Headphones } from 'lucide-react';

const videos = [
  { 
    title: "Calculating Gullet Area using Graph Paper Method", 
    duration: "3:08", 
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    url: "https://youtu.be/9hO-BCxDvZs",
    description: "Learn how to accurately calculate gullet area using the traditional graph paper method for optimal saw performance."
  },
  { 
    title: "Decoding Grinding Wheels", 
    duration: "3:37", 
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",
    url: "https://youtu.be/FI5xGsIWNwM",
    description: "Comprehensive guide to understanding grinding wheel specifications, selection, and proper usage for saw filing applications."
  },
  { 
    title: "More Videos Coming Soon", 
    duration: "Stay Tuned", 
    thumbnail: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7e53bf837_mtnic2023_A_close-up_of_a_hand_holding_a_modern_smartphone_the__57cbf11f-5344-4ebe-b0f6-a4328e73dc57.png", // Updated thumbnail
    url: null,
    description: "We're continuously adding new content. Check back regularly for the latest saw filing tutorials and demonstrations.",
    isComingSoon: true
  }
];

const VideoCard = ({ video, index }) => {
  const handleVideoClick = () => {
    if (video.url) {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card 
        className={`backdrop-blur-lg bg-white/60 border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-lg h-full flex flex-col group ${video.url ? 'cursor-pointer' : ''} ${video.isComingSoon ? 'opacity-80' : ''}`}
        onClick={video.url ? handleVideoClick : undefined}
      >
        <div className="relative">
          <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover"/>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {video.isComingSoon ? (
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-2">Coming Soon</div>
                <div className="text-sm">New Content Loading...</div>
              </div>
            ) : (
              <PlayCircle className="w-20 h-20 text-white/80" />
            )}
          </div>
          {video.url && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              LIVE
            </div>
          )}
          {video.isComingSoon && (
            <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
              COMING SOON
            </div>
          )}
        </div>
        <CardContent className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-2 flex-grow">{video.title}</h3>
          <p className="text-slate-600 text-sm mb-3">{video.description}</p>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-auto">
            <Clock className="w-4 h-4" />
            <span>{video.duration}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PodcastPlayer = () => (
  <Card className="backdrop-blur-lg bg-white/60 border border-gray-200 shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Headphones className="w-8 h-8 text-blue-600" />
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Reliability Solutions' Daily Drive Podcast</h3>
          <p className="text-slate-600">Industry insights and expert discussions on saw filing and lumber processing</p>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden">
        <iframe
          id="player_iframe_daily"
          src="https://www.buzzsprout.com/2454168?client_source=large_player&amp;iframe=true&amp;referrer=https%3A%2F%2Fwww.buzzsprout.com%2F2454168%2Fpodcast%2Fembed"
          loading="lazy"
          width="100%"
          height="375"
          frameBorder="0"
          scrolling="no"
          title="Reliability Solutions' Daily Drive Podcast"
          className="w-full"
        />
      </div>
    </CardContent>
  </Card>
);

export default function Media() {
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
            <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
              Media
            </span>
            <br />
            Library
          </h1>
          <p className="text-slate-600 text-lg">Video tutorials, demonstrations, and expert discussions.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="multiple" collapsible className="w-full space-y-4" defaultValue={['videos', 'podcast']}>
            <AccordionItem value="videos" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">Video Library</AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videos.map((video, index) => (
                    <VideoCard key={index} video={video} index={index} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="podcast" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">Podcast</AccordionTrigger>
              <AccordionContent className="p-4">
                <PodcastPlayer />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
