import React, { useState } from 'react';

export default function WorkCarousel() {
  const [slide, setSlide] = useState(0);

  const projects = [
    {
      title: 'music.k',
      category: 'Interactive 3D Music Streaming Experience',
      tools: 'React 19 · Vite · 3D Coverflow · Web Audio API · LRCLIB Lyrics · Audio Visualizer',
      image: '/images/music-k.png',
      link: 'https://shaikalthaf7060.github.io/music.k/',
      displayUrl: 'shaikalthaf7060.github.io/music.k'
    },
    {
      title: 'Recipe-GPT',
      category: 'Conversational AI Recipe & Meal Assistant',
      tools: 'React · Vite · Tailwind CSS · Generative AI APIs · LocalStorage',
      image: '/images/recipe-gpt.png',
      link: 'https://github.com/shaikalthaf7060/recipe-gpt',
      displayUrl: 'recipe-gpt.app'
    },
    {
      title: 'Fast Speed Checker',
      category: 'Real-Time Bandwidth & Latency Engine',
      tools: 'JavaScript · HTML5 · CSS3 · Web Streams API · 10 Languages · Dark Mode',
      image: '/images/fast-speed.png',
      link: 'https://github.com/shaikalthaf7060/fast-speed-checker',
      displayUrl: 'fastspeedchecker.com'
    },
    {
      title: 'Menu AI — Dietary Concierge',
      category: 'Multimodal Menu Scanner & Allergen Safety',
      tools: 'React · FastAPI · Python · Google Gemini Vision AI · Glassmorphism',
      image: '/images/menu-ai.png',
      link: 'https://github.com/shaikalthaf7060/smart-menu-ai',
      displayUrl: 'smartmenu-ai.io'
    },
    {
      title: 'SharkTank AI — Startup Evaluator',
      category: 'IEEE ICSSIT 2026 Research & Concept Scoring',
      tools: 'React · Node.js · LLM Agent Chains · Market Intelligence · Tailwind CSS',
      image: '/images/sharktank.png',
      link: 'https://sharktank-green.vercel.app',
      displayUrl: 'sharktank-green.vercel.app'
    }
  ];

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const prevSlide = () => setSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  const nextSlide = () => setSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) nextSlide();
    if (distance < -45) prevSlide();
  };

  return (
    <section className="work-section" id="work">
      <div className="work-container section-container">
        <h2>My <span>Work</span></h2>

        <div className="carousel-wrapper">
          <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide} aria-label="Previous" data-cursor="disable">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide} aria-label="Next" data-cursor="disable">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div 
            className="carousel-track-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {projects.map((proj, idx) => (
                <div key={idx} className="carousel-slide">
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{idx + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{proj.title}</h4>
                        <p className="carousel-category">{proj.category}</p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{proj.tools}</p>
                        </div>
                      </div>
                    </div>

                    <div className="carousel-image-wrapper">
                      <div className="work-image">
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="work-image-in" 
                          data-cursor="disable"
                          title={`Visit ${proj.title}`}
                        >
                          <div className="work-link">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z" />
                            </svg>
                          </div>
                          <img src={proj.image} alt={proj.title} loading="eager" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {projects.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${slide === idx ? 'carousel-dot-active' : ''}`}
                onClick={() => setSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
