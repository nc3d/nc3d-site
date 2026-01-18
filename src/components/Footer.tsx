import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 text-left">
      <p className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()}, Newlands & Company, Inc.
      </p>
    </footer>
  );
};

export default Footer;
