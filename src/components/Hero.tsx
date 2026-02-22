import { Scissors } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <Scissors className="w-8 h-8 text-amber-500" />
          <span className="text-2xl font-bold text-white">Murat Doğan</span>
        </div>
        <div className="hidden md:flex gap-8 text-white">
          <a href="#services" className="hover:text-amber-500 transition-colors">Hizmetler</a>
          <a href="#about" className="hover:text-amber-500 transition-colors">Hakkımızda</a>
          <a href="#gallery" className="hover:text-amber-500 transition-colors">Galeri</a>
          <a href="#contact" className="hover:text-amber-500 transition-colors">İletişim</a>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center px-4">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Erkek Kuaförü<br />
          <span className="text-amber-500">Murat Doğan</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl">
          Profesyonel saç ve sakal bakımı ile stilinizi yansıtın
        </p>
        <a
          href="#contact"
          className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg"
        >
          Randevu Al
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}
