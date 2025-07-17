import React from 'react';

const ApprenticePortalTitle = ({ value }) => (
  <div className='text'>
    {value.split('').map((char, i) => (
      <React.Fragment key={i}>
        {char === ' ' && <div className='space' />}
        {char !== ' ' && (
          <div className='letter' style={{ '--delay': `${i * 0.2}s` }}>
            <span className='source'>{char}</span>
            <span className='shadow'>{char}</span>
            <span className='overlay'>{char}</span>
          </div>
        )}
      </React.Fragment>
    ))}
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@900&display=swap');

      :root {
        --color-light-gray: #eaece5;
        --color-light-gray-lightened: #efefeb; /* manually lightened #eaece5 by 2% */
      }

      .text {
        font-family: 'Raleway', sans-serif;
        font-size: 2em; /* Adjusted for mobile responsiveness */
        position: relative;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        line-height: 1.2;
        margin-bottom: -0.5rem; /* Negative margin to bring it closer to the heading */
        color: #333; /* Default text color */
      }
      
      @media (min-width: 640px) { /* sm breakpoint */
        .text {
          font-size: 2.5em;
        }
      }

      @media (min-width: 768px) { /* md breakpoint */
        .text {
          font-size: 3em;
        }
      }

      .text .space {
        width: 0.3em;
      }

      .text .letter {
        position: relative;
        display: flex;
      }

      .text .letter .source {
        color: gray;
        -webkit-text-stroke: 0.01em rgba(0, 0, 0, 0.3);
        display: flex;
      }

      .text .letter .overlay,
      .text .letter .shadow {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        user-select: none;
      }

      .text .letter .overlay {
        background-image: linear-gradient(90deg, white 50%, var(--color-light-gray-lightened));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transform: rotateY(-30deg) skew(0, -10deg);
        transform-origin: left;
        animation: overlay 3s infinite ease-out var(--delay);
      }

      .text .letter .shadow {
        filter: blur(5px);
        background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 30%, transparent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transform: skew(0, 20deg) translateY(0.1em) translateX(0.05em);
        animation: shadow 3s infinite var(--delay);
      }

      @keyframes shadow {
        0%,
        20%,
        100% {
          transform: skew(0, 20deg) translateY(0.1em) translateX(0.05em);
          opacity: 1;
        }
        10% {
          transform: skew(0, 0) translateY(0) translateX(0);
          opacity: 0;
        }
      }

      @keyframes overlay {
        0%,
        20%,
        100% {
          transform: rotateY(-30deg) skew(0, -10deg);
        }
        10% {
          transform: rotateY(0deg) skew(0, 0);
        }
      }
    `}</style>
  </div>
);

export default ApprenticePortalTitle;