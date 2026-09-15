import React from 'react';

export default function TechStack3D() {
  const techs = [
    { name: 'React', icon: '/images/react2.webp' },
    { name: 'Next.js', icon: '/images/next2.webp' },
    { name: 'TypeScript', icon: '/images/typescript.webp' },
    { name: 'JavaScript', icon: '/images/javascript.webp' },
    { name: 'Node.js', icon: '/images/node2.webp' },
    { name: 'Express', icon: '/images/express.webp' },
    { name: 'MongoDB', icon: '/images/mongo.webp' },
    { name: 'MySQL', icon: '/images/mysql.webp' }
  ];

  return (
    <section className="techstack" id="skills">
      <h2>Tech Stack</h2>
      <div className="tech-grid">
        {techs.map((tech, idx) => (
          <div key={idx} className="tech-card" data-cursor="disable">
            <img src={tech.icon} alt={tech.name} />
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
