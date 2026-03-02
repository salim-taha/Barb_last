import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
import { Trash2, Plus, LogOut, Calendar, User, Phone, Scissors, Clock } from 'lucide-react';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newAppt, setNewAppt] = useState({
    name: '', phone: '', email: 'dukkan@otonova.com', service: 'Saç Kesimi - 600 TL', barber: 'Murat Bey', date: '', time: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchAppointments();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchAppointments();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    if (data) setAppointments(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Giriş başarısız! Bilgileri kontrol edin.");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu randevuyu silmek istediğinize emin misiniz?')) {
      await supabase.from('appointments').delete().eq('id', id);
      fetchAppointments();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('appointments').insert([newAppt]);
    if (!error) {
      setShowAddForm(false);
      fetchAppointments();
      setNewAppt({ name: '', phone: '', email: 'dukkan@otonova.com', service: 'Saç Kesimi - 600 TL', barber: 'Murat Bey', date: '', time: '' });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">otoNova</h2>
            <p className="text-slate-500 text-sm font-medium">Yönetim Paneli Girişi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="E-Posta" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900" />
            <input type="password" placeholder="Şifre" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900" />
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
              {loading ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-lg text-slate-900"><Calendar size={20} /></div>
            <h1 className="text-xl font-bold text-slate-900">Randevu Takip</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddForm(!showAddForm)} className="hidden md:flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition-all shadow-sm">
              <Plus size={18} /> Manuel Randevu
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut size={18} /> Çıkış
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {showAddForm && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100 mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Yeni Manuel Randevu (Telefon/Dükkan)</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input type="text" placeholder="Müşteri Adı" required value={newAppt.name} onChange={e => setNewAppt({...newAppt, name: e.target.value})} className="px-4 py-2 border rounded-lg" />
              <input type="tel" placeholder="Telefon" value={newAppt.phone} onChange={e => setNewAppt({...newAppt, phone: e.target.value})} className="px-4 py-2 border rounded-lg" />
              <select value={newAppt.barber} onChange={e => setNewAppt({...newAppt, barber: e.target.value})} className="px-4 py-2 border rounded-lg bg-white">
                <option>Murat Bey</option>
                <option>Kadir Bey</option>
              </select>
              <input type="date" required value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} className="px-4 py-2 border rounded-lg" />
              <input type="time" required value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} className="px-4 py-2 border rounded-lg" />
              <button type="submit" className="bg-slate-900 text-white font-bold py-2 rounded-lg hover:bg-slate-800">Kaydet</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-5 font-bold">Müşteri & İletişim</th>
                  <th className="p-5 font-bold">Hizmet</th>
                  <th className="p-5 font-bold">Zaman</th>
                  <th className="p-4 font-bold">Berber</th>
                  <th className="p-4 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Henüz randevu bulunmuyor.</td></tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-full text-slate-400"><User size={20} /></div>
                          <div>
                            <p className="font-bold">{apt.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={12} /> {apt.phone || 'Yok'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Scissors size={14} className="text-amber-500" /> {apt.service}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{apt.date}</span>
                          <span className="text-xs text-amber-600 flex items-center gap-1 font-bold"><Clock size={12} /> {apt.time}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${apt.barber === 'Murat Bey' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {apt.barber}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <button onClick={() => handleDelete(apt.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}