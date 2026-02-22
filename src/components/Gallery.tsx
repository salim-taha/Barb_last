const images = [
  '/Ekran_goruntusu_2026-02-14_114719.png',
  '/Ekran_goruntusu_2026-02-14_114207.png',
  '/Ekran_goruntusu_2026-02-14_114700.png',
  '/Ekran_goruntusu_2026-02-14_114634.png',
  '/Ekran_goruntusu_2026-02-14_114818.png',
  '/Ekran_goruntusu_2026-02-14_114747.png'
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Galeri
          </h2>
          <p className="text-xl text-gray-600">
            Çalışmalarımızdan kareler
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
