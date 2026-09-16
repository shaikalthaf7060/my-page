import React from 'react';

export default function TechStack3D() {
  const techs = [
    { name: 'Java', icon: '/images/java.svg' },
    { name: 'Python', icon: '/images/python.svg' },
    { name: 'React', icon: '/images/react2.webp' },
    { name: 'JavaScript', icon: '/images/javascript.webp' },
    { name: 'Node.js', icon: '/images/node2.webp' },
    { name: 'Tailwind', icon: '/images/tailwind.svg' },
    { name: 'MySQL', icon: '/images/mysql.webp' },
    { name: 'MongoDB', icon: '/images/mongo.webp' },
    { name: 'Git / GitHub', icon: '/images/git.svg' },
    { name: 'Next.js', icon: '/images/next2.webp' }
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
