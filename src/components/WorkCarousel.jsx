import React, { useState } from 'react';

export default function WorkCarousel() {
  const [slide, setSlide] = useState(0);

  const projects = [
    {
      title: 'CallHQ.ai Voice Engine',
      category: 'Real-Time Voice AI Platform',
      tools: 'React · WebRTC · Node.js · Tailwind CSS · AI APIs',
      image: '/images/callhq.png',
      link: 'https://callhq.ai'
    },
    {
      title: 'WhatsApp Bot & Lead Automation',
      category: 'Smart Lead Capture & CRM',
      tools: 'Node.js · Express · WhatsApp Cloud API · SheetDB',
      image: '/images/whatsapp.png',
      link: '#'
    },
    {
      title: 'Broki AI Real Estate Assistant',
      category: 'AI Property Matchmaker',
      tools: 'Next.js · Python · PostgreSQL · OpenAI · Tailwind',
      image: '/images/broki.png',
      link: '#'
    },
    {
      title: 'Orrdr Digital Platform',
      category: 'Contactless Order Orchestration',
      tools: 'React · Supabase · Stripe API · Tailwind · Vercel',
      image: '/images/orrdr.png',
      link: '#'
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
