import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import DeferredOverlays from './components/DeferredOverlays';
import ScrollProgress from './components/motion/ScrollProgress';
import PointerFX from './components/motion/PointerFX';
import AmbientLight from './components/motion/AmbientLight';
import CinemaChapters from './components/motion/CinemaChapters';
import IntroOverlay from './components/intro/IntroOverlay';
import MainLandingPage from './pages/MainLandingPage';
import { CalModalProvider } from './context/CalModalContext';
import { QualFormProvider } from './context/QualFormContext';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './experience.css';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

// The home page ships in the main bundle because that is where visitors land.
// Every other route is split out so it costs nothing until someone asks for it.
const MarketerPage = lazy(() => import('./pages/MarketerPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));
const OneBrainPage = lazy(() => import('./pages/OnePage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
// Only needed from the first click on, so it loads right after the first paint.
const PageTransitions = lazy(() => import('./components/intro/PageTransitions'));

// Preserve links shared while the One Brain experience lived at the root.
const BRAIN_ANCHORS = new Set(['#services', '#crown-system', '#crown-workflow', '#work', '#crown-build', '#crown-questions', '#workflow-lab', '#crown-pillars']);
function HomeRoute() {
  const { hash } = useLocation();
  return BRAIN_ANCHORS.has(hash)
    ? <Navigate to={`/one-brain${hash}`} replace />
    : <MainLandingPage />;
}

function DeveloperRoute() {
  const { hash } = useLocation();
  return BRAIN_ANCHORS.has(hash)
    ? <Navigate to={`/one-brain${hash}`} replace />
    : <DeveloperPage />;
}

// Every in-app navigation starts at the top and fades the new page in. The
// first paint is left alone so the landing page shows up instantly.
function RouteView({ children }) {
  const { pathname, hash } = useLocation();
  const prev = useRef(pathname);

  useLayoutEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    document.documentElement.dataset.navigated = '1';
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  // Work and About are useful destinations from every page, including when
  // their homepage sections have not mounted yet. One Brain measures its own
  // pinned scenes and handles its section links inside that page.
  useEffect(() => {
    if (!hash || pathname === '/one-brain' || BRAIN_ANCHORS.has(hash)) return;
    let frame = 0;
    let nextFrame = 0;
    const observer = new MutationObserver(align);
    function align() {
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      observer.disconnect();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        nextFrame = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
      });
    }
    observer.observe(document.querySelector('main') || document.documentElement, { childList: true, subtree: true });
    align();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(nextFrame); };
  }, [pathname, hash]);

  return <div key={pathname} className="route-view">{children}</div>;
}

function App() {
  // Every scroll position (reveals, the pinned gallery) is measured once and
  // goes stale if the page above it changes height later: a font that only
  // loads when a page first uses it, a lazy page, a headline being split.
  // So re-measure whenever the page height actually changes, and when any
  // font finishes loading. Debounced, so a burst of changes is one refresh.
  // It waits for scrolling to stop: re-measuring in the middle of a smooth
  // scroll (a "jump to" link, a door card) cancels that scroll partway.
  useEffect(() => {
    let timer = 0;
    let lastScroll = 0;
    const onScroll = () => { lastScroll = Date.now(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const run = () => {
      if (Date.now() - lastScroll < 200) {
        timer = setTimeout(run, 200);
        return;
      }
      ScrollTrigger.refresh();
    };
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(run, 150);
    };
    let lastHeight = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) > 2) {
        lastHeight = h;
        refresh();
      }
    });
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);
    document.fonts?.addEventListener?.('loadingdone', refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      document.fonts?.removeEventListener?.('loadingdone', refresh);
    };
  }, []);

  return (
    <HelmetProvider>
    <BrowserRouter>
      <CalModalProvider>
        <QualFormProvider>
          <AmbientLight />
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-grow">
              <Suspense fallback={<div className="min-h-screen bg-brand-primary" />}>
                <RouteView>
                  <Routes>
                    <Route path="/" element={<HomeRoute />} />
                    <Route path="/one-brain" element={<OneBrainPage />} />
                    <Route path="/marketer" element={<MarketerPage />} />
                    <Route path="/developer" element={<DeveloperRoute />} />
                    <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
                    <Route path="/terms-of-service" element={<LegalPage kind="terms" />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </RouteView>
              </Suspense>
            </main>
            <Footer />
          </div>
          <StickyCTA />
          <Suspense fallback={null}><PageTransitions /></Suspense>
          <IntroOverlay />
          <ScrollProgress />
          <CinemaChapters />
          <PointerFX />
          <DeferredOverlays />
          <Analytics />
        </QualFormProvider>
      </CalModalProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
