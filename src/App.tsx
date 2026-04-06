import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Timer, 
  Lightbulb, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  BookOpen,
  Trophy,
  Zap,
  Coffee,
  Heart,
  X,
  Trash2,
  Settings,
  User,
  MessageSquare,
  History,
  Save,
  Camera,
  CheckCircle2,
  Quote,
  Users,
  Target,
  TrendingUp,
  Dices
} from 'lucide-react';
import { QUESTIONS, CATEGORIES, FRAMEWORKS, Question, DIFFICULTIES } from './questions';

interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
}

interface QuestionActivity {
  questionId: number;
  spokenAt: string[];
  insights: { date: string; text: string }[];
}

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe"
];

const App: React.FC = () => {
  // Core State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | '全部'>('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Intermediate');
  
  // User Data State
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('hx_saved_questions');
    return saved ? JSON.parse(saved) : [];
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hx_user_profile');
    return saved ? JSON.parse(saved) : { name: '教练家长', avatar: AVATAR_PRESETS[0], bio: '终身学习者，教练型家长。' };
  });
  const [activities, setActivities] = useState<Record<number, QuestionActivity>>(() => {
    const saved = localStorage.getItem('hx_user_activities');
    return saved ? JSON.parse(saved) : {};
  });

  // UI State
  const [isSavedListOpen, setIsSavedListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'favorites' | 'history'>('main');
  const [insightText, setInsightText] = useState('');
  const [isRecordingInsight, setIsRecordingInsight] = useState(false);
  const [showNoQuestionsError, setShowNoQuestionsError] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = DIFFICULTIES.find(d => d.id === 'Intermediate');
    return diff ? diff.time : 120;
  });
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('hx_saved_questions', JSON.stringify(savedIds));
    localStorage.setItem('hx_user_profile', JSON.stringify(profile));
    localStorage.setItem('hx_user_activities', JSON.stringify(activities));
  }, [savedIds, profile, activities]);

  // Filtered questions
  const filteredQuestions = QUESTIONS.filter(q => {
    const categoryMatch = selectedCategory === '全部' || q.category === selectedCategory;
    const difficultyMatch = q.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const savedQuestions = QUESTIONS.filter(q => savedIds.includes(q.id));
  const spokenQuestions = QUESTIONS.filter(q => activities[q.id]?.spokenAt.length > 0);

  // Handle Random Draw
  const drawQuestion = () => {
    if (filteredQuestions.length === 0) {
      setShowNoQuestionsError(true);
      setTimeout(() => setShowNoQuestionsError(false), 3000);
      return;
    }
    
    setIsRolling(true);
    setShowTips(false);
    setIsRecordingInsight(false);
    resetTimer();
    
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      setCurrentQuestion(filteredQuestions[randomIndex]);
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  const toggleSave = (id: number) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const recordSpeech = (id: number) => {
    const now = new Date().toISOString();
    setActivities(prev => {
      const activity = prev[id] || { questionId: id, spokenAt: [], insights: [] };
      return {
        ...prev,
        [id]: {
          ...activity,
          spokenAt: [...activity.spokenAt, now]
        }
      };
    });
    setIsRecordingInsight(true);
  };

  const saveInsight = () => {
    if (!currentQuestion || !insightText.trim()) return;
    const now = new Date().toISOString();
    setActivities(prev => {
      const activity = prev[currentQuestion.id] || { questionId: currentQuestion.id, spokenAt: [], insights: [] };
      return {
        ...prev,
        [currentQuestion.id]: {
          ...activity,
          insights: [...activity.insights, { date: now, text: insightText }]
        }
      };
    });
    setInsightText('');
    setIsRecordingInsight(false);
  };

  // Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    const diff = DIFFICULTIES.find(d => d.id === selectedDifficulty);
    setTimeLeft(diff ? diff.time : 120);
  };

  // Update timer when difficulty changes
  useEffect(() => {
    resetTimer();
  }, [selectedDifficulty]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTimeLimit = DIFFICULTIES.find(d => d.id === selectedDifficulty)?.time || 120;
  const progress = (timeLeft / currentTimeLimit) * 100;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D3436] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-8 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D3436] rounded-xl flex items-center justify-center text-white">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">教练心法 · 即兴闪电</h1>
            <p className="text-xs text-gray-500 font-medium">HXSchool 欢校 · 肌肉记忆练习</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSavedListOpen(true)}
            className="relative p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart size={24} fill={savedIds.length > 0 ? "currentColor" : "none"} className={savedIds.length > 0 ? "text-red-500" : ""} />
            {savedIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {savedIds.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-transform"
          >
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button 
            onClick={() => setSelectedCategory('全部')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${selectedCategory === '全部' ? 'bg-[#2D3436] text-white shadow-xl scale-105' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300 shadow-sm'}`}
          >
            <BookOpen size={16} />
            全部
          </button>
          {[
            { name: '亲子“火线”实战', icon: <Users size={16} /> },
            { name: '教练觉察与专业修身', icon: <Target size={16} /> },
            { name: '逻辑表达与个人成长', icon: <TrendingUp size={16} /> },
            { name: '随机“黑天鹅”挑战', icon: <Dices size={16} /> }
          ].map(cat => (
            <button 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-[#2D3436] text-white shadow-xl scale-105' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300 shadow-sm'}`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {DIFFICULTIES.map(diff => (
            <button 
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${selectedDifficulty === diff.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-gray-100 text-gray-400 hover:border-gray-300'}`}
            >
              <div className={`w-2 h-2 rounded-full ${selectedDifficulty === diff.id ? 'bg-white' : 'bg-gray-200'}`} />
              {diff.name}
            </button>
          ))}
        </div>

        {/* Question Display Card */}
        <div className="w-full relative min-h-[300px] flex items-center justify-center mb-12">
          <AnimatePresence mode="wait">
            {showNoQuestionsError ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X size={24} />
                </div>
                <p className="font-bold">当前分类和难度下暂无题目</p>
                <p className="text-xs mt-2 opacity-70">请尝试切换其他分类或降低难度</p>
              </motion.div>
            ) : !currentQuestion ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <BookOpen size={40} />
                </div>
                <p className="text-gray-400 font-medium">准备好开始你的教练演讲了吗？</p>
              </motion.div>
            ) : (
              <motion.div 
                key={currentQuestion.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full bg-white rounded-[2rem] p-10 sm:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-center relative overflow-hidden"
              >
                {/* Category Badge */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] uppercase tracking-widest font-bold rounded-full">
                  {currentQuestion.category}
                </div>

                {/* Favorite Toggle */}
                <button 
                  onClick={() => toggleSave(currentQuestion.id)}
                  className={`absolute top-6 right-8 p-2 rounded-full transition-all ${savedIds.includes(currentQuestion.id) ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'}`}
                >
                  <Heart size={24} fill={savedIds.includes(currentQuestion.id) ? "currentColor" : "none"} />
                </button>

                <h2 className={`text-2xl sm:text-3xl font-bold leading-relaxed transition-all ${isRolling ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
                  {currentQuestion.text}
                </h2>

                {/* Spoken Badge */}
                {activities[currentQuestion.id]?.spokenAt.length > 0 && (
                  <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    已练习 {activities[currentQuestion.id].spokenAt.length} 次
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-md">
          <button 
            onClick={drawQuestion}
            disabled={isRolling}
            className="group w-full bg-[#2D3436] hover:bg-[#000] text-white py-5 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`${isRolling ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} size={24} />
            {isRolling ? '抽取中...' : '随机抽题'}
          </button>

          {currentQuestion && (
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setShowTips(!showTips)}
                className={`flex-1 sm:px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${showTips ? 'bg-amber-100 text-amber-700' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
              >
                <Lightbulb size={20} />
                锦囊
              </button>
              <button 
                onClick={() => recordSpeech(currentQuestion.id)}
                className="flex-1 sm:px-6 py-5 bg-green-50 text-green-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition-all"
              >
                <CheckCircle2 size={20} />
                记感悟
              </button>
            </div>
          )}
        </div>

        {/* Insight Recording Area */}
        <AnimatePresence>
          {isRecordingInsight && currentQuestion && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full mt-8 bg-white rounded-3xl p-8 border border-green-100 shadow-xl shadow-green-900/5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-green-800 flex items-center gap-2">
                  <Quote size={18} />
                  记录本次演讲感悟
                </h3>
                <button onClick={() => setIsRecordingInsight(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <textarea 
                value={insightText}
                onChange={(e) => setInsightText(e.target.value)}
                placeholder="写下你对这个题目的新发现或教练觉察..."
                className="w-full h-32 p-4 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all text-sm"
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={saveInsight}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <Save size={16} />
                  保存感悟
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section */}
        <AnimatePresence>
          {showTips && currentQuestion && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mt-8 overflow-hidden"
            >
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
                <h3 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
                  <Lightbulb size={18} />
                  建议使用的逻辑框架
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.tips?.map(tip => (
                    <div key={tip} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                      <span className="block text-amber-600 font-bold text-xs mb-1 uppercase tracking-wider">{tip} 结构</span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {FRAMEWORKS[tip as keyof typeof FRAMEWORKS]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Section */}
        <div className="w-full mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                <Timer size={28} />
              </div>
              <div>
                <div className="text-3xl font-black tabular-nums tracking-tight">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  演讲计时器
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTimer}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-amber-100 text-amber-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'}`}
              >
                {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
              className={`h-full rounded-full ${timeLeft < 30 ? 'bg-red-400' : 'bg-blue-500'}`}
            />
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-20 text-center space-y-6">
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                <Trophy size={18} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">内化心法</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                <Zap size={18} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">即兴表达</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                <Coffee size={18} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">温暖陪伴</span>
            </div>
          </div>
          <p className="text-xs text-gray-300 font-medium">
            © 2026 HXSchool 欢校 · 教练型家长成长社区
          </p>
        </footer>
      </main>


      {/* Settings / Profile Page */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-[#FDFBF7] z-[60] overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-6 py-12">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (settingsView !== 'main') setSettingsView('main');
                      else setIsSettingsOpen(false);
                    }}
                    className="w-10 h-10 bg-[#2D3436] rounded-xl flex items-center justify-center text-white hover:bg-black transition-colors"
                  >
                    {settingsView === 'main' ? <Settings size={24} /> : <ChevronRight size={24} className="rotate-180" />}
                  </button>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {settingsView === 'main' ? '个人中心与设置' : settingsView === 'favorites' ? '我的收藏' : '成长足迹'}
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setSettingsView('main');
                  }}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {settingsView === 'main' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Section */}
                  <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full border-4 border-[#FDFBF7] shadow-md object-cover" />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-blue-700 transition-colors"
                        >
                          <Camera size={16} />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleAvatarUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full text-center font-bold text-xl bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none py-1"
                          placeholder="输入昵称"
                        />
                        <textarea 
                          value={profile.bio}
                          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full text-center text-sm text-gray-500 bg-transparent border-none focus:outline-none resize-none"
                          placeholder="输入个人简介"
                          rows={2}
                        />
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setSettingsView('history')}
                          className="text-center hover:bg-gray-50 p-2 rounded-xl transition-colors"
                        >
                          <div className="text-xl font-black text-[#2D3436]">{spokenQuestions.length}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">已讲题目</div>
                        </button>
                        <button 
                          onClick={() => setSettingsView('favorites')}
                          className="text-center hover:bg-gray-50 p-2 rounded-xl transition-colors"
                        >
                          <div className="text-xl font-black text-[#2D3436]">{savedIds.length}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">我的收藏</div>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-widest">推荐头像</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {AVATAR_PRESETS.map(url => (
                          <button 
                            key={url}
                            onClick={() => setProfile(prev => ({ ...prev, avatar: url }))}
                            className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all ${profile.avatar === url ? 'border-blue-500 scale-95' : 'border-transparent hover:border-gray-200'}`}
                          >
                            <img src={url} alt="Avatar Preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Access Section */}
                  <div className="lg:col-span-2 space-y-6">
                    <button 
                      onClick={() => setSettingsView('favorites')}
                      className="w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-100 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Heart size={28} fill="currentColor" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold">我的收藏</h3>
                          <p className="text-sm text-gray-400">查看你收藏的所有经典题目</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-gray-300">{savedIds.length}</span>
                        <ChevronRight className="text-gray-300" />
                      </div>
                    </button>

                    <button 
                      onClick={() => setSettingsView('history')}
                      className="w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <History size={28} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold">成长足迹</h3>
                          <p className="text-sm text-gray-400">回顾你讲过的题目与感悟</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-gray-300">{spokenQuestions.length}</span>
                        <ChevronRight className="text-gray-300" />
                      </div>
                    </button>

                    <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-2">教练小贴士</h4>
                      <p className="text-sm text-blue-600 leading-relaxed">
                        持续的练习是内化教练心法的唯一途径。尝试每天抽取一个题目进行 1-3 分钟的即兴演讲，并记录下你的新发现。
                      </p>
                    </div>
                  </div>
                </div>
              ) : settingsView === 'favorites' ? (
                <div className="space-y-6">
                  {savedQuestions.length === 0 ? (
                    <div className="py-20 text-center opacity-30 space-y-4">
                      <Heart size={48} className="mx-auto" />
                      <p className="font-medium">暂无收藏题目</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedQuestions.map(q => (
                        <div key={q.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-red-100 transition-all">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{q.category}</span>
                              <h4 className="font-bold text-gray-800">{q.text}</h4>
                              <button 
                                onClick={() => {
                                  setCurrentQuestion(q);
                                  setIsSettingsOpen(false);
                                  setSettingsView('main');
                                  resetTimer();
                                }}
                                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                              >
                                立即练习 <ChevronRight size={14} />
                              </button>
                            </div>
                            <button 
                              onClick={() => toggleSave(q.id)}
                              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="space-y-8">
                    {spokenQuestions.length === 0 ? (
                      <div className="py-20 text-center opacity-30 space-y-4">
                        <MessageSquare size={48} className="mx-auto" />
                        <p className="font-medium">还没有讲过题目哦，快去练习吧！</p>
                      </div>
                    ) : (
                      spokenQuestions.map(q => {
                        const activity = activities[q.id];
                        return (
                          <div key={q.id} className="border-b border-gray-50 pb-8 last:border-0">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{q.category}</span>
                                <h4 className="font-bold text-gray-800 text-lg">{q.text}</h4>
                              </div>
                              <div className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                                练习 {activity.spokenAt.length} 次
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {activity.insights.length > 0 ? (
                                activity.insights.map((insight, idx) => (
                                  <div key={idx} className="bg-[#FDFBF7] p-5 rounded-2xl relative group border border-gray-50">
                                    <Quote size={14} className="text-blue-200 absolute top-4 left-4" />
                                    <p className="text-sm text-gray-600 pl-8 leading-relaxed">
                                      {insight.text}
                                    </p>
                                    <div className="text-[9px] text-gray-300 mt-3 text-right font-medium">
                                      {new Date(insight.date).toLocaleString()}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-gray-300 italic pl-1">暂无感悟记录</p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
