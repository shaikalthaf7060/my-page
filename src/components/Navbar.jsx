import React from 'react';

export default function Navbar() {
  const navItems = [
    { label: 'ABOUT', href: '#about' },
    { label: 'WORK', href: '#work' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className="header">
      <a href="#" className="navbar-title" data-cursor="disable">
        SA
      </a>

      <div className="navbar-connect">
        <a 
          href="https://www.linkedin.com/in" 
          target="_blank" 
          rel="noreferrer" 
          className="hover-link"
          data-cursor="disable"
        >
          <div className="hover-in">
            <span>linkedin.com/in/shaikalthaf</span>
            <div>linkedin.com/in/shaikalthaf</div>
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
