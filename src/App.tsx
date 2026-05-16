import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Timer, 
  Lightbulb, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  BookOpen,
  Heart,
  X,
  Trash2,
  History,
  Target,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Users,
  MessageSquare,
  RefreshCw,
  Globe,
  User,
  Quote,
  LayoutGrid,
  CheckCircle2,
  Info,
  Camera,
  Edit3,
  Sliders,
  Moon,
  Bell,
  Clock,
  Lock,
  Coins,
  Mic,
  Waves,
  Square
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { QUESTIONS, CATEGORIES, STRUCTURES, Question } from './questions';

interface UserProfile {
  name: string;
  avatar: string;
  coins: number;
  scoreHistory: { date: string, score: number }[];
  lastRadarData?: RadarData;
}

interface RadarData {
  logic: number;
  emotion: number;
  fluency: number;
  structure: number;
  insight: number;
}

interface QuestionActivity {
  questionId: number;
  spokenAt: string[];
  insights: { date: string; text: string }[];
}

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper"
];

type AppStep = 'home' | 'select' | 'challenge' | 'profile' | 'tutorial';

const UI_Home: React.FC<{ onStart: () => void; onProfile: () => void; onTutorial: () => void }> = ({ onStart, onProfile, onTutorial }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    className="max-w-4xl mx-auto py-12 px-6 text-center flex flex-col items-center justify-center min-h-[85vh] relative"
  >
      <button 
        onClick={(e) => {
          console.log('UI_Home: Profile clicked');
          onProfile();
        }}
        className="mb-16 text-stone-400 font-bold uppercase tracking-[0.4em] text-[10px] cursor-pointer hover:text-gray-900 transition-colors"
      >
        演讲抽题应用
      </button>
    
    <div className="w-20 h-20 bg-[#1A1A1A] rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl mb-14 transition-transform hover:scale-105">
      <Zap size={40} fill="currentColor" />
    </div>
    
    <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-3 leading-tight">
      抽题即演讲
    </h1>
    <h2 className="text-4xl sm:text-5xl font-black text-emerald-500 tracking-tight mb-12 leading-tight">
      思路不卡顿
    </h2>
    
    <p className="text-sm sm:text-base text-stone-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
      专为“演讲训练”设计的抽题系统。基于《精英表达：黑天鹅挑战》随机抽取演讲题目，助你锻炼即兴表达能力。
    </p>
    
    <div className="flex flex-col gap-4 w-full max-w-sm relative z-[500]">
      <button 
        onClick={(e) => {
          console.log('UI_Home: Start button clicked');
          e.stopPropagation();
          onStart();
        }}
        className="w-full px-12 py-5 bg-black text-white rounded-2xl font-black text-xl hover:bg-zinc-900 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-6 group cursor-pointer touch-manipulation"
      >
        <span>抽取即兴题目</span> <Zap size={22} fill="currentColor" className="group-hover:scale-110 transition-transform" />
      </button>

      <button 
        onClick={onTutorial}
        className="w-full px-12 py-4 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 text-amber-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
      >
        <BookOpen size={18} />
        <span>查看新手教程</span>
      </button>
    </div>
  </motion.div>
);

const getThemeColors = (type: string) => {
  switch(type) {
    case 'green': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', primary: 'bg-emerald-600', hover: 'hover:bg-emerald-700', light: 'bg-emerald-100', accent: 'emerald', name: '处事解难' };
    case 'blue': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', primary: 'bg-blue-600', hover: 'hover:bg-blue-700', light: 'bg-blue-100', accent: 'blue', name: '走心抒论' };
    case 'red': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', primary: 'bg-amber-500', hover: 'hover:bg-amber-600', light: 'bg-amber-100', accent: 'amber', name: '庄重发言' };
    case 'black': return { bg: 'bg-stone-900', border: 'border-stone-700', text: 'text-stone-300', primary: 'bg-stone-800', hover: 'hover:bg-black', light: 'bg-stone-800', accent: 'stone', name: '黑天鹅' };
    default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', primary: 'bg-gray-900', hover: 'hover:bg-black', light: 'bg-gray-100', accent: 'gray', name: '通用' };
  }
};

const SwanIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15.5 21C14.12 21 13 19.88 13 18.5C13 17.5 13.5 16.5 14.25 15.75C15.5 14.5 17.5 13 17.5 10C17.5 8.34 16.16 7 14.5 7C12.84 7 11.5 8.34 11.5 10V11H9.5V10C9.5 7.24 11.74 5 14.5 5C17.26 5 19.5 7.24 19.5 10C19.5 14.5 16.5 16.5 15.5 17.5C15.15 17.85 15 18.15 15 18.5C15 18.78 15.22 19 15.5 19H18.5V21H15.5ZM6.5 21C5.12 21 4 19.88 4 18.5V17C4 16.45 4.45 16 5 16H8C8.55 16 9 16.45 9 17V18.5C9 19.88 7.88 21 6.5 21ZM5.5 9C5.5 8.17 6.17 7.5 7 7.5C7.83 7.5 8.5 8.17 8.5 9C8.5 9.83 7.83 10.5 7 10.5C6.17 10.5 5.5 9.83 5.5 9Z" />
  </svg>
);

const InfoModal: React.FC<{ category: any, isOpen: boolean, onClose: () => void }> = ({ category, isOpen, onClose }) => {
  if (!isOpen) return null;
  const colors = getThemeColors(category.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-8 ${colors.primary} text-white flex justify-between items-start`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              {category.id === 'green' ? <Heart size={20} /> : category.id === 'blue' ? <User size={20} /> : category.id === 'red' ? <Globe size={20} /> : <SwanIcon size={20} />}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">即兴演讲分类指南</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight">{category.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">核心定位</h4>
            <p className="text-sm font-bold text-gray-800 leading-relaxed">{category.details.core}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> 适用场景
              </h4>
              <p className="text-xs font-bold text-gray-600 leading-loose">{category.details.scenes}</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-xl">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> 语言特点
              </h4>
              <p className="text-xs font-bold text-gray-300 leading-loose">{category.details.language}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">标准万能结构</h4>
              <div className="text-xs font-black text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                {category.details.structure}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">表达禁忌</h4>
            <p className="text-xs font-bold text-gray-500 italic">“{category.details.taboo}”</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Sub-component for Tutorial (Golden Theme)
const UI_Tutorial: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -20 }} 
    className="max-w-4xl mx-auto py-12 px-6"
  >
    <div className="flex items-center justify-between mb-12">
      <button 
        onClick={onBack}
        className="p-4 bg-white rounded-2xl shadow-xl border border-amber-100 text-amber-600 hover:text-amber-900 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest"
      >
        <ChevronLeft size={18} /> 返回主页
      </button>
      <div className="px-5 py-2 bg-gradient-to-br from-amber-100 to-yellow-200 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-700">
        ULTIMATE GUIDE · 新手手册
      </div>
    </div>

    <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 bg-[length:200%_200%] animate-gradient shadow-2xl mb-12">
      <div className="bg-white rounded-[3.3rem] p-12 relative overflow-hidden">
        <Sparkles size={120} className="absolute -top-10 -right-10 text-amber-100 opacity-50" />
        
        <h2 className="text-4xl font-black text-amber-950 tracking-tighter mb-12 relative z-10">
          欢迎开启 <br/>
          <span className="text-amber-600">即兴表达的肌肉训练</span>
        </h2>

        <div className="space-y-10 relative z-10">
          {[
            { step: '01', title: '抽取题目', desc: '在四大牌组（处事、走心、庄重、黑天鹅）中选择适合你的难度，随机抽取一个即兴话题。', icon: <Zap size={24} /> },
            { step: '02', title: '限时准备', desc: '你有 30-120 秒的准备时间，点击下方提示可以解锁黑天鹅进阶思路（消耗金币）。', icon: <Clock size={24} /> },
            { step: '03', title: '开始录音', desc: '点击红色的录音按钮开始表达。训练你的临场反应，直到计时结束或你点击完成。', icon: <Mic size={24} /> },
            { step: '04', title: '复盘回顾', desc: '这是最关键的一步。听听你刚才的录音，记录下你的灵光一现或待改进之处。', icon: <Waves size={24} /> },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start group">
              <div className="w-14 h-14 shrink-0 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 font-black text-xl shadow-lg border border-amber-100 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{item.step}</span>
                  <h3 className="text-lg font-black text-amber-950">{item.title}</h3>
                </div>
                <p className="text-sm text-stone-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100">
           <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-4">✨ 黄金建议</h4>
           <p className="text-sm font-bold text-amber-900 leading-normal italic">
            “不要追求完美，要追求频率。每天一个 3 分钟的演练，远比一个月一次的长篇大论更有效。”
           </p>
        </div>
      </div>
    </div>

    <button 
      onClick={onBack}
      className="w-full h-20 bg-amber-500 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-4 group"
    >
      <span>我准备好了，开始训练</span> <ChevronRight size={24} />
    </button>
  </motion.div>
);

// Sub-component for Timer to prevent full-screen reflicker
const TimerDisplay: React.FC<{ 
  isActive: boolean; 
  timeLeft: number; 
  toggleTimer: () => void; 
  resetTimer: () => void; 
  finishSpeech: () => void;
  selectedDeck: string;
}> = ({ isActive, timeLeft, toggleTimer, resetTimer, finishSpeech, selectedDeck }) => {
  const colors = getThemeColors(selectedDeck);
  return (
    <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-rose-500 animate-pulse' : 'bg-gray-800'}`}>
          {isActive ? <Mic size={28} /> : <Timer size={28} />}
        </div>
        <div>
          <div className="text-4xl font-black tabular-nums tracking-tighter leading-none">{formatTime(timeLeft)}</div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">{isActive ? '正在全力录音中...' : '演练倒计时'}</div>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={toggleTimer} 
          className={`px-8 h-12 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${isActive ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
        >
          {isActive ? (
            <>
              <Square size={18} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">暂停录音</span>
            </>
          ) : (
            <>
              <Mic size={18} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">开启即兴录音</span>
            </>
          )}
        </button>
        <button onClick={resetTimer} className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"><RotateCcw size={20} /></button>
        <button onClick={finishSpeech} className={`${colors.primary} ${colors.hover} px-8 h-12 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg`}>结束演练</button>
      </div>
    </div>
  );
};

const UI_Select: React.FC<{ 
  selectedDeck: string; 
  setSelectedDeck: (d: string) => void;
  selectedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  setSelectedDifficulty: (d: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  isShuffling: boolean;
  handleDraw: () => void;
  onBack: () => void;
}> = ({ selectedDeck, setSelectedDeck, selectedDifficulty, setSelectedDifficulty, isShuffling, handleDraw, onBack }) => {
  const currentIndex = CATEGORIES.findIndex(c => c.id === selectedDeck);
  const [infoCategory, setInfoCategory] = useState<any>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto py-10 px-6 min-h-[80vh] flex flex-col justify-center">
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-gray-900 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
          DIMENSION · 阶段选择
        </div>
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-16 text-center">聚焦当下，开启表达</h2>

      {/* 3D Carousel */}
    <div className="relative h-[360px] w-full flex items-center justify-center perspective-[1200px] mb-16 overflow-visible">
        {CATEGORIES.map((deck, index) => {
          let offset = index - currentIndex;
          const total = CATEGORIES.length;
          
          if (offset > total / 2) offset -= total;
          if (offset <= -total / 2) offset += total;
          
          const isActive = offset === 0;
          const isSide = Math.abs(offset) === 1;
          const isBack = Math.abs(offset) >= 2;
          const colors = getThemeColors(deck.id);

          return (
            <motion.div
              key={deck.id}
              onClick={() => setSelectedDeck(deck.id)}
              animate={{
                x: offset * 220,
                scale: isActive ? 1.1 : (isSide ? 0.8 : 0.4),
                rotateY: offset * -45,
                z: isActive ? 200 : (isSide ? -100 : -600),
                opacity: isBack ? 0 : (isActive ? 1 : 0.45),
                pointerEvents: isActive ? 'auto' : (isBack ? 'none' : 'auto'),
                skewY: offset * 2
              }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className={`absolute w-64 h-80 rounded-[2.5rem] p-8 cursor-pointer flex flex-col justify-between shadow-2xl overflow-hidden transition-colors ${isActive ? (deck.id === 'black' ? 'bg-stone-900 border-4 border-stone-600 text-white shadow-[#000000_0px_20px_50px_-12px]' : 'bg-white border-4 ' + colors.border) : 'bg-gray-100 grayscale border-transparent'}`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${colors.primary} text-white`}>
                  {deck.id === 'green' ? <Heart size={20} /> : deck.id === 'blue' ? <User size={20} /> : deck.id === 'red' ? <Globe size={20} /> : <SwanIcon size={20} />}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setInfoCategory(deck);
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isActive ? (deck.id === 'black' ? 'border-stone-700 text-stone-500' : colors.border + ' ' + colors.text) : 'border-gray-300 text-gray-300'} hover:scale-110 transition-transform`}
                >
                  <Info size={14} />
                </button>
              </div>
              
              <div className="relative z-10">
                <h3 className={`text-xl font-black mb-1 ${deck.id === 'black' && isActive ? 'text-white' : 'text-gray-900'}`}>{deck.name}</h3>
                <p className={`text-[10px] font-bold leading-relaxed ${deck.id === 'black' && isActive ? 'text-stone-500' : 'text-gray-400'}`}>{deck.desc}</p>
              </div>
              {deck.id === 'black' ? (
                <div className={`absolute bottom-[-10px] right-[-10px] transition-all duration-1000 ${isActive ? 'opacity-20 scale-125 rotate-12' : 'opacity-5 scale-90'}`}>
                   <SwanIcon size={180} className="text-white" />
                </div>
              ) : (
                isActive && (
                  <div className={`absolute bottom-4 right-4 opacity-10 transition-transform duration-700 scale-110`}>
                     {deck.id === 'green' ? <Heart size={80}/> : deck.id === 'blue' ? <User size={80}/> : <Globe size={80}/>}
                  </div>
                )
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex justify-center gap-3">
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${selectedDifficulty === d ? 'bg-gray-900 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
            >
              <span>{d === 'Beginner' ? '入门演练' : d === 'Intermediate' ? '进阶议题' : '巅峰挑战'}</span>
              <span className={`text-[8px] opacity-60 ${selectedDifficulty === d ? 'text-gray-300' : 'text-gray-400'}`}>
                {d === 'Beginner' ? '2min' : d === 'Intermediate' ? '3min' : '5min'}
              </span>
            </button>
          ))}
        </div>

        <button 
          onClick={handleDraw}
          className={`w-full max-w-xs py-5 rounded-2xl text-white font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${getThemeColors(selectedDeck).primary} ${getThemeColors(selectedDeck).hover}`}
        >
          抽取即兴题目 <Zap size={18} fill="white" />
        </button>
      </div>

      <AnimatePresence>
        {infoCategory && (
          <InfoModal 
            category={infoCategory} 
            isOpen={!!infoCategory} 
            onClose={() => setInfoCategory(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const UI_Challenge: React.FC<{
  currentQuestion: Question | null;
  displayQuestionText: string;
  setStep: (s: AppStep) => void;
  handleDraw: () => void;
  isShuffling: boolean;
  toggleSave: (id: number) => void;
  savedIds: number[];
  timerProps: any;
  showSummary: boolean;
  setShowSummary: (b: boolean) => void;
  insightText: string;
  setInsightText: (t: string) => void;
  saveInsight: () => void;
  isHintUnlocked: boolean;
  setShowHintModal: (b: boolean) => void;
  showHintModal: boolean;
  onUnlock: (action: 'unlock' | 'stick') => void;
  finishSpeech: () => void;
  isAnalyzing: boolean;
  analysisError: string | null;
  analysisResult: any;
  audioURL: string | null;
}> = ({ currentQuestion, displayQuestionText, setStep, handleDraw, isShuffling, toggleSave, savedIds, timerProps, showSummary, setShowSummary, insightText, setInsightText, saveInsight, isHintUnlocked, setShowHintModal, showHintModal, onUnlock, finishSpeech, isAnalyzing, analysisError, analysisResult, audioURL }) => {
  const colors = getThemeColors(currentQuestion?.type || 'green');
  const isBlackSwan = currentQuestion?.type === 'black';
  const diffLabel = currentQuestion?.difficulty === 'Advanced' ? '巅峰挑战' : currentQuestion?.difficulty === 'Intermediate' ? '进阶议题' : '入门演练';
  const diffTimeLabel = currentQuestion?.difficulty === 'Advanced' ? '5:00' : currentQuestion?.difficulty === 'Intermediate' ? '3:00' : '2:00';

  const radarData = analysisResult ? [
    { subject: '逻辑力', A: analysisResult.radar.logic, fullMark: 10 },
    { subject: '共情力', A: analysisResult.radar.emotion, fullMark: 10 },
    { subject: '表达力', A: analysisResult.radar.fluency, fullMark: 10 },
    { subject: '架构力', A: analysisResult.radar.structure, fullMark: 10 },
    { subject: '洞察力', A: analysisResult.radar.insight, fullMark: 10 },
  ] : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className={`min-h-[80vh] flex flex-col justify-center py-10 px-6`}
    >
      <AnimatePresence>
        {showHintModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center ${colors.primary} text-white shadow-xl`}>
                <Coins size={32} />
              </div>

              <h3 className="text-xl font-black mb-4">开启挑战提示？</h3>
              <p className="text-sm text-stone-500 font-bold mb-10 leading-relaxed px-4">
                “坚持是一种美德成果往往在无人知晓处悄然绽放。”
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => onUnlock('unlock')}
                  className="flex-1 h-14 bg-gray-100 rounded-2xl font-black text-[10px] text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  放弃，继续看答案 (-5金币)
                </button>
                <button 
                  onClick={() => onUnlock('stick')}
                  className={`flex-1 h-14 rounded-2xl font-black text-[10px] text-white shadow-lg transition-all active:scale-95 ${colors.primary} ${colors.hover}`}
                >
                  坚持下去 (+10金币)
                </button>
              </div>

              {/* Decorative accent */}
              <div className={`absolute top-0 left-0 w-full h-2 ${colors.primary}`}></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setStep('select')} className={`${isBlackSwan ? 'text-stone-500' : 'text-gray-400'} font-bold hover:text-gray-900 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest`}>
            <ChevronLeft size={16} /> 重选牌组
          </button>
          <div className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 ${colors.bg} ${colors.text} border-2 ${colors.border}`}>
            <span className="opacity-50"># {currentQuestion?.category}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20" />
                <span>{diffLabel}</span>
                <div className="px-2 py-0.5 rounded bg-white/40 font-mono flex items-center gap-1">
                  <Clock size={10} /> {diffTimeLabel}
                </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div 
              key="challenge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-8"
            >
              <div className={`${isBlackSwan ? 'bg-stone-900 border-stone-800' : 'bg-white border-gray-100'} rounded-[3.5rem] p-12 sm:p-16 shadow-2xl border-b-[10px] ${colors.border} text-center relative overflow-hidden min-h-[300px] flex flex-col justify-center`}>
                <Quote size={80} className={`absolute -top-6 -left-6 ${isBlackSwan ? 'text-stone-800' : 'text-gray-50'} opacity-10`} />
                <motion.h2 
                  key={displayQuestionText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-2xl sm:text-3xl font-black leading-tight mb-12 italic ${isBlackSwan ? 'text-white' : 'text-gray-900'}`}
                >
                  "{displayQuestionText}"
                </motion.h2>
                <div className="flex justify-center gap-4">
                  <button onClick={handleDraw} className={`w-14 h-14 ${isBlackSwan ? 'bg-stone-800 text-stone-500' : 'bg-gray-50 text-gray-400'} rounded-full flex items-center justify-center hover:scale-110 transition-all ${isShuffling ? 'animate-spin' : ''}`}>
                    <RefreshCw size={24} />
                  </button>
                  <button onClick={() => toggleSave(currentQuestion?.id || 0)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${savedIds.includes(currentQuestion?.id || 0) ? 'bg-rose-50 text-rose-500' : (isBlackSwan ? 'bg-stone-800 text-stone-600' : 'bg-gray-50 text-gray-300')}`}>
                    <Heart size={24} fill={savedIds.includes(currentQuestion?.id || 0) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {currentQuestion?.example && (
                <div className="relative group">
                  {!isHintUnlocked ? (
                    <div className={`${isBlackSwan ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-gray-100'} rounded-[2.5rem] p-12 border shadow-xl flex flex-col items-center justify-center text-center gap-6 backdrop-blur-md relative overflow-hidden`}>
                       <Lock size={40} className={isBlackSwan ? 'text-stone-700' : 'text-gray-200'} />
                       <div>
                         <h3 className={`text-lg font-black mb-2 ${isBlackSwan ? 'text-white' : 'text-gray-900'}`}>本题思路已锁定</h3>
                         <p className="text-xs text-stone-500 font-bold">优秀的小嘴巴从不看提示，坚持下去可获得 10 金币</p>
                       </div>
                       <button 
                         onClick={() => setShowHintModal(true)}
                         className={`px-8 py-3 rounded-full font-black text-xs transition-all shadow-lg active:scale-95 ${colors.primary} text-white`}
                       >
                         消耗 5 金币查看提示
                       </button>

                       {/* Decorative icons */}
                       <div className="absolute top-10 left-10 opacity-5 -rotate-12"><Lightbulb size={120} /></div>
                       <div className="absolute bottom-10 right-10 opacity-5 rotate-12"><Zap size={120} /></div>
                    </div>
                  ) : (
                    <div className={`${isBlackSwan ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-gray-100'} rounded-[2.5rem] p-8 border shadow-xl space-y-6`}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.primary} text-white`}>
                          {isBlackSwan ? <SwanIcon size={18} /> : <Lightbulb size={18} />}
                        </div>
                        <h3 className={`text-sm font-black uppercase tracking-widest ${isBlackSwan ? 'text-stone-200' : 'text-gray-900'}`}>
                          {isBlackSwan ? '黑天鹅博弈思路' : '高级演讲思路解析'}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 text-left">
                        {(currentQuestion.type === 'green' ? [
                          { label: '点出问题', val: currentQuestion.example.point, tag: 'Point' },
                          { label: '剖析根源', val: currentQuestion.example.reason, tag: 'Reason' },
                          { label: '给出对策', val: currentQuestion.example.action, tag: 'Action' },
                          { label: '督促落实', val: currentQuestion.example.followup, tag: 'Followup' },
                          { label: '收尾表态', val: currentQuestion.example.closing, tag: 'Closing' }
                        ] : currentQuestion.type === 'blue' ? [
                          { label: '引出话题', val: currentQuestion.example.point, tag: 'Hook' },
                          { label: '抒发感受', val: currentQuestion.example.reason, tag: 'Feeling' },
                          { label: '亮出观点', val: currentQuestion.example.action, tag: 'View' },
                          { label: '升华想法', val: currentQuestion.example.followup, tag: 'Elevate' },
                          { label: '温和收尾', val: currentQuestion.example.closing, tag: 'Closing' }
                        ] : currentQuestion.type === 'red' ? [
                          { label: '礼貌问候', val: currentQuestion.example.point, tag: 'Greet' },
                          { label: '点明主旨', val: currentQuestion.example.reason, tag: 'Theme' },
                          { label: '寄予期许', val: currentQuestion.example.action, tag: 'Expect' },
                          { label: '得体收束', val: currentQuestion.example.followup, tag: 'Finish' },
                          { label: '致意致谢', val: currentQuestion.example.closing, tag: 'Thanks' }
                        ] : [
                          { label: '打破视角', val: currentQuestion.example.point, tag: 'Focus' },
                          { label: '高维立论', val: currentQuestion.example.reason, tag: 'Thesis' },
                          { label: '多维推演', val: currentQuestion.example.action, tag: 'Logic' },
                          { label: '博弈避坑', val: currentQuestion.example.followup, tag: 'Game' },
                          { label: '底层升华', val: currentQuestion.example.closing, tag: 'Root' }
                        ]).map((s, idx) => (
                          <div key={idx} className="group">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[9px] font-black uppercase tracking-tighter w-12 ${isBlackSwan ? 'text-stone-600' : 'text-gray-300'}`}>{s.tag}</span>
                              <span className={`text-[10px] font-black ${colors.text} px-2 py-0.5 rounded-md ${colors.bg}`}>{s.label}</span>
                            </div>
                            <p className={`text-sm font-bold leading-relaxed pl-14 ${isBlackSwan ? 'text-stone-300' : 'text-gray-700'}`}>
                              {s.val}
                            </p>
                          </div>
                        ))}
                      </div>
                      {currentQuestion.source && (
                        <div className="mt-8 pt-6 border-t border-stone-800 flex items-center gap-2">
                           <BookOpen size={12} className="text-stone-500" />
                           <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{currentQuestion.source}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <TimerDisplay {...timerProps} />
            </motion.div>
          ) : (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isBlackSwan ? 'bg-stone-900 border-stone-800' : 'bg-white border-gray-100'} rounded-[3rem] p-10 shadow-2xl border text-center`}
            >
              <div className={`w-16 h-16 ${analysisError ? 'bg-rose-500' : 'bg-emerald-500'} rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-6`}>
                {analysisError ? <X size={32} /> : <CheckCircle2 size={32} />}
              </div>
              <h2 className={`text-3xl font-black mb-2 tracking-tight ${isBlackSwan ? 'text-white' : 'text-gray-900'}`}>
                {analysisError ? '分析遇阻' : '演练收官！'}
              </h2>
              
              {isAnalyzing && (
                <div className="py-12 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-stone-200 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">AI 教练正在通过黑天鹅逻辑分析你的演讲...</p>
                </div>
              )}

              {analysisError && (
                <div className="p-8 bg-rose-50 rounded-3xl mb-8 border border-rose-100">
                  <p className="text-sm font-bold text-rose-600 mb-4">{analysisError}</p>
                  <button 
                    onClick={finishSpeech}
                    className="px-6 py-2 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-colors"
                  >
                    重试分析
                  </button>
                </div>
              )}

              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-10 space-y-8"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full h-[300px] bg-gray-50 rounded-[2.5rem] p-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#E5E7EB" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                          <Radar name="分析" dataKey="A" stroke={isBlackSwan ? "#10B981" : colors.primary} fill={isBlackSwan ? "#10B981" : colors.primary} fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">本次评分</div>
                      <div className="text-7xl font-black text-gray-900 tracking-tighter">{analysisResult.score}</div>
                      <p className="text-sm font-bold text-stone-500 italic">“{analysisResult.feedback}”</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {audioURL && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 justify-center">
                    <Waves size={14} /> 回听我的即兴演讲
                  </div>
                  <div className="p-6 bg-stone-900 rounded-[2rem] flex items-center gap-4 shadow-xl ring-4 ring-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Play size={24} fill="currentColor" />
                    </div>
                    <audio controls src={audioURL} className="flex-1 h-8 opacity-90 invert grayscale" />
                  </div>
                </div>
              )}

              {!analysisResult && !isAnalyzing && (
                <div className="mb-10 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center gap-4">
                  <Sparkles className="text-emerald-500" size={32} />
                  <p className="text-sm font-bold text-emerald-900 leading-relaxed max-w-xs mx-auto">
                    “听一听刚才的表达，哪些地方可以更精简？哪些思路可以更开阔？”
                  </p>
                </div>
              )}

              <p className="text-stone-500 text-sm mb-10 font-medium">每一步坚持，都在塑造更好的表达力。</p>
              
              <div className={`text-left rounded-3xl p-8 mb-8 border ${isBlackSwan ? 'bg-stone-800 border-stone-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-stone-500">
                  <Quote size={12} /> 回顾题目
                </div>
                <p className={`font-bold italic mb-6 ${isBlackSwan ? 'text-stone-200' : 'text-gray-700'}`}>"{currentQuestion?.text}"</p>
                <textarea 
                  value={insightText}
                  onChange={(e) => setInsightText(e.target.value)}
                  placeholder="记录下刚才演练中的灵光一现..."
                  className={`w-full h-32 p-6 rounded-2xl border-none focus:ring-4 transition-all text-sm font-medium shadow-sm ${isBlackSwan ? 'bg-stone-900 text-white focus:ring-stone-700' : 'bg-white text-gray-900 focus:ring-gray-100'}`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={saveInsight} className={`flex-[2] h-16 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg ${isBlackSwan ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-900 hover:bg-black text-white'}`}>完成总结</button>
                <button onClick={() => setShowSummary(false)} className={`flex-1 h-16 rounded-2xl font-black text-lg transition-all border-2 ${isBlackSwan ? 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>返回练习表</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SettingsModal: React.FC<{
  view: 'main' | 'favorites' | 'history';
  savedIds: number[];
  toggleSave: (id: number) => void;
  activities: Record<number, QuestionActivity>;
  setCurrentQuestion: (q: Question) => void;
  setStep: (s: AppStep) => void;
  setSelectedDeck: (d: string) => void;
  resetTimer: () => void;
  onClose: () => void;
}> = ({ view, savedIds, toggleSave, activities, setCurrentQuestion, setStep, setSelectedDeck, resetTimer, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, backdropFilter: 'blur(10px)' }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/90 overflow-y-auto pt-24 px-6 pb-20">
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-black">{view === 'favorites' ? '我的收藏' : '成长轨迹'}</h2>
        <button onClick={onClose} className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center"><X size={32}/></button>
      </div>

      {view === 'favorites' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUESTIONS.filter(q => savedIds.includes(q.id)).map(q => (
            <div key={q.id} className={`bg-white p-10 rounded-[3rem] border-4 border-gray-100 shadow-xl`}>
              <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">{q.category}</div>
              <h4 className="text-xl font-bold mb-8 leading-tight italic">"{q.text}"</h4>
              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <button onClick={() => { setCurrentQuestion(q); setStep('challenge'); onClose(); setSelectedDeck(q.type); resetTimer(); }} className="text-blue-600 font-extrabold text-sm flex items-center gap-2">现在开讲 <ArrowRight size={14}/></button>
                <button onClick={() => toggleSave(q.id)} className="text-gray-300 hover:text-rose-500 transition-colors"><Trash2 size={24}/></button>
              </div>
            </div>
          ))}
          {savedIds.length === 0 && <div className="md:col-span-2 py-40 text-center text-gray-200 font-black text-4xl">空空如也</div>}
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.values(activities) as QuestionActivity[]).reverse().map(act => {
            const q = QUESTIONS.find(q => q.id === act.questionId);
            return q && (
              <div key={act.questionId} className="bg-white p-12 rounded-[3.5rem] border-4 border-gray-50 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-2xl font-black italic">"{q.text}"</h4>
                  <span className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-300">已练习 {act.spokenAt.length} 次</span>
                </div>
                {act.insights.map((ins, i) => (
                   <div key={i} className="p-8 bg-gray-50 rounded-3xl mt-4 border border-gray-100">
                     <Quote className="text-gray-200 mb-2" size={20} />
                     <p className="text-gray-700 font-bold leading-relaxed">{ins.text}</p>
                     <div className="text-[10px] text-gray-300 mt-4 text-right">{new Date(ins.date).toLocaleDateString()}</div>
                   </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  </motion.div>
);

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('home');
  const navigateTo = (newStep: AppStep) => {
    console.log(`[Navigation] ${step} -> ${newStep}`);
    setStep(newStep);
  };
  const [selectedDeck, setSelectedDeck] = useState<string>('green'); // green, blue, red
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [displayQuestionText, setDisplayQuestionText] = useState('');
  const [insightText, setInsightText] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('improv_saved_questions');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [activities, setActivities] = useState<Record<number, QuestionActivity>>(() => {
    try {
      const saved = localStorage.getItem('improv_activities');
      const parsed = saved ? JSON.parse(saved) : {};
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch {
      return {};
    }
  });

  // Advanced Settings
  const [userSettings, setUserSettings] = useState(() => {
    const defaults = {
      prepareTime: 30,
      speechTime: 120,
      userName: '即兴教练',
      avatarIdx: 0,
      avatarUrl: '',
      coins: 100,
      scoreHistory: [],
      lastRadarData: null
    };
    try {
      const saved = localStorage.getItem('improv_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      }
      return defaults;
    } catch {
      return defaults;
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isHintUnlocked, setIsHintUnlocked] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioURL, setAudioURL] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setTranscript(fullTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('麦克风权限被拒绝。请在浏览器设置中开启权限。');
        }
      };
    }
  }, []);

  const profile = { 
    name: userSettings.userName, 
    avatar: AVATAR_PRESETS[userSettings.avatarIdx],
    coins: userSettings.coins || 0,
    scoreHistory: userSettings.scoreHistory || [],
    lastRadarData: userSettings.lastRadarData
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'favorites' | 'history'>('main');

  const [timeLeft, setTimeLeft] = useState(userSettings.speechTime);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('improv_saved_questions', JSON.stringify(savedIds));
    localStorage.setItem('improv_activities', JSON.stringify(activities));
    localStorage.setItem('improv_settings', JSON.stringify(userSettings));
  }, [savedIds, activities, userSettings]);

  useEffect(() => {
    setTimeLeft(userSettings.speechTime);
  }, [userSettings.speechTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const startRecording = async () => {
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      alert('无法访问麦克风，请检查浏览器权限。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const toggleTimer = () => {
    if (!isActive) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    stopRecording();
    setAudioURL(null);
    setIsActive(false);
    setTimeLeft(userSettings.speechTime);
  };

  const handleDraw = () => {
    console.log('[handleDraw] Starting shuffle. Deck:', selectedDeck, 'Difficulty:', selectedDifficulty);
    setIsShuffling(true);
    setIsHintUnlocked(false);
    setShowHintModal(false);
    setAnalysisResult(null);
    setAudioURL(null);
    
    // Automatically switch to challenge screen if we're not already there
    if (step === 'select') {
      console.log('[handleDraw] Switching step to challenge');
      navigateTo('challenge');
    }
    
    // Set speech time based on difficulty
    const difficultySpeeds = {
      'Beginner': 120, // 2 min
      'Intermediate': 180, // 3 min
      'Advanced': 300 // 5 min
    };
    
    const targetTime = difficultySpeeds[selectedDifficulty];
    setUserSettings(prev => ({ ...prev, speechTime: targetTime }));

    // Final pool based on EXACT user filters
    let finalPool = QUESTIONS.filter(q => q.type === selectedDeck && q.difficulty === selectedDifficulty);
    
    // Fallback if no questions match this specific difficulty (common for Black Swan)
    if (finalPool.length === 0) {
      finalPool = QUESTIONS.filter(q => q.type === selectedDeck);
    }

    // Visual pool for the slot machine effect (wider variety)
    const visualPool = QUESTIONS.filter(q => q.type === selectedDeck);
    
    const finalQ = finalPool[Math.floor(Math.random() * finalPool.length)] || QUESTIONS[0];

    // Slot machine logic using a wider visual pool for "infinite" feel
    let count = 0;
    const maxTicks = 20; 
    const interval = setInterval(() => {
      const tempQ = visualPool[Math.floor(Math.random() * visualPool.length)];
      setDisplayQuestionText(tempQ?.text || '...');
      count++;
      
      if (count >= maxTicks) {
        clearInterval(interval);
        console.log('[handleDraw] Shuffle complete. Question:', finalQ.text);
        setCurrentQuestion(finalQ);
        setDisplayQuestionText(finalQ.text);
        setIsShuffling(false);
        resetTimer();
      }
    }, 60 + count * 5);
  };

  const toggleSave = (id: number) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const finishSpeech = async () => {
    if (!currentQuestion) return;
    
    stopRecording();
    setIsActive(false);
    setAnalysisError(null);
    setShowSummary(true);

    // AI Analysis is disabled per user request
    setIsAnalyzing(false);
    
    const now = new Date().toISOString();
    setActivities(prev => {
      const act = prev[currentQuestion.id] || { questionId: currentQuestion.id, spokenAt: [], insights: [] };
      return { ...prev, [currentQuestion.id]: { ...act, spokenAt: [...act.spokenAt, now] } };
    });
  };

  const saveInsight = () => {
    if (!currentQuestion || !insightText.trim()) return;
    const now = new Date().toISOString();
    setActivities(prev => {
      const act = prev[currentQuestion.id] || { questionId: currentQuestion.id, spokenAt: [], insights: [] };
      return { ...prev, [currentQuestion.id]: { ...act, insights: [...act.insights, { date: now, text: insightText }] } };
    });
    setInsightText('');
    setShowSummary(false);
    setStep('select');
  };

  const handleUnlockHint = (action: 'unlock' | 'stick') => {
    if (action === 'unlock') {
      if (userSettings.coins >= 5) {
        setUserSettings(prev => ({ ...prev, coins: prev.coins - 5 }));
        setIsHintUnlocked(true);
      } else {
        alert('金币不足！');
      }
    } else {
      // "Stick to it" variant
      setUserSettings(prev => ({ ...prev, coins: prev.coins + 10 }));
      setIsHintUnlocked(false);
    }
    setShowHintModal(false);
  };

  const isBlackSwanMode = step === 'challenge' && currentQuestion?.type === 'black';

  return (
    <div className={`min-h-screen flex flex-col text-[#2D3436] font-sans selection:bg-gray-200 overflow-x-hidden transition-colors duration-700 ${isBlackSwanMode ? 'bg-black' : 'bg-[#FDFBF7]'}`}>
      {step !== 'home' && (
        <header className="max-w-6xl mx-auto pt-10 px-6 flex justify-between items-center relative z-50 w-full">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setStep('home')}>
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl hover:rotate-3 transition-transform">
              <Zap size={24} />
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tight leading-none uppercase transition-colors ${isBlackSwanMode ? 'text-white' : 'text-gray-900'}`}>即兴闪电</h1>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Improv Lightning</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => { setSettingsView('favorites'); setIsSettingsOpen(true); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border transition-transform hover:scale-110 ${isBlackSwanMode ? 'bg-stone-800 border-stone-700 text-rose-400' : 'bg-white border-gray-50 text-rose-500'}`}>
              <Heart fill={(savedIds || []).length > 0 ? "currentColor" : "none"} size={20} />
            </button>
            <button onClick={() => { setSettingsView('history'); setIsSettingsOpen(true); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border transition-transform hover:scale-110 ${isBlackSwanMode ? 'bg-stone-800 border-stone-700 text-blue-400' : 'bg-white border-gray-50 text-blue-600'}`}>
              <History size={20} />
            </button>
            <div 
              onClick={() => setStep('profile')}
              className="w-12 h-12 rounded-2xl overflow-hidden border-4 border-white shadow-xl ml-3 cursor-pointer hover:ring-4 ring-emerald-100 transition-all active:scale-90"
            >
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>
      )}

      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <UI_Home 
              key="home" 
              onStart={() => {
                console.log('App: Transitioning to Select');
                navigateTo('select');
              }} 
              onProfile={() => navigateTo('profile')}
              onTutorial={() => navigateTo('tutorial')}
            />
          )}
          {step === 'tutorial' && (
            <UI_Tutorial key="tutorial" onBack={() => navigateTo('home')} />
          )}
          {step === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto py-12 px-6"
            >
              <div className="flex items-center justify-between mb-12">
                <button onClick={() => setStep('home')} className="p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-black">个人中心 & 偏好设置</h2>
                <div className="w-12" />
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                    <Coins className="text-amber-500" size={18} />
                    <span className="text-xl font-black text-amber-700">{profile.coins}</span>
                  </div>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">测试版奖励: +100金币</div>
                </div>

                <div className="flex items-center gap-6 mb-12">
                  <div 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUserSettings({...userSettings, avatarUrl: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="relative group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 p-2 shadow-2xl overflow-hidden ring-4 ring-white">
                      <img src={userSettings.avatarUrl || profile.avatar} className="w-full h-full rounded-[2rem] object-cover" alt="Avatar" />
                    </div>
                    <div className="absolute inset-2 bg-black/50 rounded-[2rem] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all backdrop-blur-sm">
                      <Camera size={24} className="text-white mb-2" />
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">更换照片</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-gray-50">
                      <input 
                        type="text" 
                        value={userSettings.userName} 
                        onChange={(e) => setUserSettings({...userSettings, userName: e.target.value})}
                        className="bg-transparent border-none p-0 text-3xl font-black italic focus:ring-0 w-full text-gray-900"
                        placeholder="输入您的姓名..."
                      />
                      <Edit3 size={20} className="text-gray-300" />
                    </div>
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" /> 认证学习教练 • 深度思考者
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 mb-8">
                  <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">内置头像预览</h4>
                  <div className="flex gap-2 overflow-x-auto pb-4">
                    {AVATAR_PRESETS.map((avatar, i) => (
                      <button 
                        key={i}
                        onClick={() => setUserSettings({...userSettings, avatarIdx: i, avatarUrl: ''})}
                        className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 transition-all ${!userSettings.avatarUrl && userSettings.avatarIdx === i ? 'ring-4 ring-emerald-500 ring-offset-2 scale-110' : 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0'}`}
                      >
                        <img src={avatar} className="w-full h-full object-cover" alt="Preset Avatar" />
                      </button>
                    ))}
                    <button 
                       onClick={() => {
                        setUserSettings({...userSettings, avatarUrl: ''});
                       }}
                       className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border-2 border-dashed border-gray-200 text-gray-300 hover:text-gray-900 transition-colors`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-8 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">{Object.keys(activities).length}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">攻克案例</div>
                  </div>
                  <div className="text-center border-l border-gray-50">
                    <div className="text-2xl font-black text-emerald-500">{Object.values(activities).reduce((acc: number, curr: any) => acc + curr.insights.length, 0)}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">沉淀经验</div>
                  </div>
                </div>

                {profile.scoreHistory && profile.scoreHistory.length > 0 && (
                  <div className="mt-12 space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">能力雷达图</h4>
                      <div className="h-[250px] bg-gray-50 rounded-3xl p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                            { subject: '逻辑', A: profile.lastRadarData?.logic || 0 },
                            { subject: '共情', A: profile.lastRadarData?.emotion || 0 },
                            { subject: '表达', A: profile.lastRadarData?.fluency || 0 },
                            { subject: '架构', A: profile.lastRadarData?.structure || 0 },
                            { subject: '洞察', A: profile.lastRadarData?.insight || 0 },
                          ]}>
                            <PolarGrid stroke="#E5E7EB" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                            <Radar name="能力" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">最近表现趋势</h4>
                      <div className="h-[200px] bg-gray-50 rounded-3xl p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={profile.scoreHistory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" hide />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                            />
                            <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex gap-4">
                  <button 
                    onClick={() => { setSettingsView('favorites'); setIsSettingsOpen(true); }}
                    className="flex-1 p-6 bg-rose-50 rounded-2xl text-rose-600 flex flex-col items-center gap-3 hover:bg-rose-100 transition-colors"
                  >
                    <Heart size={24} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest">我的收藏</span>
                  </button>
                  <button 
                    onClick={() => { setSettingsView('history'); setIsSettingsOpen(true); }}
                    className="flex-1 p-6 bg-blue-50 rounded-2xl text-blue-600 flex flex-col items-center gap-3 hover:bg-blue-100 transition-colors"
                  >
                    <History size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">成长轨迹</span>
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => navigateTo('home')}
                className="w-full mt-12 bg-gray-900 text-white h-20 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black transition-all active:scale-95"
              >
                保存设置并开启演练
              </button>
            </motion.div>
          )}
          {step === 'select' && (
            <UI_Select 
              key="select"
              selectedDeck={selectedDeck}
              setSelectedDeck={setSelectedDeck}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              isShuffling={isShuffling}
              handleDraw={handleDraw}
              onBack={() => navigateTo('home')}
            />
          )}
          {step === 'challenge' && (
            <UI_Challenge 
              key="challenge"
              currentQuestion={currentQuestion}
              displayQuestionText={displayQuestionText}
              setStep={navigateTo}
              handleDraw={handleDraw}
              isShuffling={isShuffling}
              toggleSave={toggleSave}
              savedIds={savedIds}
              showSummary={showSummary}
              setShowSummary={setShowSummary}
              insightText={insightText}
              setInsightText={setInsightText}
              saveInsight={saveInsight}
              isHintUnlocked={isHintUnlocked}
              setShowHintModal={setShowHintModal}
              showHintModal={showHintModal}
              onUnlock={handleUnlockHint}
              finishSpeech={finishSpeech}
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
              analysisResult={analysisResult}
              audioURL={audioURL}
              timerProps={{
                isActive,
                timeLeft,
                toggleTimer,
                resetTimer,
                finishSpeech,
                selectedDeck
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          view={settingsView}
          savedIds={savedIds}
          toggleSave={toggleSave}
          activities={activities}
          setCurrentQuestion={setCurrentQuestion}
          setStep={(s: AppStep) => setStep(s)}
          setSelectedDeck={setSelectedDeck}
          resetTimer={resetTimer}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
