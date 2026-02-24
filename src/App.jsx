import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CalModal from './components/CalModal';
import PreloaderOverlay from './components/PreloaderOverlay';
import FinancePage from './pages/FinancePage';
import HoustonPage from './pages/HoustonPage';
import { CalModalProvider } from './context/CalModalContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <BrowserRouter>
      <CalModalProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<FinancePage />} />
              <Route path="/houston" element={<HoustonPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <CalModal />
        <PreloaderOverlay />
      </CalModalProvider>
    </BrowserRouter>
  );
}

export default App;
