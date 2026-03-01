import { MapPin, Phone, Clock, Instagram, CheckCircle, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import emailjs from '@emailjs/browser';

export default function Contact() {
  // FORM BİLGİLERİ (Berber eklendi)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', service: 'Saç Kesimi - 600 TL', barber: 'Murat Bey' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // E-POSTA DOĞRULAMA (OTP) İÇİN GEREKLİ STATE'LER
  const [step, setStep] = useState(1); 
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // DOLU SAATLERİ ÇEKME (Seçilen Berbere Göre Filtrelenir!)
  useEffect(() => {
    if (!selectedDate || !formData.barber) return;
    const fetchBookedTimes = async () => {
      const { data } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', selectedDate)
        .eq('barber', formData.barber); // Sadece seçili berberin dolu saatlerini getir
      
      if (data) setBookedTimes(data.map(item => item.time));
      setSelectedTime(''); // Berber veya tarih değişirse seçili saati sıfırla
    };
    fetchBookedTimes();
  }, [selectedDate, formData.barber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==== PAZAR GÜNÜ VE GEÇMİŞ TARİH KONTROLÜ ====
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value);
    if (selected.getDay() === 0) { 
      alert("İşletmemiz Pazar günleri kapalıdır. Lütfen başka bir gün seçiniz.");
      setSelectedDate('');
    } else {
      setSelectedDate(e.target.value);
    }
  };

  // 1. AŞAMA: DOĞRULAMA KODU GÖNDERME
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Lütfen randevu için bir tarih ve saat seçin!");
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
    });

    if (error) {
      alert('Kod gönderilemedi. Lütfen geçerli bir e-posta adresi girin.');
      console.error(error);
    } else {
      setStep(2); 
    }
    setLoading(false);
  };

  // 2. AŞAMA: KODU DOĞRULAMA VE RANDEVUYU KAYDETME
  const handleVerifyAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');

    const { error: authError } = await supabase.auth.verifyOtp({
      email: formData.email,
      token: otpCode,
      type: 'email'
    });

    if (authError) {
      setOtpError('Hatalı veya süresi dolmuş kod girdiniz!');
      setLoading(false);
      return;
    }

    // 2. Kod doğruysa randevuyu kaydet (Berber bilgisiyle birlikte)
    const { error: dbError } = await supabase
      .from('appointments')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          barber: formData.barber, // <--- YENİ EKLENEN KISIM
          date: selectedDate,
          time: selectedTime
        }
      ]);

    if (dbError) {
      alert('Randevu kaydedilirken bir hata oluştu.');
      console.error(dbError);
    } else {
      // ==== YENİ EKLENEN BİLDİRİM MAİLİ KISMI ====
      emailjs.send(
        'service_8a5yygb', // EmailJS'den aldığın Service ID
        'template_6pcv0rx', // EmailJS'den aldığın Template ID
        {
          customer_name: formData.name,
          customer_phone: formData.phone,
          service: formData.service,
          barber: formData.barber,
          date: selectedDate,
          time: selectedTime
        },
        
        'QrJDTCNTUutTEB0lv' // EmailJS'den aldığın Public Key
      ).then(() => {
        console.log("Kuaföre bildirim maili başarıyla gönderildi!");
      }).catch((err) => {
        console.error("Bildirim maili gönderilemedi:", err);
      });

      emailjs.send('service_8a5yygb', 'template_kdr6m0w', {
        customer_name: formData.name,
        customer_email: formData.email, // Müşterinin mailine gider
        service: formData.service,
        barber: formData.barber,
        date: selectedDate,
        time: selectedTime
      }, 'QrJDTCNTUutTEB0lv');
      
      // ============================================

      setSuccess(true);
      setStep(1); 
      setFormData({ name: '', phone: '', email: '', service: 'Saç Kesimi', barber: 'Murat Bey' });
      setSelectedDate('');
      setSelectedTime('');
      setOtpCode('');
      setBookedTimes([]);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">İletişim ve Randevu</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* SOL TARAF: İLETİŞİM (Değişiklik yok) */}
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-xl text-slate-900 shadow-md"><MapPin size={24} /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Adres</h3>
                <p className="text-red-600">İstanbul, Türkiye </p>
                <p className="text-gray-600 mt-1">Halkalı Merkez Mahallesi, 1. Posta Sokak, No:10P, Cadde24 Çarşı, 34303 Küçükçekmece/İstanbul</p>
                <a href="https://maps.google.com/?q=Cadde24+Çarşı,+Küçükçekmece/İstanbul" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-1 inline-block">Haritada Görüntüle →</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-xl text-slate-900 shadow-md"><Phone size={24} /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Telefon</h3>
                <p className="text-gray-600 mt-1">+90 534 439 39 46</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-xl text-slate-900 shadow-md"><Clock size={24} /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Çalışma Saatleri</h3>
                <p className="text-gray-600 mt-1">Hafta İçi: 09:00 - 21:30</p>
                <p className="text-gray-600">Cumartesi: 09:00 - 23:00</p>
                <p className="text-red-900 font-medium">Pazar: Kapalı</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-xl text-slate-900 shadow-md"><Instagram size={24} /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Sosyal Medya</h3>
                <p className="text-gray-600 mt-1">@muratdogankuafor</p>
              </div>
            </div>
          </div>

          {/* SAĞ TARAF: GÜVENLİ FORM */}
          <div className="bg-slate-900 rounded-xl p-8 text-white relative shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Randevu Formu</h3>
            
            {success && (
              <div className="mb-6 p-4 bg-green-900 border border-green-500 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Randevunuz doğrulandı ve başarıyla alındı!</span>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefon</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">E-Posta (Doğrulama)</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white border-amber-500/50" placeholder="ornek@mail.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Kuaför Seçin</label>
                    <select name="barber" value={formData.barber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white">
                      <option value="Murat Bey">Murat Bey</option>
                      <option value="Kadir Bey">Kadir Bey</option>
                    </select>
                  </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Hizmet Seçin (Fiyatlı)</label>
                        <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white">
                          <optgroup label="Sık Kullanılanlar">
                            <option>Saç Kesimi - 600 TL</option>
                            <option>Sakal Tıraşı - 400 TL</option>
                            <option>Modern Saç Kesimi - 800 TL</option>
                            <option>Saç Sakal Kesimi - 800 TL</option>
                          </optgroup>
                          <optgroup label="Saç Hizmetleri">
                            <option>Fön / Yıkama Fön - 300 TL</option>
                            <option>Çocuk Tıraşı - 500 TL</option>
                            <option>Saç Yıkama - 200 TL</option>
                            <option>Damat Tıraşı - 3500~5000 TL</option>
                            <option>Kaş Yanak Alma - 600 TL</option>
                            <option>Pigmentasyon Cila (Cover) - 500 TL</option>
                          </optgroup>
                          <optgroup label="Bakım & Boya">
                            <option>Saç Bakımı - 1000 TL</option>
                            <option>Cilt Bakımı - 1000 TL</option>
                            <option>Saç Boyama - 1000 TL</option>
                            <option>Sakal Boyama - 500 TL</option>
                            <option>Bıyık Boyama - 200 TL</option>
                            <option>Keratin Bakımı - 1500~3000 TL</option>
                            <option>Brezilya Fönü - 2000 TL</option>
                            <option>Açma Boyama - 2000~4000 TL</option>
                            <option>Perma - 2500~5000 TL</option>
                            <option>Röfle-Meç-Gölge - 2500~5000 TL</option>
                          </optgroup>
                          <optgroup label="Diğer">
                            <option>Makina İle Sırt/Göğüs Alma - 250 TL</option>
                          </optgroup>
                        </select>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tarih Seçin</label>
                  <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]} 
                    value={selectedDate} 
                    onChange={handleDateChange} 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white" 
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">Saat Seçin</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {availableTimes.map((time) => {
                        const isBooked = bookedTimes.includes(time);
                        const isSelected = selectedTime === time;
                        return (
                          <button key={time} type="button" disabled={isBooked} onClick={() => setSelectedTime(time)} className={`py-2 rounded-lg font-medium transition-all ${isBooked ? 'bg-red-900/40 text-red-500 cursor-not-allowed border border-red-900' : isSelected ? 'bg-amber-500 text-slate-900 border border-amber-500 shadow-lg scale-105' : 'bg-green-900/30 text-green-400 hover:bg-green-800/60 border border-green-800'}`}>{time}</button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full mt-6 bg-amber-500 text-slate-900 py-4 rounded-lg font-bold hover:bg-amber-400 transition-all disabled:opacity-50 flex justify-center items-center gap-2 hover:scale-105">
                  <ShieldCheck className="w-5 h-5" />
                  {loading ? 'İşleniyor...' : 'Doğrulama Kodu Gönder'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyAndSave} className="space-y-6 text-center py-8">
                <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold">E-Postanızı Kontrol Edin</h4>
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">{formData.email}</strong> adresine 8 haneli bir doğrulama kodu gönderdik.
                </p>
                
                <div>
                  <input 
                    type="text" 
                    maxLength={8}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-1/2 mx-auto text-center tracking-widest text-2xl px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white" 
                    placeholder="12345678" 
                  />
                  {otpError && <p className="text-red-400 text-sm mt-2">{otpError}</p>}
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-slate-700 text-white py-4 rounded-lg font-bold hover:bg-slate-600 transition-all">
                    Geri
                  </button>
                  <button type="submit" disabled={loading} className="w-2/3 bg-amber-500 text-slate-900 py-4 rounded-lg font-bold hover:bg-amber-400 transition-all disabled:opacity-50">
                    {loading ? 'Doğrulanıyor...' : 'Onayla ve Bitir'}
                  </button>
                </div>
              </form>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
}