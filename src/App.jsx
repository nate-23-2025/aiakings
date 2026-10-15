import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import DeferredOverlays from './components/DeferredOverlays';
import MainLandingPage from './pages/MainLandingPage';
import { CalModalProvider } from './context/CalModalContext';
import { QualFormProvider } from './context/QualFormContext';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

// The home page ships in the main bundle because that is where visitors land.
// Every other route is split out so it costs nothing until someone asks for it.
const MarketerPage = lazy(() => import('./pages/MarketerPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));

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
                  <Route path="/marketer" element={<MarketerPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
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
