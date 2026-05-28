import React, { useEffect, useState } from 'react';
import { JailbreakPrompt, AI_MODELS } from '../types';
import { Copy, Terminal, User, Clock, Search, CheckCheck, Maximize2, X } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export function ViewPrompts() {
  const [prompts, setPrompts] = useState<JailbreakPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<JailbreakPrompt | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'prompts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const promptsData: JailbreakPrompt[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          model: data.model,
          promptText: data.promptText,
          // Handle potential pending writes from serverTimestamp
          createdAt: data.createdAt ? new Date(data.createdAt.toMillis()).toISOString() : new Date().toISOString()
        };
      });
      setPrompts(promptsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'prompts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.model.toLowerCase().includes(search.toLowerCase()) ||
                          p.promptText.toLowerCase().includes(search.toLowerCase());
    const matchesModel = selectedModel ? p.model === selectedModel : true;
    return matchesSearch && matchesModel;
  });

  const getModelCount = (model: string) => prompts.filter(p => p.model === model).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari prompt, nama author, atau model AI..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedModel(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            selectedModel === null
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200'
          }`}
        >
          Semua
          <span className="ml-1.5 text-xs opacity-70">({prompts.length})</span>
        </button>
        {AI_MODELS.map(model => {
          const count = getModelCount(model);
          return (
            <button
              key={model}
              onClick={() => setSelectedModel(model === selectedModel ? null : model)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border flex items-center ${
                selectedModel === model
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {model}
              {count > 0 && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center ${
                  selectedModel === model ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-neutral-800/50">
          <Terminal className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400">Belum ada prompt yang dibagikan atau ditemukan.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group transition-all hover:border-neutral-700">
              
              <div className="px-5 py-4 border-b border-neutral-800/50 flex flex-wrap items-center justify-between gap-4 bg-neutral-900 font-mono text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                    <Terminal className="w-4 h-4" />
                    {prompt.model}
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <User className="w-4 h-4 text-neutral-500" />
                    {prompt.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(prompt.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => setPreviewPrompt(prompt)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-neutral-700"
                      title="Preview Full"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(prompt.promptText, prompt.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${copiedId === prompt.id ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white'}`}
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Salin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 max-h-80 overflow-y-auto no-scrollbar">
                <pre className="font-mono text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed break-all">
                  {prompt.promptText}
                </pre>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Full Screen Preview Modal */}
      {previewPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 w-full max-w-4xl h-[80vh] flex flex-col rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
              <h3 className="font-semibold flex items-center gap-2 text-lg">
                <Terminal className="w-5 h-5 text-indigo-400" />
                {previewPrompt.model}
                <span className="text-neutral-500 font-normal text-sm ml-2">oleh {previewPrompt.name}</span>
              </h3>
              <button 
                onClick={() => setPreviewPrompt(null)} 
                className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                title="Tutup Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-900/50">
              <pre className="text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed text-sm md:text-base selection:bg-indigo-500/30 selection:text-indigo-200">
                {previewPrompt.promptText}
              </pre>
            </div>
            
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/50 flex justify-end gap-3 items-center">
              <button 
                onClick={() => setPreviewPrompt(null)} 
                className="px-6 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Tutup Preview"
              >
                Tutup
              </button>
              <button 
                onClick={() => copyToClipboard(previewPrompt.promptText, previewPrompt.id)} 
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition-colors"
              >
                {copiedId === previewPrompt.id ? (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> 
                    Salin Prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
