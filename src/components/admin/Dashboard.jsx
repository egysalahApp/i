import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Edit, Trash2, PlusCircle, Search, Copy } from 'lucide-react';

const Dashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "لوحة تحكم المعلم | العربية السهلة";
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('id, page_title')
      .order('id');
      
    if (!error && data) {
      setLessons(data);
    }
    setLoading(false);
  };

  const filteredLessons = lessons.filter(lesson => 
    lesson.page_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleDuplicate = async (lesson) => {
    try {
      const newId = `${lesson.id}-copy-${Date.now().toString().slice(-4)}`;
      const newTitle = `${lesson.page_title} (نسخة)`;
      
      // Fetch full lesson data
      const { data, error: fetchError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lesson.id)
        .single();
      
      if (fetchError) throw fetchError;

      const { error: insertError } = await supabase
        .from('lessons')
        .insert([{
          ...data,
          id: newId,
          page_title: newTitle,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      alert('تم نسخ الدرس بنجاح!');
      fetchLessons();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء نسخ الدرس');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`هل أنت متأكد من حذف الدرس ${id}؟`)) {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (!error) {
        setLessons(lessons.filter(l => l.id !== id));
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">لوحة تحكم المعلم</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors font-medium">
          <LogOut size={18} />
          خروج
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">الدروس الحالية</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن درس..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm transition-all"
              />
            </div>
            
            <Link to="/admin/lessons/new" className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95">
              <PlusCircle size={20} />
              درس جديد
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">جاري تحميل الدروس...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{lesson.page_title}</h3>
                  <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">المعرف: {lesson.id}</span>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleDuplicate(lesson)} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-100"
                    title="نسخ الدرس"
                  >
                    <Copy size={18} />
                    نسخ
                  </button>
                  <Link to={`/admin/lessons/${lesson.id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-100">
                    <Edit size={18} />
                    تعديل
                  </Link>
                  <button onClick={() => handleDelete(lesson.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Trash2 size={18} />
                    حذف
                  </button>
                  <Link to={`/${lesson.id}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center text-indigo-600 font-medium px-4 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                    معاينة
                  </Link>
                </div>
              </div>
            ))}
            
            {filteredLessons.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 text-lg">لم نعثر على أي دروس تطابق "<b>{searchTerm}</b>"</p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="mt-2 text-indigo-600 font-medium hover:underline">مسح البحث</button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
