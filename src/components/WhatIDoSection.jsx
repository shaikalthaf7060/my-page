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
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`what-content ${activeIdx === idx ? 'what-content-active' : 'what-noTouch'}`}
              onMouseEnter={() => setActiveIdx(idx)}
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
              <div className="what-arrow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
