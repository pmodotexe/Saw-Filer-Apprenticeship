import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Montserrat:700');

        .not-found-body {
          background-color: #232a3f;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          overflow: hidden;
          font-family: 'Montserrat', sans-serif;
        }

        .room {
          position: relative;
          width: 90vw;
          max-width: 600px;
          height: 400px;
          perspective: 1200px;
        }

        .cuboid {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(25deg) rotateY(-35deg);
        }

        .cuboid .side {
          position: absolute;
          background-color: #f3f3f3;
          border: 2px solid #e1e1e1;
        }

        .cuboid .side:nth-child(1) { /* floor */
          bottom: 0;
          width: 100%;
          height: 100%;
          transform-origin: bottom center;
          transform: rotateX(90deg);
          background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .cuboid .side:nth-child(2) { /* back wall */
          width: 100%;
          height: 100%;
          transform: translateZ(-300px);
           background-image: linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .cuboid .side:nth-child(3) { /* left wall */
          width: 100%;
          height: 100%;
          transform-origin: left center;
          transform: rotateY(90deg);
          transform: translateZ(-300px) rotateY(90deg);
          background-image: linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .oops {
          position: absolute;
          top: 50px;
          left: 50px;
          color: #333;
          transform: translateZ(50px);
        }
        
        .oops h2 {
          font-size: 4rem;
          margin: 0;
          text-shadow: 2px 2px #ccc;
        }
        
        .oops p {
          font-size: 1rem;
        }

        .center-line {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hole {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #232a3f;
          box-shadow: inset 0 0 20px 10px rgba(0,0,0,0.5);
        }

        .ladder {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-5deg);
          width: 10px;
          height: 140px;
          background: linear-gradient(to bottom, #a5682a, #845422);
          box-shadow: 1px 0 2px rgba(0,0,0,0.4);
        }
        .ladder::before, .ladder::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 140px;
          background: linear-gradient(to bottom, #a5682a, #845422);
          left: 20px;
        }
        .ladder::after { left: -20px; }
        
        .ladder-shadow {
          position: absolute;
          top: 0;
          left: 50%;
          width: 35px;
          height: 150px;
          background-color: rgba(0,0,0,0.2);
          transform: translateX(-50%) translateY(10px) rotate(-5deg) skewX(-15deg);
          filter: blur(2px);
        }

        .four {
          font-size: 10rem;
          color: #444;
          text-shadow: 3px 3px 0px #e1e1e1, 6px 6px 0px rgba(0,0,0,0.2);
        }
        .four:first-of-type { margin-right: 40px; }
        .four:last-of-type { margin-left: 40px; }

        .btn {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .btn a {
          padding: 12px 24px;
          background-color: #ffc107;
          color: #232a3f;
          text-decoration: none;
          font-weight: bold;
          border-radius: 50px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        .btn a:hover {
          background-color: #ffca2c;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }
        
      `}</style>
      <div className="not-found-body">
        <motion.div 
          className="room"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="cuboid">
            <div className="side"></div>
            <div className="side"></div>
            <div className="side"></div>
          </div>
          <div className="oops">
            <h2>OOPS!</h2>
            <p>We can't find the page that you're looking for :(</p>
          </div>
          <div className="center-line">
            <div className="four">4</div>
            <div className="hole">
              <div className="ladder-shadow"></div>
              <div className="ladder"></div>
            </div>
            <div className="four">4</div>
          </div>
          <div className="btn">
            <Link to={createPageUrl('Home')}>BACK TO HOME</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}