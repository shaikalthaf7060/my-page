import React, { useEffect, useRef } from 'react';

export default function WhatIDoSection() {
  const containerRef = useRef([]);
  const setRef = (el, index) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove('what-noTouch');
          container.addEventListener('click', () => handleClick(container));
        }
      });
    }
  }, []);

  return (
    <section className="whatIDO" id="what-i-do">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>

          <div className="what-content what-noTouch" ref={(el) => setRef(el, 0)}>
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>FULL STACK WEB DEV</h3>
              <h4>Modern Scalable Architectures</h4>
              <p>
                Engineering responsive, high-performance web platforms and dynamic full-stack experiences with clean component hierarchies, robust RESTful APIs, and secure database integrations.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">React</div>
                <div className="what-tags">JavaScript</div>
                <div className="what-tags">Node.js</div>
                <div className="what-tags">MySQL</div>
                <div className="what-tags">MongoDB</div>
                <div className="what-tags">Tailwind CSS</div>
                <div className="what-tags">RESTful APIs</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

          <div className="what-content what-noTouch" ref={(el) => setRef(el, 1)}>
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>APPLIED AI &amp; AGENTS</h3>
              <h4>LLM Orchestration &amp; Intelligent Systems</h4>
              <p>
                Designing multimodal AI workflows, intelligent evaluation engines, and agentic workflows powered by Google Gemini, OpenAI, and Oracle Agentic AI with prompt engineering and RAG.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Agentic AI</div>
                <div className="what-tags">Agentforce</div>
                <div className="what-tags">Google Gemini</div>
                <div className="what-tags">OpenAI APIs</div>
                <div className="what-tags">Python</div>
                <div className="what-tags">FastAPI</div>
                <div className="what-tags">RAG &amp; Evals</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function handleClick(container) {
  container.classList.toggle('what-content-active');
  container.classList.remove('what-sibling');
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);
    siblings.forEach((sibling) => {
      if (sibling !== container && sibling.classList.contains('what-content')) {
        sibling.classList.remove('what-content-active');
        sibling.classList.toggle('what-sibling');
      }
    });
  }
}
