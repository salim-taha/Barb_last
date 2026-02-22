import { MapPin, Phone, CheckCircle, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Contact() {
  // FORM BİLGİLERİ (email eklendi)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', service: 'Saç Kesimi' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // E-POSTA DOĞRULAMA (OTP) İÇİN GEREKLİ STATE'LER
  const [step, setStep] = useState(1); // 1: Form Doldurma, 2: Şifre Girme
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

  // DOLU SAATLERİ ÇEKME
  useEffect(() => {
    if (!selectedDate) return;
    const fetchBookedTimes = async () => {
      const { data } = await supabase.from('appointments').select('time').eq('date', selectedDate);
      if (data) setBookedTimes(data.map(item => item.time));
      setSelectedTime('');
    };
    fetchBookedTimes();
  }, [selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. AŞAMA: DOĞRULAMA KODU GÖNDERME
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Lütfen randevu için bir tarih ve saat seçin!");
      return;
    }
    
    setLoading(true);
    
    // Supabase Auth ile E-postaya 6 Haneli Kod Gönder
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
    });

    if (error) {
      alert('Kod gönderilemedi. Lütfen geçerli bir e-posta adresi girin.');
      console.error(error);
    } else {
      setStep(2); // Şifre girme ekranına geç
    }
    setLoading(false);
  };

  // 2. AŞAMA: KODU DOĞRULAMA VE RANDEVUYU KAYDETME
  const handleVerifyAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');

    // 1. Kullanıcının girdiği kodu doğrula
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

    // 2. Kod doğruysa randevuyu kaydet
    const { error: dbError } = await supabase
      .from('appointments')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          date: selectedDate,
          time: selectedTime
        }
      ]);

    if (dbError) {
      alert('Randevu kaydedilirken bir hata oluştu.');
      console.error(dbError);
    } else {
      setSuccess(true);
      setStep(1); // Formu başa sar
      setFormData({ name: '', phone: '', email: '', service: 'Saç Kesimi' });
      setSelectedDate('');
      setSelectedTime('');
      setOtpCode('');
      setBookedTimes([]);
      setTimeout(() => setSuccess(false), 5000);
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">İletişim ve Randevu</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* SOL TARAF: İLETİŞİM */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-lg"><MapPin className="w-6 h-6 text-slate-900" /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Adres</h3>
                <p className="text-gray-600">İstanbul, Türkiye</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-lg"><Phone className="w-6 h-6 text-slate-900" /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Telefon</h3>
                <p className="text-gray-600">+90 534 439 39 46</p>
              </div>
            </div>
          </div>

          {/* SAĞ TARAF: GÜVENLİ FORM */}
          <div className="bg-slate-900 rounded-xl p-8 text-white relative">
            <h3 className="text-2xl font-bold mb-6">Randevu Formu</h3>
            
            {success && (
              <div className="mb-6 p-4 bg-green-900 border border-green-500 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Randevunuz doğrulandı ve başarıyla alındı!</span>
              </div>
            )}

            {/* ADIM 1: BİLGİLERİ GİRME EKRANI */}
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

                <div>
                  <label className="block text-sm font-medium mb-2">Hizmet</label>
                  <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white">
                    <option>Saç Kesimi</option>
                    <option>Sakal Bakımı</option>
                    <option>Komple Bakım</option>
                    <option>Saç Boyama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tarih Seçin</label>
                  <input type="date" required value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-amber-500 text-white" />
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

            {/* ADIM 2: KOD DOĞRULAMA EKRANI */}
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