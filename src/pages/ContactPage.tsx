import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  // Simple obfuscation
  const user = 'donald';
  const domain = 'nc3d.com';
  const email = `${user}@${domain}`;
  const phoneParts = ['(503)', '349', '8203'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* pt-16: Reduced top padding to move text up.
         px-4: Matches standard mobile padding.
         md:px-0: Removes extra side padding on desktop to align flush with header logo.
      */}
      <main className="flex-grow w-full pt-8 pb-12 px-4 md:px-0">
        
        {/* Container: 
            max-w-2xl: Keeps line lengths readable but left-aligned. 
            No 'mx-auto' ensures it stays left. 
        */}
        <div className="max-w-2xl space-y-10">
          
          {/* Section 1: Title & Text */}
          <div className="space-y-6">
            <h1 className="text-4xl font-light text-white">
              Contact Us
            </h1>

            <div className="text-gray-400 space-y-6 text-lg">
              <p>
                Have a design visualization project in mind? We'd love to hear from you!
              </p>

              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">Contact:</h3>
                <p className="font-medium text-gray-300">Donald Newlands</p>
                <p>NC3D</p>
                
                <p>
                  <a href={`tel:${phoneParts.join('-')}`} className="hover:text-white transition-colors">
                    {phoneParts[0]}-{phoneParts[1]}-{phoneParts[2]}
                  </a>
                </p>

                <p>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                    {email}
                  </a>
                </p>
              </div>
              <p>
              </p>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};

export default ContactPage;