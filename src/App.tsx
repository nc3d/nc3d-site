import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage'; //

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-gray-300">
      <div className="container mx-auto max-w-5xl px-4 py-5">
        <Header />
        <main className="mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
