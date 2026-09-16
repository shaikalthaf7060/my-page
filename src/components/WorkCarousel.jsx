import React, { useState } from 'react';

export default function WorkCarousel() {
  const [slide, setSlide] = useState(0);

  const projects = [
    {
      title: 'Recipe-GPT',
      category: 'Conversational AI Recipe & Meal Assistant',
      tools: 'React · Vite · Tailwind CSS · Generative AI APIs · LocalStorage',
      image: '/images/recipe-gpt.png',
      link: 'https://github.com/shaikalthaf7060/recipe-gpt'
    },
    {
      title: 'Fast Speed Checker',
      category: 'Real-Time Bandwidth & Latency Engine',
      tools: 'JavaScript · HTML5 · CSS3 · Web Streams API · 10 Languages · Dark Mode',
      image: '/images/fast-speed.png',
      link: 'https://github.com/shaikalthaf7060/fast-speed-checker'
    },
    {
      title: 'Menu AI — Dietary Concierge',
      category: 'Multimodal Menu Scanner & Allergen Safety',
      tools: 'React · FastAPI · Python · Google Gemini Vision AI · Glassmorphism',
      image: '/images/menu-ai.png',
      link: 'https://github.com/shaikalthaf7060/smart-menu-ai'
    },
    {
      title: 'SharkTank AI — Startup Evaluator',
      category: 'IEEE ICSSIT 2026 Research & Concept Scoring',
      tools: 'React · Node.js · LLM Agent Chains · Market Intelligence · Tailwind CSS',
      image: '/images/sharktank.png',
      link: 'https://sharktank-green.vercel.app'
    }
  ];

  const prevSlide = () => setSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  const nextSlide = () => setSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));

  return (
    <section className="work-section" id="work">
      <div className="work-container section-container">
        <h2>My <span>Work</span></h2>

        <div className="carousel-wrapper">
          <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide} aria-label="Previous" data-cursor="disable">
            ‹
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide} aria-label="Next" data-cursor="disable">
            ›
          </button>

          <div className="carousel-track-container">
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
                        <div className="work-image-in">
                          <img src={proj.image} alt={proj.title} />
                          <a href={proj.link} target="_blank" rel="noreferrer" className="work-link" data-cursor="disable">
                            ↗
                          </a>
                        </div>
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
