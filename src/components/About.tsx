import { Award, Users, Clock } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Hakkımızda
            </h2>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Murat Doğan Erkek Kuaförü olarak, yılların deneyimi ile erkek bakım hizmetlerinde
              öncü bir marka olmayı başardık. Her müşterimize özel ilgi göstererek,
              modern ve klasik tarzları bir araya getiren profesyonel hizmet sunuyoruz.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Uzman ekibimiz, en son teknikleri kullanarak size en iyi deneyimi yaşatmak için
              çalışıyor. Hijyen ve müşteri memnuniyeti bizim önceliğimizdir.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <Award className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Profesyonel Ekip</h3>
              <p className="text-gray-400">
                Alanında uzman ve deneyimli kuaförler
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <Users className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Binlerce Mutlu Müşteri</h3>
              <p className="text-gray-400">
                Yüksek müşteri memnuniyeti ve sadakati
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <Clock className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Yılların Tecrübesi</h3>
              <p className="text-gray-400">
                Sektörde köklü ve güvenilir hizmet
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
