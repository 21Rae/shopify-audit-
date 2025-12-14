import React, { useState } from 'react';
import { Search, Loader2, Sparkles, LayoutDashboard, ArrowRight, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { analyzeStore } from './services/geminiService';
import { AuditResult } from './types';
import AuditScoreGauge from './components/AuditScoreGauge';
import SectionCard from './components/SectionCard';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Basic URL validation/cleanup
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeStore(formattedUrl);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ShopAudit AI
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Hero / Input Section */}
      <div className={`transition-all duration-500 ease-in-out ${result ? 'py-12' : 'py-32'} px-4 relative overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-100 blur-3xl opacity-50"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          {!result && (
            <>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Audit your Shopify store in <span className="text-indigo-600">seconds</span>.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Get an instant, AI-powered analysis of your store's design, UX, and marketing performance.
                Identify bottlenecks and boost your conversion rate.
              </p>
            </>
          )}

          <form onSubmit={handleAudit} className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className={`h-5 w-5 transition-colors ${loading ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'}`} />
            </div>
            <input
              type="text"
              placeholder="e.g. mystore.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg transition-all outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium rounded-xl px-6 flex items-center gap-2 transition-all transform active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
             <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center justify-center gap-2 animate-fade-in">
               <AlertCircle className="w-5 h-5" />
               {error}
             </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-fade-in-up">
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Score Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
               <h3 className="text-lg font-semibold text-slate-800 mb-4">Store Health Score</h3>
               <AuditScoreGauge score={result.overallScore} />
               <p className="mt-4 text-sm text-slate-500">Based on AI analysis of 5 key metrics</p>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Sparkles className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Executive Summary
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {result.summary}
              </p>
              
              <div className="space-y-3">
                 <h4 className="font-medium text-slate-900">Key Recommendations:</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        {rec}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Detailed Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {result.sections.map((section, idx) => (
                <SectionCard key={idx} section={section} />
              ))}
            </div>
          </div>

        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ShopAudit AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
