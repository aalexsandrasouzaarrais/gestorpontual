import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowLeftRight,
  FileText,
} from 'lucide-react';
import { NotificationItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;
  const { theme, isDark } = useTheme();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 modal-scope ${theme} ${
      isDark ? 'bg-black/80' : 'bg-slate-900/40'
    }`}>
      {/* Modal Container */}
      <div 
        className={`relative rounded-3xl shadow-2xl w-full max-w-xl border overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-200 ${
          isDark ? 'border-[#282a33] bg-[#111216]' : 'border-slate-200 bg-white'
        }`}
        style={{ boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.8)' : '0 20px 50px rgba(0,0,0,0.15)' }}
      >
        {/* Glow decorativo alaranjado/vinho LP */}
        <div 
          className="absolute -top-10 -right-10 w-72 h-52 pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245, 146, 66, 0.22) 0%, rgba(159, 36, 60, 0.18) 45%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Header */}
        <div className={`relative px-6 py-5 border-b transition-colors duration-200 ${
          isDark ? 'border-[#282a33] bg-[#15161b]/95' : 'border-slate-200 bg-slate-50/95'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Ícone com gradiente oficial */}
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #640C1E 0%, #9F243C 55%, #F59242 100%)',
                  boxShadow: '0 4px 18px rgba(100, 12, 30, 0.40)'
                }}
              >
                <Bell className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-slate-300 border border-white/10 bg-white/5 mb-1">
                  <span className="w-3 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #640C1E, #9F243C, #F59242)' }} />
                  CENTRAL DE ALERTAS
                </div>

                <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                  Minhas{' '}
                  <span style={{
                    background: 'linear-gradient(90deg, #F9DE97 0%, #F59242 52%, #9F243C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Notificações
                  </span>
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Avisos, atualizações de escala e comunicados operacionais.
                </p>
              </div>
            </div>

            {/* Botão Fechar */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-[#282a33] bg-[#0e0f12] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#F59242]/50 hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de ações */}
        <div className="px-6 py-3 bg-[#0e0f12] border-b border-[#282a33] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#F59242] bg-[#F59242]/10 border border-[#F59242]/20 font-mono">
              {notifications.length} {notifications.length === 1 ? 'aviso' : 'avisos'}
            </span>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-[#F59242] hover:text-[#ffaa66] transition-colors cursor-pointer"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        {/* Lista */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-[#111216]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14">
              <div className="w-14 h-14 rounded-full bg-[#15161b] border border-[#282a33] flex items-center justify-center mb-4 shadow-md">
                <Bell className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                Nenhuma notificação
              </h4>
              <p className="text-xs text-slate-500">
                Você está em dia com todos os seus avisos e comunicados.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="group relative p-4 rounded-2xl border transition-all duration-200"
                style={n.read ? {
                  background: '#15161b',
                  borderColor: '#282a33',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                } : {
                  background: 'linear-gradient(135deg, rgba(100, 12, 30, 0.30) 0%, rgba(159, 36, 60, 0.20) 60%, rgba(245, 146, 66, 0.12) 100%)',
                  borderColor: 'rgba(245, 146, 66, 0.35)',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.30)'
                }}
              >
                {/* Faixa lateral indicadora de não lida */}
                {!n.read && (
                  <div 
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #F59242 0%, #9F243C 100%)' }}
                  />
                )}

                <div className="flex gap-3.5 items-start pl-1">
                  {/* Ícone */}
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                      n.read
                        ? 'bg-[#0e0f12] text-slate-400 border border-[#282a33]'
                        : 'text-[#F59242] border border-[#F59242]/30'
                    }`}
                    style={!n.read ? {
                      background: 'linear-gradient(135deg, rgba(100, 12, 30, 0.5) 0%, rgba(245, 146, 66, 0.25) 100%)'
                    } : {}}
                  >
                    <Bell className="w-4 h-4" />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {n.title}
                        </h4>

                        {!n.read && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[9px] uppercase tracking-wider font-bold text-[#F59242]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59242] animate-pulse" />
                            Nova
                          </span>
                        )}
                      </div>

                      <span className="shrink-0 text-[10px] text-slate-500 font-mono">
                        {n.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0e0f12] border-t border-[#282a33] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Sincronização em tempo real ativa
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold text-white transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(90deg, #640C1E 0%, #9F243C 55%, #F59242 100%)',
              boxShadow: '0 4px 18px rgba(100, 12, 30, 0.35)'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};