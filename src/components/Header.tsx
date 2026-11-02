import React from 'react';
import { Sparkles, HelpCircle, Volume2, VolumeX, BookOpen, Trophy, Compass, FileText } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  activeTab: 'lab' | 'desafio' | 'aprende';
  setActiveTab: (tab: 'lab' | 'desafio' | 'aprende') => void;
  onOpenExplain: () => void;
  onOpenReport: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onToggleSimpleMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExplain,
  onOpenReport,
  isMuted,
  setIsMuted,
  onToggleSimpleMode
}) => {
  const toggleAudio = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) {
      sound.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-sky-900/30 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg border border-cyan-300/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg md:text-xl tracking-tight text-white">
                FRICTION<span className="text-cyan-400">LAB</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-cyan-300 uppercase px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-700/40">
                Politécnico
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 -mt-0.5">
              Laboratorio de Física Interactiva · Fricción Estática y Cinética
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => { sound.playClick(); setActiveTab('lab'); }}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'lab'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Laboratorio</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('desafio'); }}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'desafio'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Modo Desafío</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('aprende'); }}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'aprende'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>Aprende</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => { sound.playClick(); onToggleSimpleMode(); }}
            title="Activar vista simple (solo simulador y materiales)"
            className="px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>SIMPLE</span>
          </button>

          <button
            onClick={toggleAudio}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
            aria-label="Alternar audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={onOpenReport}
            title="Copiar datos para reporte de laboratorio"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Datos</span>
          </button>

          <button
            onClick={onOpenExplain}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-cyan-200/50"
          >
            <HelpCircle className="w-4 h-4 text-slate-950" />
            <span>EXPLÍCAME</span>
          </button>
        </div>

      </div>
    </header>
  );
};
