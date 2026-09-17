import React, { useState } from 'react';

export default function WhatIDoSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const cards = [
    {
      title: 'FULL STACK WEB DEV',
      subtitle: 'Modern Scalable Architectures',
      desc: 'Engineering responsive, high-performance web platforms and dynamic full-stack experiences with clean component hierarchies, robust RESTful APIs, and secure database integrations.',
      tags: ['React', 'JavaScript', 'HTML5 / CSS3', 'Tailwind CSS', 'Node.js', 'MySQL', 'MongoDB']
    },
    {
      title: 'APPLIED AI & AGENTIC APPS',
      subtitle: 'LLM Orchestration & Intelligent Systems',
      desc: 'Designing multimodal AI workflows, dietary assistants, and intelligent evaluation engines powered by Google Gemini, OpenAI, and Agentic frameworks with prompt engineering and RAG.',
      tags: ['Oracle Agentic AI', 'Salesforce Agentforce', 'Google Gemini', 'OpenAI APIs', 'Python', 'FastAPI']
    },
    {
      title: 'CORE CS & PROBLEM SOLVING',
      subtitle: 'Algorithmic Discipline & Clean Code',
      desc: 'Strong foundation in Data Structures and Algorithms, Object-Oriented Programming, relational database schemas, and modern Git/GitHub team collaboration workflows.',
      tags: ['Java', 'Python', 'DSA', 'DBMS / SQL', 'Git / GitHub', 'System Design']
    }
  ];

  return (
    <section className="whatIDO" id="what-i-do">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>I<span className="do-h2"> DO</span></div>
        </h2>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border1">
            <svg width="100%" height="100%">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
              <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
            </svg>
          </div>
          <div className="what-border2">
            <svg width="100%" height="100%">
              <line x1="0" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
              <line x1="100%" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
            </svg>
          </div>

          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`what-content ${activeIdx === idx ? 'what-content-active' : 'what-noTouch'}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
            >
              <div className="what-corner" />
              <div className="what-content-in">
                <h3>{card.title}</h3>
                <h4>{card.subtitle}</h4>
                <p>{card.desc}</p>
                <h5>Skillset & tools</h5>
                <div className="what-content-flex">
                  {card.tags.map((tag, tIdx) => (
                    <div key={tIdx} className="what-tags">{tag}</div>
                  ))}
                </div>
              </div>
              <div className="what-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
