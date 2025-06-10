import React from 'react';
import {
  Navbar, Slider, Intro, About, Curriculum, IntroCard,
  Application, Contact, Footer, NavigationIcon, Announcement,FadeInSection
} from './';


const Home = () => {
  return (
    <div className="w-full h-full bg-white overflow-x-hidden relative">
      {/* Navbar */}
      <div className="pb-19">
        <Navbar />
      </div>

      {/* Slider */}
      <div className="py-6">
        <Slider />
      </div>

      {/* Components with fade-in */}
      <FadeInSection><Intro /></FadeInSection>
      <FadeInSection><About /></FadeInSection>
      <FadeInSection><Curriculum /></FadeInSection>
      <FadeInSection><IntroCard /></FadeInSection>
      <FadeInSection><Announcement /></FadeInSection>
      <FadeInSection><Application /></FadeInSection>
      <FadeInSection><Contact /></FadeInSection>

      {/* Footer */}
      <div className="pt-6">
        <Footer />
      </div>

      {/* Scroll To Top */}
      <NavigationIcon />
    </div>
  );
};

export default Home;
