import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Activity Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-rose-50 border-2 border-rose-200 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm fade-in min-h-[300px]">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
            <AlertOctagon className="w-10 h-10 text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-rose-800 mb-3">عذراً، حدث خطأ في هذا النشاط!</h3>
          <p className="text-rose-600 mb-8 max-w-md">
            يبدو أن هناك مشكلة فنية أو نقص في بيانات هذا القسم. لا تقلق، يمكنك متابعة باقي الأنشطة بأمان.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors shadow-sm active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة المحاولة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
