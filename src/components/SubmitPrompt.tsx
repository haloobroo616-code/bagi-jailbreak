import React, { useState } from 'react';
import { AI_MODELS } from '../types';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export function SubmitPrompt() {
  const [name, setName] = useState('');
  const [model, setModel] = useState(AI_MODELS[0]);
  const [message, setMessage] = useState('');
  const [promptText, setPromptText] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !promptText.trim()) return;

    setStatus('submitting');
    try {
      await addDoc(collection(db, 'prompts'), {
        name,
        model,
        message,
        promptText,
        createdAt: serverTimestamp()
      });

      setStatus('success');
      setName('');
      setMessage('');
      setPromptText('');
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'prompts');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Bagikan Prompt Jailbreak
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-neutral-400">
              Nama / Nickname
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Hackerz99"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium text-neutral-400">
              Target AI
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors appearance-none"
            >
              {AI_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-neutral-400">
              Kata-kata nya bang/kak
            </label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pesan tambahan (opsional)..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="promptText" className="text-sm font-medium text-neutral-400">
              Prompt Jailbreak (Unlimited Characters)
            </label>
            <textarea
              id="promptText"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste prompt jailbreak kamu di sini..."
              required
              rows={8}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors resize-y font-mono text-sm leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting' || !name.trim() || !promptText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Prompt Terkirim!
              </>
            ) : status === 'error' ? (
              <>
                <AlertCircle className="w-5 h-5" />
                Gagal Mengirim
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Kirim Prompt
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
