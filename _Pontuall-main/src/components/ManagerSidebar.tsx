import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Sparkles,
  MessageSquare,
  ChevronLeft,
  CalendarRange,
  Plus,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';

export type ManagerTabId = 'escala' | 'orbit' | 'aprovacoes' | 'relatorios' | 'tarefas' | 'chat';

interface SidebarItem {
  id: ManagerTabId;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface ManagerSidebarProps {
  activeTab: ManagerTabId;
  onTabChange: (tab: ManagerTabId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCalendarOrbit: () => void;
  onAddShift: () => void;
  pendingRequestsCount: number;
  notificationsCount?: number;
  onOpenNotifications?: () => void;
  currentUser?: {
    name: string;
    avatar: string;
    role?: string;
  };
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const ManagerSidebar: React.FC<ManagerSidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  onOpenCalendarOrbit,
  onAddShift,
  pendingRequestsCount,
  notificationsCount,
  onOpenNotifications,
  currentUser,
  theme = 'dark',
  onToggleTheme,
}) => {
  const navItems: SidebarItem[] = [
    {
      id: 'orbit',
      label: 'Grade de Escalas',
      icon: <CalendarRange className="w-5 h-5" />,
    },
    {
      id: 'aprovacoes',
      label: 'Aprovações & Faltas',
      icon: <CheckCircle2 className="w-5 h-5" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : 4,
    },
    {
      id: 'relatorios',
      label: 'Relatório de Presenças',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'tarefas',
      label: 'Lembretes & Tarefas',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'chat',
      label: 'Chat Equipe',
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  const currentWidth = collapsed ? 72 : 250;
  const isDark = theme !== 'light';
  const effectiveNotifsCount = notificationsCount !== undefined ? notificationsCount : 1;
  const displayUser = currentUser || {
    name: 'Beatriz Santos',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Especialista de Suporte',
  };

  return (
    <aside
      aria-label="Navegação do Gestor"
      aria-expanded={!collapsed}
      style={{
        width: `${currentWidth}px`,
        minWidth: `${currentWidth}px`,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="bg-[#0F1117] border-r border-[#222634] flex flex-col select-none shadow-2xl relative flex-shrink-0 h-full"
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggleCollapse}
        title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#1E2230] border border-[#222634] text-slate-400 hover:text-white hover:bg-[#a42442] hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg z-50 cursor-pointer"
      >
        <ChevronLeft
          className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* Header: Logo Pontual */}
      <div className="h-[70px] flex items-center border-b border-[#222634] relative overflow-hidden flex-shrink-0">
        <div className="w-[72px] min-w-[72px] h-[70px] flex items-center justify-center flex-shrink-0">
          <img
            src="/logo-painel.png"
            alt="Logo Pontual"
            className="w-11 h-11 object-contain select-none"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div style="width:36px;height:36px;background:#a42442;border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:16px;">P</div>';
              }
            }}
          />
        </div>

        <div
          className={`flex flex-col whitespace-nowrap overflow-hidden pr-3 transition-all duration-300 ${
            collapsed ? 'opacity-0 -translate-x-2 pointer-events-none max-w-0' : 'opacity-100 translate-x-0'
          }`}
        >
          <span className="font-extrabold text-sm text-white tracking-tight leading-tight">Pontual</span>
          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Gestor Master</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2.5 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center h-12 rounded-xl text-left cursor-pointer transition-all duration-200 outline-none ${
                isActive
                  ? 'bg-gradient-to-r from-[#a42442]/30 to-[#a42442]/10 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 font-semibold'
              }`}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#a42442] shadow-[0_0_10px_#a42442]" />
              )}

              {/* Icon block (always 72px) */}
              <div className="w-[68px] min-w-[68px] h-12 flex items-center justify-center relative flex-shrink-0">
                <span
                  className={`transition-all duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#ff4d6d]' : 'text-slate-400 group-hover:text-white'
                  }`}
                >
                  {item.icon}
                </span>

                {/* Badge collapsed */}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-3 min-w-[18px] h-[18px] px-1 bg-[#a42442] text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-[#0F1117] shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label expanded */}
              <span
                className={`text-[13px] whitespace-nowrap overflow-hidden flex-1 pr-2 transition-all duration-300 ${
                  collapsed ? 'opacity-0 -translate-x-2 pointer-events-none max-w-0' : 'opacity-100 translate-x-0'
                }`}
              >
                {item.label}
              </span>

              {/* Badge expanded */}
              {!collapsed && item.badge !== undefined && (
                <span className="mr-3 min-w-[20px] h-5 px-1.5 bg-[#a42442] text-white rounded-full text-[11px] font-extrabold flex items-center justify-center">
                  {item.badge}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="pointer-events-none absolute left-[76px] px-2.5 py-1.5 rounded-lg bg-[#1E2230] border border-[#222634] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-50">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: Notificações & Perfil do Usuário */}
      <div className="border-t border-[#222634] p-2.5 flex flex-col gap-1.5 flex-shrink-0 bg-[#0c0d12]">
        {/* Botão Notificações */}
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notificações"
          className="group relative flex items-center h-12 rounded-xl text-left cursor-pointer transition-all duration-200 outline-none text-slate-400 hover:text-white hover:bg-white/5 font-semibold w-full"
        >
          {/* Bloco do Ícone (sempre alinhado e centralizado) */}
          <div className="w-[68px] min-w-[68px] h-12 flex items-center justify-center relative flex-shrink-0">
            <div className="relative inline-flex items-center justify-center">
              <Bell className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 text-slate-300 group-hover:text-white" />
              {effectiveNotifsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 bg-[#ff601f] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border-2 border-[#0F1117] shadow-sm">
                  {effectiveNotifsCount}
                </span>
              )}
            </div>
          </div>

          {/* Label expandido */}
          <span
            className={`text-[13px] whitespace-nowrap overflow-hidden flex-1 pr-2 transition-all duration-300 font-medium text-slate-200 group-hover:text-white ${
              collapsed ? 'opacity-0 -translate-x-2 pointer-events-none max-w-0' : 'opacity-100 translate-x-0'
            }`}
          >
            Notificações
          </span>

          {/* Badge expandido na extrema direita */}
          {!collapsed && effectiveNotifsCount > 0 && (
            <span
              className="mr-3 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-extrabold text-white flex items-center justify-center shadow-md"
              style={{
                background: 'linear-gradient(135deg, #f59242 0%, #ff601f 50%, #a42442 100%)',
              }}
            >
              {effectiveNotifsCount}
            </span>
          )}

          {/* Tooltip quando colapsado */}
          {collapsed && (
            <span className="pointer-events-none absolute left-[76px] px-2.5 py-1.5 rounded-lg bg-[#1E2230] border border-[#222634] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-50">
              Notificações {effectiveNotifsCount > 0 ? `(${effectiveNotifsCount})` : ''}
            </span>
          )}
        </button>

        {/* Card do Usuário / Colaborador */}
        <div className="relative group flex items-center h-12 rounded-xl transition-all duration-200 hover:bg-white/5 overflow-hidden">
          <div className="w-[68px] min-w-[68px] h-12 flex items-center justify-center relative flex-shrink-0">
            <div className="relative">
              <img
                src={displayUser.avatar}
                alt={displayUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#f59242]/70 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F1117]" />
            </div>
          </div>

          <div
            className={`flex flex-col min-w-0 overflow-hidden pr-2 transition-all duration-300 ${
              collapsed ? 'opacity-0 -translate-x-2 pointer-events-none max-w-0' : 'opacity-100 translate-x-0'
            }`}
          >
            <span className="text-xs font-bold text-white truncate leading-tight">
              {displayUser.name}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5 truncate mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              Online • GPS Ativo
            </span>
          </div>

          {/* Tooltip do usuário quando colapsado */}
          {collapsed && (
            <div className="pointer-events-none absolute left-[76px] px-2.5 py-1.5 rounded-lg bg-[#1E2230] border border-[#222634] text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-50 flex flex-col">
              <span className="font-bold">{displayUser.name}</span>
              <span className="text-[10px] text-emerald-400">● Online • GPS Ativo</span>
            </div>
          )}
        </div>

        {/* Botão de Alternar Modo Claro / Escuro */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            title={collapsed ? (isDark ? "Modo Claro" : "Modo Escuro") : undefined}
            className="group relative flex items-center h-10 rounded-xl text-left cursor-pointer transition-all duration-200 outline-none text-slate-400 hover:text-white hover:bg-white/5 font-semibold w-full mt-0.5"
          >
            <div className="w-[68px] min-w-[68px] h-10 flex items-center justify-center relative flex-shrink-0">
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 group-hover:scale-110" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-200 group-hover:scale-110" />
              )}
            </div>

            <span
              className={`text-xs whitespace-nowrap overflow-hidden flex-1 pr-2 transition-all duration-300 font-medium ${
                isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
              } ${
                collapsed ? 'opacity-0 -translate-x-2 pointer-events-none max-w-0' : 'opacity-100 translate-x-0'
              }`}
            >
              {isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </span>

            {/* Tooltip quando colapsado */}
            {collapsed && (
              <span className="pointer-events-none absolute left-[76px] px-2.5 py-1.5 rounded-lg bg-[#1E2230] border border-[#222634] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-50">
                {isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
              </span>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
