import React, { useState } from 'react';
import { X, Send, MessageSquare, Sparkles, User } from 'lucide-react';
import { Employee } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmployee: Employee;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  isMe: boolean;
  text: string;
  timestamp: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  currentEmployee,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      senderName: 'Camila Duarte',
      senderRole: 'Gerente de Escalas',
      senderAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      isMe: false,
      text: 'Olá equipe! A escala semanal já está disponível no portal. Por favor confirmem seus horários e avisem caso haja qualquer divergência.',
      timestamp: '09:00'
    },
    {
      id: 'm-2',
      senderName: 'Lucas Silva',
      senderRole: 'Analista de Atendimento',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isMe: currentEmployee.id === 'emp-1',
      text: 'Bom dia Camila! Escala conferida e ponto batido com sucesso via GPS.',
      timestamp: '09:05'
    },
    {
      id: 'm-3',
      senderName: 'Beatriz Santos',
      senderRole: 'Especialista de Suporte',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      isMe: currentEmployee.id === 'emp-2',
      text: 'Conferido também! Qualquer dúvida aviso por aqui.',
      timestamp: '09:12'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderName: currentEmployee.name,
      senderRole: currentEmployee.role,
      senderAvatar: currentEmployee.avatar,
      isMe: true,
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-white/10 overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div 
          className="px-4 py-3.5 text-white flex items-center justify-between border-b border-white/10"
          style={{ background: 'linear-gradient(110deg, #111216 0%, #171821 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white border border-white/15"
              style={{ background: 'linear-gradient(135deg, #640C1E, #F59242)' }}
            >
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm leading-tight text-white">Chat da Equipe & Gestão</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400">Comunicação corporativa em tempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
              />
              <div className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-xs ${
                msg.isMe 
                  ? 'rounded-tr-none text-white' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
              style={msg.isMe ? {
                background: 'linear-gradient(135deg, #640C1E 0%, #9F243C 100%)',
                boxShadow: '0 4px 14px rgba(100, 12, 30, 0.25)'
              } : {}}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`font-bold text-[10px] ${msg.isMe ? 'text-[#F9DE97]' : 'text-slate-900'}`}>
                    {msg.senderName}
                  </span>
                  <span className={`text-[9px] font-mono ${msg.isMe ? 'text-orange-200/80' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Digite uma mensagem para a equipe..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#9F243C] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="p-2.5 text-white disabled:opacity-40 rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #640C1E, #F59242)' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
