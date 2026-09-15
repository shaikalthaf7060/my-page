import React from 'react';

export default function Navbar() {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'What I Do', href: '#what-i-do' },
    { label: 'Work', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'Career', href: '#career' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="header">
      <a href="#" className="navbar-title" data-cursor="disable">
        SHAIK ALTHAF
      </a>

      <div className="navbar-connect">
        <a 
          href="mailto:shaikalthaf7060@gmail.com" 
          className="hover-link"
          data-cursor="disable"
        >
          <div className="hover-in">
            <span>shaikalthaf7060@gmail.com</span>
            <div>shaikalthaf7060@gmail.com</div>
          </div>
        </a>
      </div>

      <ul>
        {navItems.map((item, idx) => (
          <li key={idx}>
            <a href={item.href} className="hover-link" data-cursor="disable">
              <div className="hover-in">
                <span>{item.label}</span>
                <div>{item.label}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
