/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Send, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ShieldCheck, 
  Copy,
  ChevronDown,
  Info,
  Save,
  RotateCcw,
  UserPlus,
  Users,
  Check,
  CheckSquare,
  Square,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AMBULANCE_TEAMS, 
  PPP_LIST, 
  SHIFT_DETAILS, 
  Shift, 
  AmbulanceTeam,
  PPPContact,
  STJOHN_RESPONDERS
} from './constants.ts';

export const AVAILABLE_CATEGORIES = [
  'PHC HTAR',
  'KK KAPAR',
  'KK MERU',
  'KK P.INDAH',
  'KK ANIKA',
  'KK BOTANIK',
  'KK BUKIT KUDA',
  'KK BUKIT NAGA',
  'KK PANDAMARAN',
  'KK PORT KLANG',
  'KK RANTAU PANJANG',
  'LAIN-LAIN'
];

export const getDefaultCategoryForTeam = (teamId: string): string => {
  if (teamId.startsWith('htar')) return 'PHC HTAR';
  if (teamId.startsWith('bukitkuda')) return 'KK BUKIT KUDA';
  if (teamId.startsWith('bukitnaga')) return 'KK BUKIT NAGA';
  if (teamId.startsWith('kkkapar')) return 'KK KAPAR';
  if (teamId.startsWith('meru')) return 'KK MERU';
  if (teamId.startsWith('pulauindah')) return 'KK P.INDAH';
  if (teamId.startsWith('anika')) return 'KK ANIKA';
  if (teamId.startsWith('botanik')) return 'KK BOTANIK';
  if (teamId.startsWith('pandamaran')) return 'KK PANDAMARAN';
  if (teamId.startsWith('portklang')) return 'KK PORT KLANG';
  if (teamId.startsWith('rantaupanjang')) return 'KK RANTAU PANJANG';
  return 'PHC HTAR';
};

export interface DetectedManualName {
  id: string;
  type: 'stjohn' | 'ppp';
  name: string;
  selected: boolean;
  stJohnField?: 'manualName1' | 'manualName2';
  teamId?: string;
  teamName?: string;
  category: string;
  phone: string;
}

// Helper to get current Malaysian Date and Shift
const getMalaysianStatus = () => {
  const now = new Date();
  // Adjust to UTC+8 for Malaysia
  const MY_TIME = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  
  // Use getHours() on the adjusted time or use UTC methods if you handle offsets manually
  // For simplicity since I've added 8 hours, I can use UTC methods to get the absolute MY values
  const hour = MY_TIME.getUTCHours();
  
  let shift: Shift = 'AM';
  if (hour >= 7 && hour < 14) shift = 'AM';
  else if (hour >= 14 && hour < 21) shift = 'PM';
  else shift = 'ON';
  
  const day = MY_TIME.getUTCDate();
  const monthNames = [
    'JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 
    'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'
  ];
  const monthIdx = MY_TIME.getUTCMonth();
  const month = monthNames[monthIdx];
  const year = MY_TIME.getUTCFullYear();
  
  const formattedDate = `${day} ${month} ${year}`;
  
  return { formattedDate, shift, timestamp: MY_TIME };
};

export default function App() {
  const { formattedDate, shift: defaultShift } = useMemo(getMalaysianStatus, []);

  // Custom added responders and PPPs saved in localStorage
  const [customStJohnList, setCustomStJohnList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('poz_custom_stjohn');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customPppList, setCustomPppList] = useState<PPPContact[]>(() => {
    try {
      const saved = localStorage.getItem('poz_custom_ppps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allStJohnResponders = useMemo(() => {
    const set = new Set([...STJOHN_RESPONDERS, ...customStJohnList]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [customStJohnList]);

  const allPPPList = useMemo(() => {
    return [...PPP_LIST, ...customPppList];
  }, [customPppList]);
  
  const groupedPPPs = useMemo(() => {
    const groups: Record<string, PPPContact[]> = {};
    allPPPList.forEach(ppp => {
      const cat = ppp.category || 'LAIN-LAIN';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ppp);
    });
    return groups;
  }, [allPPPList]);

  const getDefaultTeamStatuses = () => {
    const initial: Record<string, { active: boolean; pppId: string; customPppName: string; isOthersPpp: boolean; manualName1: string; manualName2: string; isOthers1: boolean; isOthers2: boolean }> = {};
    AMBULANCE_TEAMS.forEach(team => {
      initial[team.id] = { 
        active: team.defaultStatus, 
        pppId: '',
        customPppName: '',
        isOthersPpp: false,
        manualName1: team.id === 'stjohn4' ? 'AFIQ' : '',
        manualName2: team.id === 'stjohn4' ? 'YONG' : '',
        isOthers1: false,
        isOthers2: false
      };
    });
    return initial;
  };

  const [shift, setShift] = useState<Shift>(() => {
    try {
      const saved = localStorage.getItem('poz_shift');
      if (saved && (saved === 'AM' || saved === 'PM' || saved === 'ON')) {
        return saved as Shift;
      }
    } catch {
      // fallback
    }
    return defaultShift;
  });

  const [reporter, setReporter] = useState<string>(() => {
    try {
      return localStorage.getItem('poz_reporter') || '';
    } catch {
      return '';
    }
  });

  const [teamStatuses, setTeamStatuses] = useState<Record<string, { active: boolean; pppId: string; customPppName?: string; isOthersPpp?: boolean; manualName1?: string; manualName2?: string; isOthers1?: boolean; isOthers2?: boolean }>>(() => {
    const defaults = getDefaultTeamStatuses();
    try {
      const saved = localStorage.getItem('poz_team_statuses');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...defaults };
        Object.keys(parsed).forEach(id => {
          if (merged[id]) {
            merged[id] = { ...merged[id], ...parsed[id] };
          }
        });
        return merged;
      }
    } catch {
      // fallback
    }
    return defaults;
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New manual names detection & confirmation modal
  const [detectedNames, setDetectedNames] = useState<DetectedManualName[]>([]);
  const [showNewNamesModal, setShowNewNamesModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  // Auto-save state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('poz_shift', shift);
      localStorage.setItem('poz_reporter', reporter);
      localStorage.setItem('poz_team_statuses', JSON.stringify(teamStatuses));
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(timeStr);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [shift, reporter, teamStatuses]);

  const confirmResetData = () => {
    const defaults = getDefaultTeamStatuses();
    setShift(defaultShift);
    setReporter('');
    setTeamStatuses(defaults);
    try {
      localStorage.removeItem('poz_shift');
      localStorage.removeItem('poz_reporter');
      localStorage.removeItem('poz_team_statuses');
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
    setShowResetConfirm(false);
  };

  // Auto-set HTAR 4 to inactive if Shift is ON
  useEffect(() => {
    if (shift === 'ON') {
      setTeamStatuses(prev => ({
        ...prev,
        htar4: { ...prev.htar4, active: false }
      }));
    }
  }, [shift]);

  const toggleTeam = (id: string) => {
    setTeamStatuses(prev => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active }
    }));
  };

  const setTeamPPP = (id: string, pppId: string) => {
    if (pppId === 'OTHERS') {
      setTeamStatuses(prev => ({
        ...prev,
        [id]: { ...prev[id], pppId: 'OTHERS', isOthersPpp: true, customPppName: '' }
      }));
    } else {
      setTeamStatuses(prev => ({
        ...prev,
        [id]: { ...prev[id], pppId, isOthersPpp: false }
      }));
    }
  };

  const setTeamCustomPppName = (id: string, customPppName: string) => {
    setTeamStatuses(prev => ({
      ...prev,
      [id]: { ...prev[id], customPppName }
    }));
  };

  const resetTeamPpp = (id: string) => {
    setTeamStatuses(prev => ({
      ...prev,
      [id]: { ...prev[id], pppId: '', isOthersPpp: false, customPppName: '' }
    }));
  };

  const setTeamManualName = (id: string, field: 'manualName1' | 'manualName2', value: string) => {
    setTeamStatuses(prev => {
      const isOthersField = field === 'manualName1' ? 'isOthers1' : 'isOthers2';
      if (value === 'OTHERS') {
        return {
          ...prev,
          [id]: { ...prev[id], [field]: '', [isOthersField]: true }
        };
      }
      return {
        ...prev,
        [id]: { ...prev[id], [field]: value }
      };
    });
  };

  const toggleOthers = (id: string, field: 'manualName1' | 'manualName2') => {
    const isOthersField = field === 'manualName1' ? 'isOthers1' : 'isOthers2';
    setTeamStatuses(prev => ({
      ...prev,
      [id]: { ...prev[id], [isOthersField]: false, [field]: '' }
    }));
  };

  const activeCount = Object.values(teamStatuses).filter((s: { active: boolean }) => s.active).length;

  const generateMessage = () => {
    const shiftInfo = SHIFT_DETAILS[shift];
    const header = `📍Fasiliti: Hospital Tengku Ampuan Rahimah Klang (POZ HTAR)             
🕒 Syif: ${shift.toLowerCase()} (${shiftInfo.time} H)  
📅 Tarikh: ${formattedDate}

🚑 Ambulance Teams Readiness:
`;

    const activeList = AMBULANCE_TEAMS
      .filter(team => teamStatuses[team.id].active)
      .map(team => {
        const status = teamStatuses[team.id];
        let pppText = '';

        if (team.id === 'stjohn4') {
          const name1 = status.manualName1 || 'AFIQ';
          const name2 = status.manualName2 || 'YONG';
          pppText = `Team Leader_@${name1}/${name2} @TMPhone ${team.tmPhone}, @PHONE_${name2}_0168921061`;
        } else if (status.isOthersPpp || status.pppId === 'OTHERS') {
          const customName = (status.customPppName || '').trim() || 'PPP';
          pppText = `Team Leader PPP ${customName} , @TMPhone ${team.tmPhone}`;
        } else {
          const ppp = allPPPList.find(p => p.id === status.pppId);
          const phonePart = ppp?.personalPhone && ppp.personalPhone !== 'N/A' 
            ? `, @Phone_${ppp.name}_${ppp.personalPhone}` 
            : '';
          pppText = ppp 
            ? `Team Leader PPP ${ppp.name} , @TMPhone ${team.tmPhone}${phonePart}`
            : `Team Leader @PPP , @TMPhone ${team.tmPhone}`;
        }
        
        return `${team.name} – ✅ Ready. ${pppText}`;
      }).join('\n\n');

    const inactiveHeader = `\n\n----------TIDAK AKTIF -------------\n`;
    const inactiveList = AMBULANCE_TEAMS
      .filter(team => !teamStatuses[team.id].active)
      .map(team => {
        const tmPhoneTag = team.tmPhone !== 'N/A' ? `@TMPhone ${team.tmPhone}` : `@TMPhone ---`;
        return `* ${team.name} – ❌(not available) Team Leader @, ${tmPhoneTag}, @Phone_(TIDAK AKTIF UTK 999)`;
      }).join('\n\n');

    const footer = `

📊 Jumlah Unit Sedia: ${activeCount}/${AMBULANCE_TEAMS.length} 
📝 Dilaporkan oleh: ${reporter || '---'}`;

    return header + activeList + inactiveHeader + inactiveList + footer;
  };

  // Check for newly entered manual names before showing preview
  const handleJanaLaporan = () => {
    const detected: DetectedManualName[] = [];
    const existingStJohnUpper = new Set(allStJohnResponders.map(n => n.trim().toUpperCase()));
    const existingPppUpper = new Set(allPPPList.map(p => p.name.trim().toUpperCase()));

    // 1. Check St John 4 responders
    const stJohnStatus = teamStatuses['stjohn4'];
    if (stJohnStatus && stJohnStatus.active) {
      if (stJohnStatus.isOthers1 && stJohnStatus.manualName1?.trim()) {
        const name = stJohnStatus.manualName1.trim().toUpperCase();
        if (!existingStJohnUpper.has(name)) {
          detected.push({
            id: `stjohn-1-${name}`,
            type: 'stjohn',
            name,
            selected: true,
            stJohnField: 'manualName1',
            category: 'ST. JOHN',
            phone: ''
          });
        }
      }
      if (stJohnStatus.isOthers2 && stJohnStatus.manualName2?.trim()) {
        const name = stJohnStatus.manualName2.trim().toUpperCase();
        if (!existingStJohnUpper.has(name) && !detected.some(d => d.name === name)) {
          detected.push({
            id: `stjohn-2-${name}`,
            type: 'stjohn',
            name,
            selected: true,
            stJohnField: 'manualName2',
            category: 'ST. JOHN',
            phone: ''
          });
        }
      }
    }

    // 2. Check other ambulance teams for custom PPP names
    AMBULANCE_TEAMS.forEach(team => {
      if (team.id === 'stjohn4') return;
      const status = teamStatuses[team.id];
      if (status && status.active && (status.isOthersPpp || status.pppId === 'OTHERS')) {
        const name = (status.customPppName || '').trim().toUpperCase();
        if (name && !existingPppUpper.has(name) && !detected.some(d => d.name === name)) {
          detected.push({
            id: `ppp-${team.id}-${name}`,
            type: 'ppp',
            name,
            selected: true,
            teamId: team.id,
            teamName: team.name,
            category: getDefaultCategoryForTeam(team.id),
            phone: ''
          });
        }
      }
    });

    if (detected.length > 0) {
      setDetectedNames(detected);
      setShowNewNamesModal(true);
    } else {
      setShowPreview(true);
    }
  };

  const handleToggleSelectDetectedName = (id: string) => {
    setDetectedNames(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const handleUpdateDetectedCategory = (id: string, category: string) => {
    setDetectedNames(prev => prev.map(item => item.id === id ? { ...item, category } : item));
  };

  const handleUpdateDetectedPhone = (id: string, phone: string) => {
    setDetectedNames(prev => prev.map(item => item.id === id ? { ...item, phone } : item));
  };

  const handleConfirmSaveNewNames = () => {
    const selectedItems = detectedNames.filter(d => d.selected);

    if (selectedItems.length === 0) {
      setShowNewNamesModal(false);
      setShowPreview(true);
      return;
    }

    const newStJohnNamesToAdd: string[] = [];
    const newPppContactsToAdd: PPPContact[] = [];
    const updatedTeamStatuses = { ...teamStatuses };

    selectedItems.forEach(item => {
      if (item.type === 'stjohn') {
        newStJohnNamesToAdd.push(item.name);
        // Switch teamStatuses to select the newly added name cleanly
        if (item.stJohnField === 'manualName1') {
          updatedTeamStatuses['stjohn4'] = {
            ...updatedTeamStatuses['stjohn4'],
            isOthers1: false,
            manualName1: item.name
          };
        } else if (item.stJohnField === 'manualName2') {
          updatedTeamStatuses['stjohn4'] = {
            ...updatedTeamStatuses['stjohn4'],
            isOthers2: false,
            manualName2: item.name
          };
        }
      } else if (item.type === 'ppp') {
        const newId = `custom_ppp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const newContact: PPPContact = {
          id: newId,
          name: item.name,
          personalPhone: item.phone?.trim() || 'N/A',
          category: item.category || 'PHC HTAR'
        };
        newPppContactsToAdd.push(newContact);

        if (item.teamId && updatedTeamStatuses[item.teamId]) {
          updatedTeamStatuses[item.teamId] = {
            ...updatedTeamStatuses[item.teamId],
            pppId: newId,
            isOthersPpp: false,
            customPppName: ''
          };
        }
      }
    });

    if (newStJohnNamesToAdd.length > 0) {
      const updatedStJohn = Array.from(new Set([...customStJohnList, ...newStJohnNamesToAdd]));
      setCustomStJohnList(updatedStJohn);
      try {
        localStorage.setItem('poz_custom_stjohn', JSON.stringify(updatedStJohn));
      } catch (e) {
        console.error(e);
      }
    }

    if (newPppContactsToAdd.length > 0) {
      const updatedPpps = [...customPppList, ...newPppContactsToAdd];
      setCustomPppList(updatedPpps);
      try {
        localStorage.setItem('poz_custom_ppps', JSON.stringify(updatedPpps));
      } catch (e) {
        console.error(e);
      }
    }

    setTeamStatuses(updatedTeamStatuses);

    setToastMessage(`${selectedItems.length} nama baharu berjaya disimpan ke dalam senarai!`);
    setTimeout(() => setToastMessage(null), 3000);

    setShowNewNamesModal(false);
    setShowPreview(true);
  };

  const handleSkipSaveNewNames = () => {
    setShowNewNamesModal(false);
    setShowPreview(true);
  };

  const handleCancelNewNames = () => {
    setShowNewNamesModal(false);
  };

  const handleDeleteCustomStJohn = (nameToDelete: string) => {
    const updated = customStJohnList.filter(n => n !== nameToDelete);
    setCustomStJohnList(updated);
    try {
      localStorage.setItem('poz_custom_stjohn', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCustomPpp = (idToDelete: string) => {
    const updated = customPppList.filter(p => p.id !== idToDelete);
    setCustomPppList(updated);
    try {
      localStorage.setItem('poz_custom_ppps', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllCustom = () => {
    setCustomStJohnList([]);
    setCustomPppList([]);
    try {
      localStorage.removeItem('poz_custom_stjohn');
      localStorage.removeItem('poz_custom_ppps');
    } catch (e) {
      console.error(e);
    }
    setShowManageModal(false);
    setToastMessage('Semua nama tambahan telah dipadamkan.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = async () => {
    const text = generateMessage();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(generateMessage())}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-28">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">POZ HTAR KLANG</h1>
              <p className="text-sm font-medium text-slate-500">Ambulance Team Readiness Tracking</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {lastSavedTime && (
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 border border-emerald-200">
                <Save size={14} className="text-emerald-600" />
                Draf Disimpan ({lastSavedTime})
              </div>
            )}
            {(customStJohnList.length > 0 || customPppList.length > 0) && (
              <button
                onClick={() => setShowManageModal(true)}
                title="Urus nama tambahan tersimpan"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
              >
                <Users size={14} />
                Nama Tambahan ({customStJohnList.length + customPppList.length})
              </button>
            )}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Set semula data laporan"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Set Semula
            </button>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-600 border border-slate-200">
              <Calendar size={16} className="text-slate-400" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-600 border border-slate-200">
              <Clock size={16} className="text-slate-400" />
              {SHIFT_DETAILS[shift].time} H
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* Settings Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={16} className="text-red-500" /> Syif Laporan
              </label>
              <div className="relative">
                <select 
                  value={shift} 
                  onChange={(e) => setShift(e.target.value as Shift)}
                  className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all font-medium cursor-pointer"
                >
                  <option value="AM">AM (0700-1400)</option>
                  <option value="PM">PM (1400-2100)</option>
                  <option value="ON">ON (2100-0700)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User size={16} className="text-red-500" /> Nama Pelapor
              </label>
              <input 
                type="text" 
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                placeholder="Masukkan nama anda..."
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all font-medium"
              />
            </div>
          </div>
        </section>

        {/* Status Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Senarai Pasukan 
            <span className="text-xs font-normal text-slate-400">({AMBULANCE_TEAMS.length} Unit)</span>
          </h2>
          <div className="px-4 py-1.5 bg-red-600 text-white rounded-full text-sm font-bold shadow-lg shadow-red-600/20">
            KESEDIAAN: {activeCount}/{AMBULANCE_TEAMS.length}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {AMBULANCE_TEAMS.map((team) => {
            const status = teamStatuses[team.id];
            const isManualDisabled = shift === 'ON' && team.id === 'htar4';

            return (
              <motion.div 
                layout
                key={team.id}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  status.active 
                    ? 'bg-white border-slate-200 shadow-sm shadow-slate-100' 
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative group">
                    <input 
                      type="checkbox"
                      checked={status.active}
                      disabled={isManualDisabled}
                      onChange={() => toggleTeam(team.id)}
                      className={`w-12 h-6 rounded-full appearance-none transition-colors cursor-pointer ${
                        status.active ? 'bg-green-500' : 'bg-slate-300'
                      } ${isManualDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform pointer-events-none ${
                        status.active ? 'translate-x-6' : 'translate-x-0'
                      }`} 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className={`font-bold text-base transition-colors ${status.active ? 'text-slate-900' : 'text-slate-400'}`}>
                      {team.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <Phone size={12} className="text-slate-300" /> {team.tmPhone}
                      {isManualDisabled && (
                        <span className="text-red-600 font-bold flex items-center gap-1 ml-2">
                          <Info size={12} /> SHIFT ON
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 w-full md:w-72">
                  <AnimatePresence mode="wait">
                    {status.active ? (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="relative"
                      >
                        {team.id === 'stjohn4' ? (
                          <div className="flex gap-2">
                            <div className="w-1/2 relative">
                              {status.isOthers1 ? (
                                <div className="flex flex-col gap-1">
                                  <input 
                                    type="text"
                                    autoFocus
                                    value={status.manualName1}
                                    onChange={(e) => setTeamManualName(team.id, 'manualName1', e.target.value.toUpperCase())}
                                    placeholder="Nama Manual"
                                    className="w-full h-11 px-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20 outline-none"
                                  />
                                  <button 
                                    onClick={() => toggleOthers(team.id, 'manualName1')}
                                    className="text-[9px] font-black text-red-600 hover:underline text-left pl-2"
                                  >
                                    BALIK KE SENARAI
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <select 
                                    value={status.manualName1}
                                    onChange={(e) => setTeamManualName(team.id, 'manualName1', e.target.value)}
                                    className="w-full h-11 pl-4 pr-10 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20 outline-none appearance-none cursor-pointer"
                                  >
                                    <option value="">-- Nama 1 --</option>
                                    {allStJohnResponders.map(name => (
                                      <option key={`sel1-${name}`} value={name}>{name}</option>
                                    ))}
                                    <option value="OTHERS" className="text-red-500 font-bold">--- OTHERS (MANUAL) ---</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                </>
                              )}
                            </div>
                            <div className="w-1/2 relative">
                              {status.isOthers2 ? (
                                <div className="flex flex-col gap-1">
                                  <input 
                                    type="text"
                                    autoFocus
                                    value={status.manualName2}
                                    onChange={(e) => setTeamManualName(team.id, 'manualName2', e.target.value.toUpperCase())}
                                    placeholder="Nama Manual"
                                    className="w-full h-11 px-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20 outline-none"
                                  />
                                  <button 
                                    onClick={() => toggleOthers(team.id, 'manualName2')}
                                    className="text-[9px] font-black text-red-600 hover:underline text-left pl-2"
                                  >
                                    BALIK KE SENARAI
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <select 
                                    value={status.manualName2}
                                    onChange={(e) => setTeamManualName(team.id, 'manualName2', e.target.value)}
                                    className="w-full h-11 pl-4 pr-10 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20 outline-none appearance-none cursor-pointer"
                                  >
                                    <option value="">-- Nama 2 --</option>
                                    {allStJohnResponders.map(name => (
                                      <option key={`sel2-${name}`} value={name}>{name}</option>
                                    ))}
                                    <option value="OTHERS" className="text-red-500 font-bold">--- OTHERS (MANUAL) ---</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            {status.isOthersPpp || status.pppId === 'OTHERS' ? (
                              <div className="flex flex-col gap-1">
                                <input 
                                  type="text"
                                  autoFocus
                                  value={status.customPppName || ''}
                                  onChange={(e) => setTeamCustomPppName(team.id, e.target.value.toUpperCase())}
                                  placeholder="Masukkan Nama PPP (Manual)"
                                  className="w-full h-11 px-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20 outline-none"
                                />
                                <button 
                                  onClick={() => resetTeamPpp(team.id)}
                                  className="text-[9px] font-black text-red-600 hover:underline text-left pl-2"
                                >
                                  BALIK KE SENARAI
                                </button>
                              </div>
                            ) : (
                              <>
                                <select
                                  value={status.pppId}
                                  onChange={(e) => setTeamPPP(team.id, e.target.value)}
                                  className="w-full h-11 pl-4 pr-10 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20 outline-none appearance-none cursor-pointer"
                                >
                                  <option value="">-- Kenal Pasti PPP --</option>
                                  {Object.entries(groupedPPPs).map(([category, ppps]) => (
                                    <optgroup key={category} label={category}>
                                      {(ppps as PPPContact[]).map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                      ))}
                                    </optgroup>
                                  ))}
                                  <option value="OTHERS" className="text-red-600 font-bold">--- OTHERS (MANUAL) ---</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                              </>
                            )}
                          </>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-11 flex items-center justify-center px-4 bg-slate-200/50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest italic"
                      >
                        Tidak Aktif
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent flex justify-center z-40 pointer-events-none">
          <div className="w-full max-w-lg pointer-events-auto">
            <button 
              onClick={handleJanaLaporan}
              disabled={!reporter}
              className="w-full h-16 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-2xl shadow-2xl shadow-red-600/40 flex items-center justify-center gap-3 font-black text-lg transition-all transform active:scale-95 group"
            >
              <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              JANA LAPORAN LAPANGAN
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
              SILA ISI NAMA PELAPOR SEBELUM MENJANA MESEJ
            </p>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-none">PRATONTON MESEJ</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase">Sedia untuk dihantar ke WhatsApp</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <XCircle size={28} />
                </button>
              </div>
              
              <div className="flex-1 p-8 bg-slate-900 overflow-y-auto">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <pre className="text-green-400 font-mono text-[13px] whitespace-pre-wrap leading-relaxed">
                    {generateMessage()}
                  </pre>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border-t border-slate-100">
                <button 
                  onClick={handleCopy}
                  className={`h-14 flex items-center justify-center gap-3 rounded-2xl font-black transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  {copied ? 'BERJAYA DISALIN!' : 'SALIN TEKS'}
                </button>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-14 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-green-600/30 overflow-hidden relative group text-center cursor-pointer"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <Send size={20} /> BUKA WHATSAPP
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Newly Added Manual Names (Auto-Update List) */}
      <AnimatePresence>
        {showNewNamesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelNewNames}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md shadow-emerald-600/20">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      KEMAS KINI SENARAI NAMA (AUTO-UPDATE)
                    </h3>
                    <p className="text-xs font-bold text-emerald-800 mt-0.5">
                      Dikesan {detectedNames.length} nama manual baharu
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelNewNames}
                  className="p-1.5 hover:bg-slate-200/80 rounded-full transition-colors text-slate-400"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Sub-header text */}
              <div className="px-6 py-3 bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                Pilih nama yang ingin dimasukkan secara automatik ke dalam senarai rujukan bagi kegunaan masa hadapan:
              </div>

              {/* Body */}
              <div className="p-6 space-y-3.5 overflow-y-auto max-h-[50vh] bg-slate-50/50">
                {detectedNames.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.selected
                        ? 'bg-white border-emerald-300 shadow-sm'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectDetectedName(item.id)}
                        className="mt-0.5 text-emerald-600 cursor-pointer"
                        title={item.selected ? 'Nyahpilih' : 'Pilih'}
                      >
                        {item.selected ? (
                          <CheckSquare size={22} className="text-emerald-600" />
                        ) : (
                          <Square size={22} className="text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-black text-slate-900 tracking-wide">
                            {item.name}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.type === 'stjohn'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.type === 'stjohn'
                              ? 'St. John Responder'
                              : `PPP • ${item.teamName || 'Pasukan'}`}
                          </span>
                        </div>

                        {item.type === 'ppp' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5 border-t border-slate-100">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                Kategori Penugasan
                              </label>
                              <div className="relative">
                                <select
                                  value={item.category}
                                  onChange={(e) => handleUpdateDetectedCategory(item.id, e.target.value)}
                                  className="w-full h-9 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
                                >
                                  {AVAILABLE_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={14}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                No Telefon (Pilihan)
                              </label>
                              <input
                                type="text"
                                value={item.phone}
                                onChange={(e) => handleUpdateDetectedPhone(item.id, e.target.value)}
                                placeholder="cth: 0123456789"
                                className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={handleCancelNewNames}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSkipSaveNewNames}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
                >
                  Teruskan Tanpa Simpan
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveNewNames}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
                >
                  <Check size={16} />
                  Simpan ke Senarai & Teruskan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Custom Names Modal */}
      <AnimatePresence>
        {showManageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManageModal(false)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 z-10 flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      Urus Nama Tambahan Tersimpan
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {customStJohnList.length + customPppList.length} nama tambahan dalam senarai rujukan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <XCircle size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {/* Custom St John */}
                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    St. John Responders ({customStJohnList.length})
                  </h4>
                  {customStJohnList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Tiada nama tambahan St. John.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {customStJohnList.map(name => (
                        <div
                          key={`manage-stjohn-${name}`}
                          className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
                        >
                          <span>{name}</span>
                          <button
                            onClick={() => handleDeleteCustomStJohn(name)}
                            title="Padam nama ini"
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom PPP */}
                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    Penolong Pegawai Perubatan (PPP) ({customPppList.length})
                  </h4>
                  {customPppList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Tiada nama tambahan PPP.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {customPppList.map(ppp => (
                        <div
                          key={`manage-ppp-${ppp.id}`}
                          className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
                        >
                          <div>
                            <span className="font-black text-slate-900">{ppp.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium ml-2">
                              ({ppp.category} • {ppp.personalPhone})
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteCustomPpp(ppp.id)}
                            title="Padam nama ini"
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {(customStJohnList.length > 0 || customPppList.length > 0) && (
                  <button
                    onClick={handleClearAllCustom}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Padam Semua Nama Tambahan
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowManageModal(false)}
                  className="ml-auto px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 z-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <RotateCcw size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Set Semula Draf Laporan?</h3>
                  <p className="text-xs text-slate-500 font-medium">Tindakan ini tidak boleh dibatalkan</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Semua data draf semasa termasuk nama pelapor dan status pasukan akan dikembalikan kepada konfigurasi asal.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmResetData}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-colors cursor-pointer"
                >
                  Ya, Set Semula
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {(copied || toastMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 max-w-md"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage || 'Teks laporan berjaya disalin ke papan keratan!'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        :root {
          font-family: 'Plus+Jakarta+Sans', sans-serif;
        }
      `}</style>
    </div>
  );
}
