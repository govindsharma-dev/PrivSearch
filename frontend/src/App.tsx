import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ImageResults from './pages/ImageResults';
import SettingsPage from './pages/Settings';
import About from './pages/About';
import Privacy from './pages/Privacy';
import CategorySearchStub from './pages/CategorySearchStub';
import './index.css';

function App() {
  const isDesktop =
    typeof window !== 'undefined' &&
    (window.location.protocol === 'file:' || !!window.electronAPI?.isElectron);
  const Router = isDesktop ? HashRouter : BrowserRouter;

  return (
    <Router>
      <SettingsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/images" element={<ImageResults />} />
            {/* Category stubs — pass query to SearXNG with matching category */}
            <Route path="/videos"  element={<CategorySearchStub category="videos"  label="Videos"  icon="smart_display" />} />
            <Route path="/news"    element={<CategorySearchStub category="news"    label="News"    icon="newspaper" />} />
            <Route path="/maps"    element={<CategorySearchStub category="map"     label="Maps"    icon="map" />} />
            <Route path="/music"   element={<CategorySearchStub category="music"   label="Music"   icon="graphic_eq" />} />
            <Route path="/science" element={<CategorySearchStub category="science" label="Science" icon="menu_book" />} />
            <Route path="/files"   element={<CategorySearchStub category="files"   label="Files"   icon="folder_zip" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about"   element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Layout>
      </SettingsProvider>
    </Router>
  );
}

export default App;
