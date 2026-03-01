import { Scissors, Sparkles, Wind, Palette } from 'lucide-react';

const services = [
  {
    icon: Scissors,
    title: 'Saç Kesimi',
    description: 'Modern ve klasik saç kesim teknikleri ile stilinizi tamamlayın',
    price: '600 TL' // Fiyat güncellendi
  },
  {
    icon: Wind,
    title: 'Sakal Bakımı',
    description: 'Profesyonel ustura tıraşı ve sakal düzenleme hizmeti',
    price: '400 TL' // Fiyat güncellendi
  },
  {
    icon: Sparkles,
    title: 'Saç Sakal Kesimi', // İsim güncellendi
    description: 'Saç kesimi ve sakal bakımının bir arada olduğu paket hizmet',
    price: '800 TL' // Fiyat güncellendi
  },
  {
    icon: Palette,
    title: 'Saç Boyama',
    description: 'Profesyonel boya uygulaması ve renk danışmanlığı',
    price: '1000 TL' // Fiyat güncellendi
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-xl text-gray-600">
            Size özel profesyonel bakım hizmetleri
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-slate-50 p-8 rounded-xl hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-200"
            >
              <div className="bg-amber-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <p className="text-3xl font-bold text-amber-500">
                {service.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}