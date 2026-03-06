import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useRef } from 'react';

// Buraya istediğin Google yorumlarını yazabilirsin
const reviews = [
  { id: 1, name: "Yusuf E.", rating: 5, text: "Aldığımız ürünler çok kaliteli ve uygun fiyattaydı iyi saç kesimi de yapıyor herkese tavsiye ederim." },    
  { id: 2, name: "1ays ", rating: 5, text: "Very clean place and they are nice also they do perms but you have to ask them for it, haircuts are very good there ." },
  { id: 3, name: "Alfiya D.", rating: 5, text: "Murat bey çok güler yüzlü abimiz iki oğluşumuzun bizim tarafımızdan yalnış kesiminden sonra saçlarını başarılı bir şekilde düzeltmekle kalmadı, çok güzel çocuklarıma yakışır bir şekilde saç modeli yaptı. Çok memnunuz. Fiyat konusunda da bence uygun. Ellerine sağlık. İstanbul'daki berberimizi bulduk." },
  { id: 4, name: "M. Odabas", rating: 5, text: "Şehir dışından geldim traş olmam gerekiyordu yorumlara bakarak gittim gayet güzel traşı ve ilgili mekan temiz, hizmet güzel kesinlikle 5 Yıldız hakediyor." },
  { id: 5, name: "Ali O.", rating: 5, text: "10 senedir geliyorum bir kere bile boynum eğik gezmedim. Öğrencilerin dostu cok iyi ve yetenekli bir abimdir tavsiye ederim." }
  ];

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-slate-900 py-16 px-6 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        
        {/* ÜST KISIM: Başlık, Puan ve Google Linki */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Müşteri Yorumları</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-500">
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                </div>
                <span className="text-white font-bold text-xl">4.9</span>
                <span className="text-slate-400 text-sm">/ 5 (Google)</span>
              </div>
              
              {/* GOOGLE'DA GÖR BUTONU */}
              <div className="hidden sm:block text-slate-600">•</div>
              <a 
                href="https://www.google.com/maps/place/Erkek+Kuaf%C3%B6r%C3%BC+Murat+Do%C4%9Fan/@41.0363607,28.782665,17z/data=!3m1!4b1!4m6!3m5!1s0x14caa5f9592c8b3d:0x45deafb73e2fcbad!8m2!3d41.0363607!4d28.7852399!16s%2Fg%2F11x644pn9h?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-semibold text-sm transition-colors mt-2 sm:mt-0"
              >
                Google'da Gör <ExternalLink size={14} />
              </a>
            </div>
          </div>
          
          {/* KAYDIRMA BUTONLARI */}
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-900 transition-all shadow-lg">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll('right')} className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-900 transition-all shadow-lg">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* KAYDIRMALI YORUM KARTLARI */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {reviews.map((review) => (
            <div key={review.id} className="min-w-[280px] md:min-w-[380px] bg-slate-800/50 p-8 rounded-2xl snap-center shrink-0 border border-slate-700 hover:border-amber-500/30 transition-colors shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center font-black text-lg border border-amber-500/20">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{review.name}</h3>
                    <p className="text-xs text-slate-400">Google Yorumu</p>
                  </div>
                </div>
                <div className="flex text-amber-500">
                   {[...Array(review.rating)].map((_, i) => (
                     <Star key={i} fill="currentColor" size={14} />
                   ))}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}