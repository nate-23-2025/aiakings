import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CalModal from './components/CalModal';
import QualificationForm from './components/QualificationForm';
import PreloaderOverlay from './components/PreloaderOverlay';
import MainLandingPage from './pages/MainLandingPage';
import GoToMarketPage from './pages/GoToMarketPage';
import AgenticAIPage from './pages/AgenticAIPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { CalModalProvider } from './context/CalModalContext';
import { QualFormProvider } from './context/QualFormContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <BrowserRouter>
      <CalModalProvider>
        <QualFormProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<MainLandingPage />} />
                <Route path="/go-to-market" element={<GoToMarketPage />} />
                <Route path="/agentic-ai" element={<AgenticAIPage />} />
                {/* <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} /> */}
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
  );
}

export default App;
