import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false 
  });
  
  // New state for the file
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file selection separately
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Create a FormData object to hold text + file
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('message', formData.message); // This maps to "Notes"
    data.append('newsletter', String(formData.newsletter));
    
    if (file) {
      data.append('attachment', file);
    }

    try {
      const response = await fetch('/submit-contact', {
        method: 'POST',
        // Note: Content-Type header is NOT set here; fetch sets it automatically for FormData
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '', newsletter: false });
        setFile(null);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission failed', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: '#f0fdf4', color: '#166534', borderRadius: '8px' }}>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. We will be in touch shortly.</p>
        <button onClick={() => setStatus('idle')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Send another?</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      
      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <div>
        <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <div>
        <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Notes / Message</label>
        <textarea id="message" name="message" rows={5} required value={formData.message} onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      {/* File Upload Field */}
      <div>
        <label htmlFor="attachment" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Attachment (Optional)</label>
        <input type="file" id="attachment" name="attachment" onChange={handleFileChange}
          style={{ width: '100%', padding: '0.5rem', background: '#f9f9f9' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="newsletter" name="newsletter" checked={formData.newsletter} onChange={handleChange}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        <label htmlFor="newsletter" style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
          I'd like to receive updates on new projects.
        </label>
      </div>

      <button type="submit" disabled={status === 'submitting'}
        style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: status === 'submitting' ? '#ccc' : '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: status === 'submitting' ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>Something went wrong. Please try again or email us directly.</p>
      )}
    </form>
  );
};

export default ContactForm;