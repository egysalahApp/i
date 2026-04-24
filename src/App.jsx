import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LessonViewer from './components/LessonViewer';
import { validateLesson } from './lib/schemas';

// Admin Components
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import LessonEditor from './components/admin/LessonEditor';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحقق...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function LessonWrapper() {
  const { lessonId } = useParams();
  const [appData, setAppData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    async function fetchLesson() {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
        
      if (error) {
        console.error("Error fetching lesson:", error);
        setError(error);
      } else if (data) {
        // Convert snake_case back to camelCase for the components
        const formattedData = {
          id: data.id,
          pageTitle: data.page_title,
          headerTitle: data.header_title,
          headerSubtitle: data.header_subtitle,
          youtubeLink: data.youtube_link,
          copyright: data.copyright,
          sections: data.sections
        };

        // Validate data structure before rendering
        const validation = validateLesson(formattedData);
        if (!validation.success) {
          console.error("Validation failed for lesson:", validation.errors);
          setError({ message: "خطأ في هيكلة بيانات الدرس: " + validation.errors[0] });
          setLoading(false);
          return;
        }

        setAppData(validation.data);
      }
      setLoading(false);
    }
    
    fetchLesson();
  }, [lessonId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-slate-600">جاري تحميل الدرس...</h1>
        </div>
      </div>
    );
  }

  // If the lesson ID is not found or error
  if (error || !appData) {
    const isValidationError = error && error.message && error.message.includes('هيكلة بيانات');
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-700 mb-4">
            {isValidationError ? 'خطأ في بيانات الدرس' : 'الدرس غير موجود'}
          </h1>
          <p className="text-slate-500 mb-6">
            {isValidationError 
              ? error.message 
              : 'تأكد من الرابط أو قم بإعادة رفع الدرس عبر لوحة التحكم.'}
          </p>
          <div className="flex justify-center gap-3">
             <a href="/" className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold">الرئيسية</a>
             <a href="/admin" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">لوحة التحكم</a>
          </div>
        </div>
      </div>
    );
  }

  // Use key={lessonId} to force remounting the viewer when switching lessons
  return <LessonViewer key={lessonId} APP_DATA={appData} />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/lessons" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/lessons/:id" 
          element={
            <ProtectedRoute>
              <LessonEditor />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes */}
        <Route path="/:lessonId" element={<LessonWrapper />} />
        <Route path="/" element={
           <div className="flex items-center justify-center min-h-screen bg-slate-50">
             <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
               <h1 className="text-2xl font-bold text-slate-700 mb-2">مرحبًا بك في المنصة التعليمية</h1>
               <p className="text-slate-500 mb-6">يرجى استخدام الرابط المباشر الخاص بالدرس للدخول.</p>
             </div>
           </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
