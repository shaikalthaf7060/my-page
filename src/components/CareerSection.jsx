import React from 'react';

export default function CareerSection() {
  const careers = [
    {
      role: 'IEEE Research Publication Author',
      company: 'IEEE ICSSIT 2026 Conference',
      time: '2026',
      desc: 'Authored and published research paper “Leveraging Large Language Models and Real-Time Market Data for Entrepreneurial Concept Evaluation” (ISBN: 979-8-3315-8087-2). Built AI evaluation systems.'
    },
    {
      role: 'Oracle & Salesforce Certified AI Specialist',
      company: 'Oracle Foundations & Agentforce',
      time: '2025–26',
      desc: 'Earned Oracle Certified Foundations Associate (Agentic AI - Aug 2026) and Salesforce Certified Agentforce Specialist (Dec 2025). Certified in Cloud Computing (NPTEL).'
    },
    {
      role: 'B.Tech in Computer Science & Engineering',
      company: 'Santhiram Engineering College, Nandyal',
      time: '2022–26',
      desc: 'Final Year CSE Undergraduate (CGPA: 7.7). Specialized in Data Structures & Algorithms, Full-Stack Web Development, Database Management Systems, and Applied AI.'
    },
    {
      role: 'Diploma in Civil Engineering',
      company: 'Dr. K.V. Subba Reddy Institute of Tech',
      time: '2021–24',
      desc: 'Graduated with Distinction (75.01%). Built foundational discipline in analytical problem-solving, structural mathematics, and engineering fundamentals.'
    }
  ];

  return (
    <section className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br />
          experience
        </h2>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot" />
          </div>

          {careers.map((item, idx) => (
            <div key={idx} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.time}</h3>
              </div>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
