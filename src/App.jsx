import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CalModal from './components/CalModal';
import QualificationForm from './components/QualificationForm';
import PreloaderOverlay from './components/PreloaderOverlay';
import MainLandingPage from './pages/MainLandingPage';
import CustomBuildsPage from './pages/CustomBuildsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { CalModalProvider } from './context/CalModalContext';
import { QualFormProvider } from './context/QualFormContext';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <CalModalProvider>
        <QualFormProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<MainLandingPage />} />
                <Route path="/custom" element={<CustomBuildsPage />} />
                {/* Legacy URL — the receptionist experience now lives on the homepage */}
                <Route path="/ai-receptionist" element={<Navigate to="/custom" replace />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <CalModal />
          <QualificationForm />
          <PreloaderOverlay />
        </QualFormProvider>
      </CalModalProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
