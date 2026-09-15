import React from 'react';

export default function CareerSection() {
  const careers = [
    {
      role: 'Lead Developer & Designer',
      company: 'Freelance & Indie Projects',
      time: 'NOW',
      desc: 'Building modern responsive web applications, interactive 3D portfolios, and automated cloud workflows for global clients.'
    },
    {
      role: 'Full Stack Web Developer',
      company: 'Digital Solutions',
      time: '2023–25',
      desc: 'Engineered high-performance web platforms, REST APIs, dynamic databases, responsive interfaces, and automated integrations.'
    },
    {
      role: 'Frontend Developer',
      company: 'Creative Studio',
      time: '2021–23',
      desc: 'Developed fluid interactive web apps, motion graphics, reusable component design systems, and cross-browser experiences.'
    },
    {
      role: 'Computer Science Graduate',
      company: 'B.Tech CS Engineering',
      time: '2019–23',
      desc: 'Specialized in Software Engineering, Algorithms, Database Systems, Web Technologies, and Interactive User Interfaces.'
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
