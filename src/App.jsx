import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import LessonViewer from './components/LessonViewer';
import { lessonsData } from './lessons';

function LessonWrapper() {
  const { lessonId } = useParams();
  
  // Look up the lesson data from the registry
  const appData = lessonsData[lessonId];
  
  // If the lesson ID is not found, we can navigate to a default lesson or show a 404
  if (!appData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-700 mb-4">الدرس غير موجود</h1>
          <p className="text-slate-500">تأكد من الرابط وحاول مرة أخرى.</p>
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
        <Route path="/:lessonId" element={<LessonWrapper />} />
        {/* Optional fallback if they visit the root directly */}
        <Route path="/" element={
           <div className="flex items-center justify-center min-h-screen bg-slate-50">
             <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
               <h1 className="text-2xl font-bold text-slate-700 mb-2">مرحباً بك في المنصة التعليمية</h1>
               <p className="text-slate-500 mb-6">يرجى استخدام الرابط المباشر الخاص بالدرس للدخول.</p>
             </div>
           </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
