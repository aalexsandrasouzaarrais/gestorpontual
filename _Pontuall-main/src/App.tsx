import React, { useState } from 'react';
import { 
  EmployeeNavbar 
} from './components/EmployeeNavbar';
import { 
  EmployeeMainView 
} from './components/EmployeeMainView';
import { 
  EmployeeCalendarView 
} from './components/EmployeeCalendarView';
import { 
  ManagerView 
} from './components/ManagerView';
import { 
  ManagerRequestsModal 
} from './components/ManagerRequestsModal';
import { 
  ShiftDetailModal 
} from './components/ShiftDetailModal';
import { 
  ShiftSwapModal 
} from './components/ShiftSwapModal';
import { 
  JustificationModal 
} from './components/JustificationModal';
import { 
  NotificationsModal 
} from './components/NotificationsModal';
import { 
  ChatModal 
} from './components/ChatModal';
import { 
  INITIAL_EMPLOYEES, 
  getInitialShifts, 
  INITIAL_REQUESTS, 
  INITIAL_JUSTIFICATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REMINDERS,
  MANAGER_PROFILE
} from './data/mockData';
import { 
  Employee, 
  Shift, 
  TimeOffRequest, 
  AbsenceJustification, 
  NotificationItem 
} from './types';
import { 
  CheckCircle2, 
  Clock, 
  CalendarDays, 
  FileText, 
  ArrowLeftRight, 
  Sparkles, 
  AlertCircle,
  Plus,
  ShieldCheck,
  User,
  SlidersHorizontal,
  LayoutGrid,
  MessageSquare,
  Send,
  Sun,
  Moon
} from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { theme, isDark, toggleTheme } = useTheme();
  // Global Role Mode: 'manager' (Visual requested in photo) vs 'employee'
  const [currentRole, setCurrentRole] = useState<'manager' | 'employee'>('manager');

  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activeEmployee, setActiveEmployee] = useState<Employee>(INITIAL_EMPLOYEES[0]);
  const [shifts, setShifts] = useState<Shift[]>(getInitialShifts());
  const [requests, setRequests] = useState<TimeOffRequest[]>(INITIAL_REQUESTS);
  const [justifications, setJustifications] = useState<AbsenceJustification[]>(INITIAL_JUSTIFICATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  // Employee Tabs
  const [employeeTab, setEmployeeTab] = useState<'overview' | 'calendar' | 'requests' | 'justifications' | 'chat'>('overview');

  // Modals state
  const [selectedShiftForDetail, setSelectedShiftForDetail] = useState<Shift | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isJustificationModalOpen, setIsJustificationModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isManagerRequestsModalOpen, setIsManagerRequestsModalOpen] = useState(false);

  // Employee Chat State
  const [employeeChatMessages, setEmployeeChatMessages] = useState([
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
      isMe: activeEmployee.id === 'emp-1',
      text: 'Bom dia Camila! Escala conferida e ponto batido com sucesso via GPS.',
      timestamp: '09:05'
    },
    {
      id: 'm-3',
      senderName: 'Beatriz Santos',
      senderRole: 'Especialista de Suporte',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      isMe: activeEmployee.id === 'emp-2',
      text: 'Conferido também! Qualquer dúvida aviso por aqui.',
      timestamp: '09:12'
    }
  ]);
  const [employeeChatInput, setEmployeeChatInput] = useState('');

  const handleSendEmployeeMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeChatInput.trim()) return;
    setEmployeeChatMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        senderName: activeEmployee.name,
        senderRole: activeEmployee.role,
        senderAvatar: activeEmployee.avatar,
        isMe: true,
        text: employeeChatInput.trim(),
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setEmployeeChatInput('');
  };

  // Check-In handler for employee
  const handleCheckIn = (shiftId: string, locationData: { address: string; gpsValidated: boolean }) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        return {
          ...s,
          attendanceStatus: 'present',
          checkInTime: timeStr,
          checkInLocation: {
            latitude: -23.5505,
            longitude: -46.6333,
            address: locationData.address,
            gpsValidated: locationData.gpsValidated,
          }
        };
      }
      return s;
    }));

    // Add confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Ponto Registrado com Sucesso!',
      message: `Sua presença foi confirmada às ${timeStr} na Sede Employer (GPS Validado).`,
      type: 'system',
      timestamp: 'Agora',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Submit swap or time-off request
  const handleSubmitRequest = (req: Partial<TimeOffRequest>) => {
    const newRequest: TimeOffRequest = {
      id: `req-${Date.now()}`,
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      employeeAvatar: activeEmployee.avatar,
      type: req.type || 'swap',
      date: req.date || new Date().toISOString().split('T')[0],
      shiftId: req.shiftId,
      targetEmployeeId: req.targetEmployeeId,
      targetEmployeeName: req.targetEmployeeName,
      reason: req.reason || '',
      status: 'pending',
      createdAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setRequests(prev => [newRequest, ...prev]);
    setEmployeeTab('requests');
  };

  // Submit absence justification
  const handleSubmitJustification = (just: Partial<AbsenceJustification>) => {
    const newJust: AbsenceJustification = {
      id: `just-${Date.now()}`,
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      employeeAvatar: activeEmployee.avatar,
      shiftId: just.shiftId || '',
      date: just.date || new Date().toISOString().split('T')[0],
      reason: just.reason || '',
      documentName: just.documentName,
      documentType: just.documentType,
      status: 'pending',
      submittedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setJustifications(prev => [newJust, ...prev]);
    
    if (just.shiftId) {
      setShifts(prev => prev.map(s => s.id === just.shiftId ? { ...s, attendanceStatus: 'justified' } : s));
    }

    setEmployeeTab('justifications');
  };

  // Manager Actions
  const handleAddShift = (newShiftData: Partial<Shift>) => {
    const created: Shift = {
      id: `shift-${Date.now()}`,
      employeeId: newShiftData.employeeId || employees[0]?.id || 'emp-1',
      date: newShiftData.date || new Date().toISOString().split('T')[0],
      startTime: newShiftData.startTime || '08:00',
      endTime: newShiftData.endTime || '17:00',
      breakMinutes: newShiftData.breakMinutes || 60,
      status: 'published',
      attendanceStatus: 'pending',
      type: newShiftData.type || 'regular',
      title: newShiftData.title || 'Turno de Trabalho',
    };
    setShifts(prev => [...prev, created]);
  };

  const handleUpdateShift = (updated: Shift, notifyEmployee: boolean = true, changeReason?: string) => {
    const prevShift = shifts.find(s => s.id === updated.id);
    setShifts(prev => prev.map(s => s.id === updated.id ? updated : s));

    if ((notifyEmployee || (prevShift && prevShift.status === 'published')) && updated.status === 'published') {
      const emp = employees.find(e => e.id === updated.employeeId);
      const empName = emp?.name || 'Colaborador';
      const reasonMsg = changeReason?.trim() ? ` Motivo: "${changeReason.trim()}".` : '';
      
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Escala Alterada pelo Gestor',
        message: `Atenção: A escala de ${empName} no dia ${updated.date} foi alterada para ${updated.startTime} às ${updated.endTime} (${updated.title || 'Turno'}).${reasonMsg} Por favor, verifique seus novos horários.`,
        type: 'shift_change',
        timestamp: 'Agora',
        read: false,
        actionRequired: true,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
  };

  const handleApproveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', managerNotes: 'Aprovado pelo gestor' } : r));
  };

  const handleRejectRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', managerNotes: 'Recusado pelo gestor' } : r));
  };

  const handleApproveJustification = (id: string) => {
    setJustifications(prev => prev.map(j => j.id === id ? { ...j, status: 'approved', managerNotes: 'Homologado pelo RH' } : j));
  };

  const handleRejectJustification = (id: string) => {
    setJustifications(prev => prev.map(j => j.id === id ? { ...j, status: 'rejected', managerNotes: 'Não homologado' } : j));
  };

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees(prev => [...prev, newEmp]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Novo Colaborador Cadastrado',
      message: `${newEmp.name} foi adicionado(a) à equipe (${newEmp.role} - ${newEmp.contractType || 'CLT'}).`,
      type: 'system',
      timestamp: 'Agora',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleOpenShiftDetails = (shift: Shift) => {
    setSelectedShiftForDetail(shift);
    setIsDetailModalOpen(true);
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length + justifications.filter(j => j.status === 'pending').length;
  const myRequests = requests.filter(r => r.employeeId === activeEmployee.id || r.targetEmployeeId === activeEmployee.id);
  const myJustifications = justifications.filter(j => j.employeeId === activeEmployee.id);

  const isManagerLight = currentRole === 'manager' && !isDark;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#BBF7D0] selection:text-[#166534] ${
      isManagerLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0B0B0E] text-slate-100'
    }`}>
      
      {/* Top Global Role Switcher Bar */}
      <div className={`border-b px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors duration-200 ${
        isManagerLight 
          ? 'bg-white border-slate-200 text-slate-800 shadow-xs' 
          : 'bg-[#14141A] border-white/10 text-slate-300'
      }`}>
        <div className="flex items-center gap-3">
          <img
            src={isManagerLight ? "/logo-pontual-black.png" : "/logo-pontual-header.png"}
            alt="Pontual"
            className="h-6 sm:h-7 object-contain drop-shadow-xs transition-opacity duration-200"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Claro / Escuro) */}
          {currentRole === 'manager' && (
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDark
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 shadow-xs'
              }`}
              title={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>☀️ Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>🌙 Modo Escuro</span>
                </>
              )}
            </button>
          )}

          {/* Switcher Pill */}
          <div className={`flex items-center gap-1.5 p-1 rounded-full border transition-colors ${
            isManagerLight ? 'bg-slate-100 border-slate-200' : 'bg-[#12131A] border-white/10'
          }`}>
            <button
              onClick={() => setCurrentRole('manager')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'manager'
                  ? 'text-white shadow-md font-black'
                  : isManagerLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
              style={currentRole === 'manager' ? { background: 'linear-gradient(135deg, #96183c, #f89847)' } : {}}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>👔 Visão do Gestor</span>
            </button>

            <button
              onClick={() => setCurrentRole('employee')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'employee'
                  ? 'text-white shadow-md font-black'
                  : isManagerLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
              style={currentRole === 'employee' ? { background: 'linear-gradient(135deg, #96183c, #f89847)' } : {}}
            >
              <User className="w-3.5 h-3.5" />
              <span>👤 Portal do Colaborador</span>
            </button>
          </div>
        </div>
      </div>

      {/* RENDER VIEW ACCORDING TO ROLE */}
      {currentRole === 'manager' ? (
        /* MANAGER VIEW (Full screen width) */
        <div className={`flex-1 w-full flex flex-col min-h-0 manager-scope ${theme}`}>
          <ManagerView
            employees={employees}
            shifts={shifts}
            activeEmployee={activeEmployee}
            notificationsCount={notifications.filter(n => !n.read).length}
            onAddShift={handleAddShift}
            onUpdateShift={handleUpdateShift}
            onDeleteShift={handleDeleteShift}
            onAddEmployee={handleAddEmployee}
            onOpenRequests={() => setIsManagerRequestsModalOpen(true)}
            onOpenChat={() => setIsChatModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            onSwitchToEmployee={() => setCurrentRole('employee')}
            pendingRequestsCount={pendingRequestsCount}
          />
        </div>
      ) : (
        /* EMPLOYEE VIEW */
        <div className="flex-1 bg-slate-100 flex flex-col">
          {/* Employee Navigation Header */}
          <EmployeeNavbar
            activeEmployee={activeEmployee}
            employees={employees}
            onSelectEmployee={setActiveEmployee}
            employeeTab={employeeTab}
            onEmployeeTabChange={(tab) => {
              setEmployeeTab(tab);
            }}
            notifications={notifications}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            onSwitchToManager={() => setCurrentRole('manager')}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
            
            {/* Tab 1: Overview & Digital Punch Clock */}
            {employeeTab === 'overview' && (
              <EmployeeMainView
                employee={activeEmployee}
                shifts={shifts}
                reminders={INITIAL_REMINDERS}
                onCheckIn={handleCheckIn}
                onNavigateToCalendar={() => setEmployeeTab('calendar')}
                onNavigateToRequests={() => setEmployeeTab('requests')}
                onNavigateToJustifications={() => setEmployeeTab('justifications')}
                onShiftClick={handleOpenShiftDetails}
              />
            )}

            {/* Tab 2: Monthly / Weekly Calendar */}
            {employeeTab === 'calendar' && (
              <EmployeeCalendarView
                employee={activeEmployee}
                shifts={shifts}
                onShiftClick={handleOpenShiftDetails}
                onRequestTimeOff={() => setIsSwapModalOpen(true)}
                onSendJustification={() => setIsJustificationModalOpen(true)}
              />
            )}

            {/* Tab 3: Time Off & Swaps */}
            {employeeTab === 'requests' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <ArrowLeftRight className="w-4 h-4 text-[#166534]" />
                      Minhas Solicitações de Folga e Troca de Turno
                    </h2>
                    <p className="text-xs text-slate-500">
                      Acompanhe o status dos seus pedidos enviados para a gestão
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSwapModalOpen(true)}
                    className="px-3.5 py-2 bg-[#166534] hover:bg-emerald-800 text-[#BBF7D0] rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Nova Solicitação
                  </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myRequests.length === 0 ? (
                    <div className="md:col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                      Você ainda não possui solicitações de folga ou troca cadastradas.
                    </div>
                  ) : (
                    myRequests.map(req => (
                      <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                            req.type === 'swap' ? 'bg-[#BBF7D0] text-[#166534]' : 'bg-purple-100 text-[#6D28D9]'
                          }`}>
                            {req.type === 'swap' ? '🔄 Troca de Turno' : '🏖️ Folga Compensatória'}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            req.status === 'approved' ? 'bg-[#166534] text-[#BBF7D0]' :
                            req.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {req.status === 'approved' ? '✓ Aprovado' :
                             req.status === 'rejected' ? '✗ Rejeitado' : '○ Em Análise'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-800 font-semibold">
                          Data: <strong className="font-mono text-slate-900">{req.date}</strong>
                        </div>

                        {req.targetEmployeeName && (
                          <div className="text-xs text-slate-700">
                            Troca solicitada com: <strong>{req.targetEmployeeName}</strong>
                          </div>
                        )}

                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          "{req.reason}"
                        </p>

                        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-100">
                          <span>Enviado: {req.createdAt}</span>
                          {req.managerNotes && <span className="text-emerald-800 font-bold">{req.managerNotes}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Justifications & Medical Notes */}
            {employeeTab === 'justifications' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#166534]" />
                      Atestados Médicos & Justificativas de Ausência
                    </h2>
                    <p className="text-xs text-slate-500">
                      Comprovantes enviados para abono e auditoria de ponto
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsJustificationModalOpen(true)}
                    className="px-3.5 py-2 bg-[#166534] hover:bg-emerald-800 text-[#BBF7D0] rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Enviar Novo Atestado
                  </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myJustifications.length === 0 ? (
                    <div className="md:col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                      Nenhuma justificativa ou atestado registrado para este perfil.
                    </div>
                  ) : (
                    myJustifications.map(just => (
                      <div key={just.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-purple-100 text-[#6D28D9]">
                            📄 Atestado / Declaração
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            just.status === 'approved' ? 'bg-[#166534] text-[#BBF7D0]' :
                            just.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {just.status === 'approved' ? '✓ Homologado' :
                             just.status === 'rejected' ? '✗ Recusado' : '○ Em Análise pelo RH'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-800 font-semibold">
                          Data da Falta: <strong className="font-mono text-slate-900">{just.date}</strong>
                        </div>

                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          "{just.reason}"
                        </p>

                        {just.documentName && (
                          <div className="flex items-center gap-1.5 text-xs text-[#166534] font-bold bg-[#BBF7D0]/30 px-2 py-1 rounded border border-emerald-200">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate">{just.documentName}</span>
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                          Enviado: {just.submittedAt}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 5: Chat da Equipe */}
            {employeeTab === 'chat' && (
              <div className="space-y-4">
                {/* Header card matching requests & justifications tabs */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#166534]" />
                      Chat da Equipe & Gestão
                    </h2>
                    <p className="text-xs text-slate-500">
                      Canal corporativo em tempo real para alinhamento com a gestão e colegas de escala
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      5 Membros Online
                    </span>
                  </div>
                </div>

                {/* Main Chat Box matching employee portal design */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[580px]">
                  {/* Channel bar / quick topic */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-extrabold text-slate-900"># Canal Geral da Equipe</span>
                      <span className="text-[10px] text-slate-500">• Todos os colaboradores e gestores</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Sincronizado via Web</span>
                  </div>

                  {/* Message feed */}
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/50">
                    {employeeChatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-xs ${
                          msg.isMe 
                            ? 'bg-[#166534] text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                        }`}>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={`font-bold text-[11px] ${msg.isMe ? 'text-emerald-100' : 'text-slate-900'}`}>
                              {msg.senderName}
                            </span>
                            <span className={`text-[9px] font-mono ${msg.isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className="leading-relaxed text-xs">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick suggestion chips */}
                  <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                      Respostas rápidas:
                    </span>
                    {[
                      '✅ Ponto conferido e presença confirmada!',
                      '🔄 Gostaria de solicitar troca de turno',
                      '❓ Dúvida sobre meu plantão de sábado',
                      '📍 Chegando no posto de atendimento'
                    ].map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEmployeeChatInput(sug)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-[10px] text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendEmployeeMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      value={employeeChatInput}
                      onChange={(e) => setEmployeeChatInput(e.target.value)}
                      placeholder="Digite uma mensagem para a equipe ou coordenação..."
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-lg px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!employeeChatInput.trim()}
                      className="px-4 py-2.5 bg-[#166534] hover:bg-emerald-800 disabled:opacity-40 text-[#BBF7D0] rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* Modals */}
      <ManagerRequestsModal
        isOpen={isManagerRequestsModalOpen}
        onClose={() => setIsManagerRequestsModalOpen(false)}
        requests={requests}
        justifications={justifications}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        onApproveJustification={handleApproveJustification}
        onRejectJustification={handleRejectJustification}
      />

      <ShiftDetailModal
        shift={selectedShiftForDetail}
        employees={employees}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedShiftForDetail(null);
        }}
      />

      <ShiftSwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        currentEmployee={activeEmployee}
        employees={employees}
        myShifts={shifts.filter(s => s.employeeId === activeEmployee.id)}
        onSubmitRequest={handleSubmitRequest}
      />

      <JustificationModal
        isOpen={isJustificationModalOpen}
        onClose={() => setIsJustificationModalOpen(false)}
        currentEmployee={activeEmployee}
        shifts={shifts.filter(s => s.employeeId === activeEmployee.id)}
        onSubmitJustification={handleSubmitJustification}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        currentEmployee={activeEmployee}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
