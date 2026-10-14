/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  Activity, 
  Radio, 
  Settings, 
  LayoutDashboard, 
  Truck, 
  ArrowRight, 
  Clock, 
  Calendar, 
  User, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Edit2,
  Users,
  UserPlus
} from 'lucide-react';
import { 
  ActiveTab, 
  Shift, 
  AmbulanceTeam, 
  PPPContact, 
  MeccTeam, 
  MeccTeamStatus, 
  PozTeamStatusItem 
} from '../types.ts';
import { SHIFT_DETAILS } from '../constants.ts';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  shift: Shift;
  formattedDate: string;
  reporter: string;
  pozTeams: AmbulanceTeam[];
  pozStatuses: Record<string, PozTeamStatusItem>;
  allPPPList: PPPContact[];
  allStJohnResponders: string[];
  meccTeams: MeccTeam[];
  meccStatuses: Record<string, MeccTeamStatus>;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  shift,
  formattedDate,
  reporter,
  pozTeams,
  pozStatuses,
  allPPPList,
  allStJohnResponders,
  meccTeams,
  meccStatuses
}) => {
  // POZ Metrics
  const pozActiveCount = useMemo(() => {
    return pozTeams.filter(t => pozStatuses[t.id]?.active).length;
  }, [pozTeams, pozStatuses]);

  // MECC Metrics
  const meccStats = useMemo(() => {
    let ready = 0;
    let onCall = 0;
    let down = 0;
    let off = 0;
    meccTeams.forEach(t => {
      const s = meccStatuses[t.id]?.status || t.defaultStatus;
      if (s === 'SIAP_SEDIA') ready++;
      else if (s === 'ON_CALL') onCall++;
      else if (s === 'ROSAK' || s === 'TIADA_STAFF') down++;
      else off++;
    });
    return { ready, onCall, down, off, total: meccTeams.length };
  }, [meccTeams, meccStatuses]);

  const totalActive = pozActiveCount + meccStats.ready;
  const totalFleet = pozTeams.length + meccTeams.length;
  const totalResponders = (allPPPList?.length || 0) + (allStJohnResponders?.length || 0);

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 p-6 sm:p-10 text-white shadow-xl border border-slate-700/60">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold tracking-wide">
              <Sparkles size={14} /> PUSAT KAWALAN OPERASI • SEMUA WILAYAH
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
              MECC MANAGEMENT BOARD
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Portal sehenti pengurusan kesiapsiagaan armada ambulans MECC Management Board bagi semua wilayah terlibat (Klang, PKD Banting, Hospital Banting, Shah Alam & HASA). Sila pilih pautan modul di bawah untuk memantau status armada, mengemaskini penugasan shif, atau membuat tetapan sistem.
            </p>
            
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 font-medium">
                <Calendar size={13} className="text-rose-400" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 font-medium">
                <Clock size={13} className="text-amber-400" />
                <span>Shif: <strong className="text-white">{shift} ({SHIFT_DETAILS[shift]?.time})</strong></span>
              </span>
              {reporter && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 font-medium">
                  <User size={13} className="text-emerald-400" />
                  <span>Pelapor: <strong className="text-white">{reporter}</strong></span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Snapshot Badge */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-inner text-center shrink-0 lg:w-64">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Status Keseluruhan Armada
            </span>
            <div className="text-3xl font-black text-rose-400 mt-1">
              {totalActive} <span className="text-sm font-medium text-slate-400">/ {totalFleet} Siap</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                POZ: {pozActiveCount}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                MECC: {meccStats.ready}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Card View Links Only (As Explicitly Requested) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="text-rose-600" size={22} /> Pautan Modul Utama
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Pilih kad untuk melancarkan modul
          </span>
        </div>

        {/* 4 Primary Link Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: DASHBOARD STATUS AMBULANS (NEW CARD LINK AS REQUESTED) */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="group relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-rose-200/80 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden ring-1 ring-rose-500/10"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-50 rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex flex-col h-full justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:bg-rose-700 transition-colors">
                    <LayoutDashboard size={24} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    {totalActive} Armada Siap Sedia
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    DASHBOARD STATUS AMBULANS
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                    BARU
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Paparan komprehensif status kesemua pasukan ambulans bagi semua wilayah terlibat (Klang, Banting, Shah Alam & HASA). Membolehkan <strong>kemaskini pantas secara terus menggunakan ikon pensel</strong> serta dialog pengesahan sebelum perubahan disimpan.
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold bg-rose-50 text-rose-800 px-2.5 py-1 rounded-lg border border-rose-100 flex items-center gap-1">
                    <Edit2 size={11} /> Kemaskini Pensel
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    Semua Pasukan
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    Kotak Pengesahan
                  </span>
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                    Status Masa Nyata
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-rose-600 font-bold text-sm">
                <span>Buka Dashboard Ambulans</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: POZ UPDATER */}
          <div 
            onClick={() => setActiveTab('poz')}
            className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -mr-6 -mt-6 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex flex-col h-full justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 group-hover:bg-sky-700 transition-colors">
                    <Activity size={24} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    {pozActiveCount}/{pozTeams.length} Pasukan Aktif
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-5 group-hover:text-sky-600 transition-colors">
                  POZ UPDATER
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Borang kemaskini kesiapsiagaan Penolong Pegawai Perubatan (PPP) bagi Zon HTAR (HTAR 1-4, KK Kapar, Meru, Sg Bertek, St. John 4) beserta penjana format mesej WhatsApp rasmi.
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">HTAR 1-4</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">KK Klang</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">St. John 4</span>
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">WhatsApp Formatter</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sky-600 font-bold text-sm">
                <span>Buka POZ Updater</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: MECC AMBULANCE STATUS */}
          <div 
            onClick={() => setActiveTab('mecc')}
            className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-6 -mt-6 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex flex-col h-full justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 group-hover:bg-amber-700 transition-colors">
                    <Radio size={24} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    {meccStats.ready}/{meccStats.total} Siap Sedia
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-5 group-hover:text-amber-600 transition-colors">
                  MECC AMBULANCE STATUS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Borang kemaskini status ambulans MECC untuk PKD Banting (KK TPG, Jenjarom, Bandar, Bukit Changgang, Tg Sepat), Hospital Banting (Banting 1 & 2), Shah Alam & HASA.
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">PKD Banting (5 KK)</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">Hosp Banting 1 & 2</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">SA 1 & SA 2</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">HASA 1</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-amber-600 font-bold text-sm">
                <span>Buka MECC Status</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 4: PENGURUSAN & TETAPAN */}
          <div 
            onClick={() => setActiveTab('settings')}
            className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -mr-6 -mt-6 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex flex-col h-full justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-800/30 group-hover:bg-slate-900 transition-colors">
                    <Settings size={24} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Konfigurasi
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-5 group-hover:text-slate-800 transition-colors">
                  PENGURUSAN & TETAPAN
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Urus senarai nama pasukan, responder bertugas, kategori ambulans, tetapan aplikasi serta sandaran & pemulihan pangkalan data tempatan (Export/Import JSON).
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">Urus Pasukan</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">Responders</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">Kategori</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">Sandaran Data</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-800 font-bold text-sm">
                <span>Buka Tetapan Sistem</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 5: SENARAI NAMA RESPONDER (DATABASE DIREKTORI & TAMBAH BARU) */}
          <div 
            onClick={() => setActiveTab('responders')}
            className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden md:col-span-2 lg:col-span-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex flex-col h-full justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:bg-emerald-700 transition-colors">
                    <Users size={24} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {totalResponders} Petugas Berdaftar
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    SENARAI NAMA RESPONDER
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    DATABASE
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Pautan direktori lengkap bagi menyenaraikan nama responder yang ada dalam database (PPP HTAR, Klinik Kesihatan, St. John) berserta fungsi untuk <strong>menambah responder baru</strong>.
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                    <UserPlus size={11} /> + Tambah Responder
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    {allPPPList.length} PPP & Paramedik
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    {allStJohnResponders.length} St. John
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    No Telefon & WhatsApp
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold text-sm">
                <span>Buka Direktori Responder</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
