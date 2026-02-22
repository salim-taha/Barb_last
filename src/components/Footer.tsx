import { Scissors, Instagram, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Scissors className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold">Murat Doğan</span>
            </div>
            <p className="text-gray-400">
              Profesyonel erkek kuaför hizmetleri ile stilinizi yansıtın.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Hizmetler
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Galeri
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-amber-500 transition-colors">
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-5 h-5 text-amber-500" />
                İstanbul, Türkiye
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-5 h-5 text-amber-500" />
                <a href="tel:+905344393946" className="hover:text-amber-500 transition-colors">
                  +90 534 439 39 46
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-amber-500" />
                <a
                  href="https://instagram.com/muratdogankuafor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  @muratdogankuafor
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Murat Doğan Erkek Kuaförü. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
