import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import DeferredOverlays from './components/DeferredOverlays';
import MainLandingPage from './pages/MainLandingPage';
import { CalModalProvider } from './context/CalModalContext';
import { QualFormProvider } from './context/QualFormContext';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

// The home page ships in the main bundle because that is where visitors land.
// Every other route is split out so it costs nothing until someone asks for it.
const AISEOPage = lazy(() => import('./pages/AISEOPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <CalModalProvider>
        <QualFormProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<div className="min-h-screen bg-brand-primary" />}>
                <Routes>
                  <Route path="/" element={<MainLandingPage />} />
                  <Route path="/ai-seo" element={<AISEOPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <StickyCTA />
          <DeferredOverlays />
        </QualFormProvider>
      </CalModalProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
