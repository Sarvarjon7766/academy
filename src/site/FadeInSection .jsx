// components/FadeInSection.jsx
import React from 'react';
import { InView } from 'react-intersection-observer';

const FadeInSection = ({ children }) => {
  return (
    <InView triggerOnce={true}>
      {({ inView, ref }) => (
        <div
          ref={ref}
          className={`transition-opacity duration-1000 ease-out ${inView ? 'opacity-100' : 'opacity-0'} `}
        >
          {children}
        </div>
      )}
    </InView>
  );
};

export default FadeInSection;
