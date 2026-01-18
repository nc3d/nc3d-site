import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-start">
      <Link to="/">
         <img src="images/nc3d_banner.png" alt="Newlands & Company, Inc. Logo" className="w-full max-w-sm h-auto" />
      </Link>
      <nav className="mt-2 flex items-center justify-start gap-4 flex-wrap">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-lg ${isActive ? 'text-white' : 'text-gray-400'} hover:text-gray-200 no-underline whitespace-nowrap`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/blog" 
          className={({ isActive }) => 
            `text-lg ${isActive ? 'text-white' : 'text-gray-400'} hover:text-gray-200 no-underline whitespace-nowrap`
          }
        >
          Blog
        </NavLink>
        <a href="https://airtable.com/appQ9RlJANG92aXAj/paggm3GGMGT46vCE1/form" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-400 hover:text-gray-200 no-underline whitespace-nowrap">Contact</a>
        <a href="https://vimeo.com/nc3d" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-400 hover:text-gray-200 no-underline whitespace-nowrap">Vimeo</a>
        <a href="https://www.linkedin.com/in/newlands/" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-400 hover:text-gray-200 no-underline whitespace-nowrap">LinkedIn</a>
      </nav>
    </header>
  );
};

export default Header;
