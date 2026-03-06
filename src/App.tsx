import { useState, useEffect } from 'react';
import Admin from './components/Admin';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Reviews from './components/Reviews';

function App() {
  // ==== GİZLİ KAPI KONTROLÜ ====
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };

    // URL'deki #admin kısmını anlık olarak dinliyoruz
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Eğer URL'nin sonu #admin ise, normal siteyi Kapat, SADECE Admin panelini göster
  if (isAdmin) {
    return <Admin />;
  }
  // ==============================

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Services />
      <About />
      <Reviews />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;