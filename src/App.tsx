import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Users, 
  MessageCircle, 
  User as UserIcon, 
  Flame, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Heart, 
  CornerUpRight, 
  ArrowLeft,
  Bell,
  Settings,
  ShieldCheck,
  Gift,
  Gem,
  Plus,
  Play,
  RotateCw,
  Sparkles,
  Zap,
  HelpCircle,
  Star,
  Check,
  X,
  Eye,
  Search,
  Bookmark,
  Trash2,
  UserPlus,
  Video,
  Lock,
  Globe,
  Users2,
  MoreHorizontal,
  Clock,
  AlertTriangle,
  ArrowRight,
  Hash,
  Copy,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TOPICS, CURRENT_USER, GIFTS, SHOP_ITEMS, SHARE_FRIENDS, MOCK_GIFT_RECORDS } from './constants';
import { Logo } from './components/Logo';
import LoginScreen from './screens/LoginScreen';
import { Screen, Topic, GiftRecord } from './types';

// --- Shared Components ---

const SpotlightMarquee = ({ spotlightTopics, onSelect }: { spotlightTopics: Topic[], onSelect: (t: Topic) => void }) => {
  if (spotlightTopics.length === 0) return null;

  return (
    <div className="w-full h-12 flex items-center overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-dark to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-dark to-transparent z-10"></div>
      <motion.div 
        animate={{ x: [0, -900] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-3 items-center px-4"
      >
        {[...spotlightTopics, ...spotlightTopics, ...spotlightTopics, ...spotlightTopics, ...spotlightTopics].map((topic, i) => (
          <button 
            key={`${topic.id}-${i}`}
            onClick={() => onSelect(topic)}
            className="h-9 px-4 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl flex items-center gap-2.5 group shadow-sm"
          >
            {i % 2 === 0 ? (
              <Flame size={14} className="text-red-primary fill-current" />
            ) : (
              <Sparkles size={14} className="text-gold fill-gold" />
            )}
            <span className="text-sm font-bold text-white/80 max-w-[150px] truncate">{topic.city}的{topic.prompt}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

const BottomNav = ({ active, setScreen, onPlusClick }: { 
  active: Screen, 
  setScreen: (s: Screen) => void, 
  onPlusClick: () => void,
}) => {
  const navItems: { id: Screen, label: string, icon: typeof UserIcon }[] = [
    { id: 'home', label: '今日', icon: Flame },
    { id: 'circle', label: 'DR圈', icon: Users },
  ];
  
  const rightNavItems: { id: Screen, label: string, icon: typeof UserIcon }[] = [
    { id: 'messages', label: '消息', icon: MessageCircle },
    { id: 'me', label: '我的', icon: UserIcon },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[96px] bg-dark/95 backdrop-blur-xl border-t border-white/[0.03] flex items-center justify-between px-4 z-50 pb-6">
      <div className="flex flex-1 justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 w-12 h-12 rounded-2xl transition-all duration-300 ${
              active === item.id ? 'text-gold' : 'text-white/30 hover:text-gold/60'
            }`}
          >
            <item.icon size={20} className={active === item.id ? 'text-gold fill-gold/10' : ''} strokeWidth={active === item.id ? 2.5 : 2} />
            <span className={`text-[10px] font-black tracking-widest ${active === item.id ? 'text-gold' : 'text-white/30'}`}>
              {item.label}
            </span>
            {active === item.id && (
              <motion.div layoutId="navIndicator" className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full shadow-[0_0_8px_gold]" />
            )}
          </button>
        ))}
      </div>

      <button 
        onClick={onPlusClick}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all -mt-12 border-[6px] border-dark box-content z-50 bg-white text-dark"
      >
        <Plus size={28} strokeWidth={3} />
      </button>

      <div className="flex flex-1 justify-around">
        {rightNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 w-12 h-12 rounded-2xl transition-all duration-300 ${
              active === item.id ? 'text-gold' : 'text-white/30 hover:text-gold/60'
            }`}
          >
            <item.icon size={20} className={active === item.id ? 'text-gold fill-gold/10' : ''} strokeWidth={active === item.id ? 2.5 : 2} />
            <span className={`text-[10px] font-black tracking-widest ${active === item.id ? 'text-gold' : 'text-white/30'}`}>
              {item.label}
            </span>
            {active === item.id && (
              <motion.div layoutId="navIndicator" className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full shadow-[0_0_8px_gold]" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

// --- Home Screen ---

const HomeScreen = ({ 
  setScreen, 
  setSelectedTopic, 
  topics, 
  savedTopicIds, 
  toggleFavorite, 
  likedTopicIds, 
  toggleLike, 
  setSelectedUserName, 
  spotlightTopicIds, 
  spotlightTopic, 
  showToast,
}: { 
  setScreen: (s: Screen) => void, 
  setSelectedTopic: (t: Topic) => void,
  topics: Topic[],
  savedTopicIds: Set<string>,
  toggleFavorite: (id: string) => void,
  likedTopicIds: Set<string>,
  toggleLike: (id: string) => void,
  setSelectedUserName: (name: string) => void,
  spotlightTopicIds: Set<string>,
  spotlightTopic: (id: string) => void,
  showToast: (m: string) => void,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const homeTopics = topics.filter(t => t.status !== 'completed');
  const currentTopic = homeTopics[currentIndex % homeTopics.length];
  const isFavorite = savedTopicIds.has(currentTopic.id);
  const isLiked = likedTopicIds.has(currentTopic.id);
  const spotlightTopics = topics.filter(t => spotlightTopicIds.has(t.id));
  const marqueeTopics = spotlightTopics.length > 0 ? spotlightTopics : homeTopics;

  const nextTopic = () => setCurrentIndex((prev) => (prev + 1) % homeTopics.length);
  const prevTopic = () => setCurrentIndex((prev) => (prev - 1 + homeTopics.length) % homeTopics.length);
  
  return (
    <div className="flex flex-col h-full bg-dark font-sans pt-8">
      <div className="pt-6">
        <SpotlightMarquee 
          spotlightTopics={marqueeTopics} 
          onSelect={(topic) => {
            setSelectedTopic(topic);
            setScreen('topic-detail');
          }} 
        />
      </div>

      <main className="px-4 flex-1 overflow-y-auto no-scrollbar pb-32 pt-14">
        <div className="relative">
          {[0, 1].map((stackIndex) => {
            const topicIndex = (currentIndex - stackIndex - 1 + homeTopics.length * 10) % homeTopics.length;
            const topic = homeTopics[topicIndex];
            return (
              <div
                key={`stack-preview-${topic.id}-${stackIndex}`}
                className={`absolute h-20 rounded-[36px] bg-gradient-to-br ${
                  topic.tone === 'blue' ? 'from-indigo-600/60 via-indigo-900/55' : 'from-amber-600/60 via-amber-900/55'
                } to-black border border-white/15 shadow-xl`}
                style={{
                  left: `${20 + stackIndex * 7}px`,
                  right: `${20 + stackIndex * 7}px`,
                  top: `${-10 - stackIndex * 9}px`,
                  opacity: 0.72 - stackIndex * 0.12,
                  transform: `rotate(${stackIndex % 2 === 0 ? -1 : 1}deg)`,
                  zIndex: stackIndex,
                }}
              >
                <div className="absolute inset-x-6 bottom-4 h-px bg-white/15" />
              </div>
            );
          })}

          <button
            onClick={(e) => { e.stopPropagation(); prevTopic(); }}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 w-8 h-8 glass-pill rounded-full flex items-center justify-center border border-white/15 text-white/80 active:scale-95 transition-transform shadow-xl bg-black/25"
            aria-label="上一个话题"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextTopic(); }}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 w-8 h-8 glass-pill rounded-full flex items-center justify-center border border-white/15 text-white/80 active:scale-95 transition-transform shadow-xl bg-black/25"
            aria-label="下一个话题"
          >
            <ChevronRight size={18} />
          </button>

          <motion.div 
            key={currentTopic.id}
            layoutId={`topic-card-${currentTopic.id}`}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            drag
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            whileDrag={{ scale: 0.97 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -450 || info.offset.y < -50 || info.velocity.y < -450) {
                nextTopic();
              } else if (info.offset.x > 50 || info.velocity.x > 450 || info.offset.y > 50 || info.velocity.y > 450) {
                prevTopic();
              }
            }}
            className="group relative z-10 active:scale-[0.98] transition-transform duration-500 border-none"
            onClick={() => {
              setSelectedTopic(currentTopic);
              setScreen('topic-detail');
            }}
          >
            <div className={`aspect-[4/6] relative bg-gradient-to-br transition-all duration-1000 px-10 pt-6 pb-10 flex flex-col justify-between rounded-[48px] overflow-hidden border ${
              currentTopic.status === 'completed' ? 'border-gold/30 shadow-[0_0_40px_rgba(214,178,126,0.1)]' : 'border-white/20 shadow-2xl'
            } ${
              currentTopic.tone === 'blue' ? 'from-indigo-600 via-indigo-900' : 'from-amber-600 via-amber-900'
            } to-black group-hover:scale-[1.02] transition-transform`}>
            {currentTopic.image && (
              <img
                src={currentTopic.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-65"
              />
            )}
            {currentTopic.status === 'completed' && (
              <div className="absolute inset-0 bg-gold/5 pointer-events-none mix-blend-overlay"></div>
            )}
            <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent opacity-100"></div>
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent opacity-80"></div>
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 100%)' }}></div>
            
            <div className="flex justify-between items-start z-10 pt-2">
              <div className="flex flex-col gap-1.5">
                <span className="w-fit bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase text-white border border-white/10 shadow-sm">
                  {currentTopic.city}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(currentTopic.id); }}
                  className={`w-10 h-10 glass-pill rounded-xl flex items-center justify-center transition-colors ${isFavorite ? 'bg-gold text-dark border-dark shadow-lg shadow-gold/20' : ''}`}
                >
                  <Star size={20} className={isFavorite ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            <div className="space-y-10 z-10">
              <div className="space-y-4">
                <p className="text-white/60 text-[13px] font-medium tracking-[0.05em] mb-2 drop-shadow-sm">Today's DR Moment</p>
                <h2 className="text-6xl font-bold leading-[0.85] tracking-tighter text-white">{currentTopic.title}</h2>
                <p className="text-white/80 text-base line-clamp-3 mt-6 leading-relaxed">{currentTopic.description}</p>
              </div>

              <div className="grid grid-cols-2 items-end pt-10 border-t border-white/20 gap-8">
                <div className="flex min-h-[48px] flex-col justify-end min-w-0 order-2 items-end text-right">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                      <Users size={14} className="text-white/60" />
                      <span className="text-[12px] font-black text-white tracking-widest">
                        {currentTopic.joinedCount} / {currentTopic.targetCount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left min-h-[48px] pb-1 flex flex-col justify-end items-start gap-2 isolate mt-auto order-1">
                  <div className="flex flex-col items-start">
                    <p className={`text-2xl font-bold leading-none ${currentTopic.status === 'completed' ? 'text-gold italic font-black' : 'text-white'}`}>
                      {currentTopic.status === 'completed' ? 'DR·CIRCLE' : currentTopic.deadline}
                    </p>
                    {currentTopic.status !== 'completed' && (
                       <p className="text-[10px] font-black uppercase text-white/40 mt-1 tracking-widest">剩余时间</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const HeatingConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#1a1a1a] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto border border-gold/20">
                <Flame size={40} className="text-gold fill-gold" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">加热共创话题</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  加热后，会有更多人能留意到该作品
                </p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">消耗钻石</span>
                  <span className="text-gold font-bold">100 💎</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">展示时效</span>
                  <span className="text-white/80">话题成圈前有效</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 h-14 bg-white/5 text-white/60 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 h-14 bg-gold text-dark rounded-2xl font-black text-sm active:scale-95 transition-transform"
                >
                  确认加热
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FriendSelectionModal = ({ 
  isOpen, 
  onClose, 
  onInvite, 
  remainingCount 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onInvite: (selectedNames: string[]) => void, 
  remainingCount: number 
}) => {
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
  
  const FRIENDS = [
    { name: '林野', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop' },
    { name: 'Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop' },
    { name: '苏苏', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop' },
  ];

  const handleToggle = (name: string) => {
    setSelectedFriends(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        if (next.size < remainingCount) {
          next.add(name);
        }
      }
      return next;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[80vh] bg-[#121212] rounded-t-[40px] z-[61] flex flex-col overflow-hidden border-t border-white/10"
          >
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">选择好友</h3>
                <p className="text-xs text-white/40 mt-1">还可以邀请 {remainingCount - selectedFriends.size} 位好友</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {FRIENDS.map(friend => (
                <button
                  key={friend.name}
                  onClick={() => handleToggle(friend.name)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                    selectedFriends.has(friend.name) 
                    ? 'bg-gold/10 border-gold shadow-[0_0_20px_rgba(255,184,0,0.1)]' 
                    : 'bg-white/5 border-white/5'
                  }`}
                >
                  <img src={friend.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-black bg-white/10" />
                  <span className="flex-1 text-left font-bold text-white">{friend.name}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedFriends.has(friend.name)
                    ? 'bg-gold border-gold'
                    : 'border-white/20'
                  }`}>
                    {selectedFriends.has(friend.name) && <Check size={14} className="text-dark" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 bg-dark/80 backdrop-blur-xl border-t border-white/5">
              <button
                disabled={selectedFriends.size === 0}
                onClick={() => {
                  onInvite(Array.from(selectedFriends));
                  onClose();
                }}
                className={`w-full h-14 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  selectedFriends.size > 0 
                  ? 'bg-gold text-dark' 
                  : 'bg-white/10 text-white/20'
                }`}
              >
                发送邀请 {selectedFriends.size > 0 && `(${selectedFriends.size})`}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

type Visibility = 'public' | 'friends' | 'private' | 'selected';

const VisibilitySelectorDrawer = ({ 
  isOpen, 
  onClose, 
  visibility, 
  setVisibility, 
  selectedFriendIds, 
  setSelectedFriendIds 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  visibility: Visibility,
  setVisibility: (v: Visibility) => void,
  selectedFriendIds: Set<string>,
  setSelectedFriendIds: (ids: Set<string>) => void
}) => {
  const friends = [
    { id: '1', name: '林野', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop' },
    { id: '2', name: 'Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop' },
    { id: '5', name: '苏苏', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop' },
  ];

  const toggleFriend = (id: string) => {
    const next = new Set(selectedFriendIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedFriendIds(next);
  };

  const options: { id: Visibility, label: string, desc: string, icon: any }[] = [
    { id: 'public', label: '公开', desc: '所有人可见', icon: <Globe size={18} /> },
    { id: 'friends', label: '朋友', desc: '互关朋友可见', icon: <Users2 size={18} /> },
    { id: 'private', label: '私密', desc: '仅自己可见', icon: <Lock size={18} /> },
    { id: 'selected', label: '部分可见', desc: '选中的朋友可见', icon: <UserIcon size={18} /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] rounded-t-[40px] max-h-[85vh] overflow-hidden flex flex-col z-[120] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/5"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
            <header className="p-6 pt-2 flex items-center justify-between border-b border-white/[0.03]">
              <button onClick={onClose} className="text-white/40 font-bold text-xs uppercase tracking-widest px-2">取消</button>
              <h3 className="font-black text-white text-sm tracking-[0.3em] uppercase">谁可以看</h3>
              <button 
                onClick={onClose} 
                className="px-6 py-2 bg-gold text-dark rounded-full text-xs font-black shadow-lg shadow-gold/20 active:scale-95 transition-transform"
              >
                确定
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-6 space-y-6 pb-20">
              <div className="space-y-2">
                {options.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setVisibility(item.id)}
                    className={`p-5 rounded-3xl border transition-all flex items-center justify-between ${visibility === item.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${visibility === item.id ? 'bg-gold text-dark border-gold' : 'bg-white/5 text-white/30 border-white/5'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-tighter mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${visibility === item.id ? 'border-gold bg-gold' : 'border-white/10'}`}>
                      {visibility === item.id && <Check size={12} className="text-dark" strokeWidth={4} />}
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {visibility === 'selected' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                  >
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] ml-1">选择好友</label>
                    <div className="space-y-2">
                      {friends.map(friend => (
                        <div 
                          key={friend.id}
                          onClick={() => toggleFriend(friend.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedFriendIds.has(friend.id) ? 'bg-white/10 border-white/10' : 'bg-white/5 border-white/5'}`}
                        >
                          <div className="flex items-center gap-4">
                            <img src={friend.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                            <span className="font-bold text-white text-sm">{friend.name}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedFriendIds.has(friend.id) ? 'bg-gold border-gold' : 'border-white/10'}`}>
                            {selectedFriendIds.has(friend.id) && <Check size={14} className="text-dark" strokeWidth={3} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const GiftDonorStack = ({ gifts, onClick }: { gifts: GiftRecord[], onClick: () => void }) => {
  const topGifts = gifts.slice(0, 3);
  const remaining = gifts.length > 3 ? gifts.length - 3 : 0;
  
  return (
    <button onClick={onClick} className="pointer-events-auto flex -space-x-2 items-center hover:scale-105 transition-transform bg-black/20 p-1 rounded-full border border-white/10 backdrop-blur-md">
      {topGifts.map((g, i) => (
        <img key={g.id} src={g.avatar} className="w-8 h-8 rounded-full border-2 border-dark" alt={g.userName} />
      ))}
      {remaining > 0 && (
         <div className="w-8 h-8 rounded-full bg-dark/80 text-white text-[10px] flex items-center justify-center font-bold border-2 border-dark">
           +{remaining}
         </div>
      )}
    </button>
  );
};

const GiftDonorDetailModal = ({ 
  isOpen, 
  onClose, 
  gifts 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  gifts: GiftRecord[] 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#1a1a1a] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">赠礼用户详情</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
                  {gifts.map(g => (
                    <div key={g.id} className="flex items-center gap-3">
                      <img src={g.avatar} className="w-10 h-10 rounded-full" alt={g.userName} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{g.userName}</p>
                        <p className="text-xs text-white/50">{g.giftName}</p>
                      </div>
                      <span className="text-sm font-black text-gold">{g.giftValue}</span>
                    </div>
                  ))}
                </div>
              <button 
                onClick={onClose}
                className="w-full mt-6 h-12 bg-white/5 text-white/60 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TopicDetail = ({ topic, setScreen, toggleFavorite, isFavorite, toggleLike, isLiked, setSelectedTopic, setSelectedUserName, showToast, isSpotlighted, spotlightTopic, userVlogs, deleteVlog, setCircleInitialTopicInfo }: { 
  topic: Topic, 
  setScreen: (s: Screen) => void,
  toggleFavorite: (id: string) => void,
  isFavorite: boolean,
  toggleLike: (id: string) => void,
  isLiked: boolean,
  setSelectedTopic: (topic: Topic) => void,
  setSelectedUserName: (name: string) => void,
  showToast: (m: string) => void,
  isSpotlighted: boolean,
  spotlightTopic: (id: string) => void,
  userVlogs: UserVlog[],
  deleteVlog: (id: string) => void,
  setCircleInitialTopicInfo: (info: Partial<Topic> | undefined) => void
}) => {
  const [isCreatorsExpanded, setIsCreatorsExpanded] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isHeatingModalOpen, setIsHeatingModalOpen] = useState(false);
  const [isGiftDonorModalOpen, setIsGiftDonorModalOpen] = useState(false);
  const [isGiftDonorDetailModalOpen, setIsGiftDonorDetailModalOpen] = useState(false);
  const [isVisibilityDrawerOpenForClips, setIsVisibilityDrawerOpenForClips] = useState(false);
  const [editingClipId, setEditingClipId] = useState<string | null>(null);
  const [clipVisibility, setClipVisibility] = useState<Visibility>('public');
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  const [selectedShareUserIds, setSelectedShareUserIds] = useState<Set<string>>(new Set());
  const [isDeletingClip, setIsDeletingClip] = useState(false);
  const [clipToDelete, setClipToDelete] = useState<string | null>(null);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);

  const remainingCount = topic.targetCount - topic.joinedCount;
  const progressPercent = Math.min(100, (topic.joinedCount / topic.targetCount) * 100);
  const userTopicClips = userVlogs.filter(v => v.topicId === topic.id);
  const visibleCreatorSlots = isCreatorsExpanded ? topic.targetCount : Math.min(topic.targetCount, 8);
  const topicGifts = MOCK_GIFT_RECORDS.filter(g => g.topicId === topic.id);

  const toggleShareUser = (id: string) => {
    const next = new Set(selectedShareUserIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedShareUserIds(next);
  };

  const shareDrawer = (
    <AnimatePresence>
      {isShareDrawerOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={(e) => { e.stopPropagation(); setIsShareDrawerOpen(false); }}
           className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111111] rounded-t-[32px] pt-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5"
          >
              <div className="flex justify-between items-center px-6 mb-4">
                <h3 className="text-white text-sm font-black tracking-[0.2em] uppercase">分享给好友</h3>
                <button 
                  onClick={() => setIsShareDrawerOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/40 active:scale-95 transition-transform"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Multi-select Friends List */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
                {SHARE_FRIENDS.map((friend) => (
                  <button 
                    key={friend.id} 
                    className="flex flex-col items-center gap-2 min-w-[64px] group relative" 
                    onClick={() => toggleShareUser(friend.id)}
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all p-0.5 active:scale-95 ${
                      selectedShareUserIds.has(friend.id) ? 'border-red-primary bg-red-primary/10' : 'border-white/5 bg-white/5'
                    }`}>
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    {/* Checkbox Overlay */}
                    <div className={`absolute top-0 right-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedShareUserIds.has(friend.id) 
                        ? 'bg-red-primary border-red-primary opacity-100 scale-100' 
                        : 'bg-black/20 border-white/20 opacity-40 scale-75'
                    }`}>
                      {selectedShareUserIds.has(friend.id) && <Check size={12} className="text-white" strokeWidth={4} />}
                    </div>
                    <span className={`text-[10px] font-black tracking-tight transition-colors ${
                      selectedShareUserIds.has(friend.id) ? 'text-white' : 'text-white/40'
                    }`}>
                      {friend.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action Bar / Send Button */}
              <AnimatePresence>
                {selectedShareUserIds.size > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="px-6 py-2"
                  >
                    <button 
                      onClick={() => {
                        showToast(`已向 ${selectedShareUserIds.size} 位好友发送邀请`);
                        setIsShareDrawerOpen(false);
                      }}
                      className="w-full h-14 bg-red-primary text-white rounded-2xl font-black uppercase text-xs shadow-[0_10px_30px_rgba(255,36,66,0.3)] active:scale-95 transition-transform"
                    >
                      发送给 {selectedShareUserIds.size} 位好友
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-white/5 w-full mx-auto max-w-[80%] my-2" />

              {/* Other Sharing Channels */}
              <div className="flex gap-6 overflow-x-auto no-scrollbar px-6 pb-2">
                <button key="drawer1-wechat" className="flex flex-col items-center gap-2 group shrink-0" onClick={() => { showToast('正在跳转微信...'); setIsShareDrawerOpen(false); }}>
                  <div className="w-12 h-12 bg-[#07C160]/10 border border-[#07C160]/20 rounded-2xl flex items-center justify-center text-[#07C160] active:scale-95 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">微信好友</span>
                </button>
                <button key="drawer1-moments" className="flex flex-col items-center gap-2 group shrink-0" onClick={() => { showToast('正在跳转朋友圈...'); setIsShareDrawerOpen(false); }}>
                  <div className="w-12 h-12 bg-[#07C160]/10 border border-[#07C160]/20 rounded-2xl flex items-center justify-center text-[#07C160] active:scale-95 transition-transform">
                    <Users size={24} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">朋友圈</span>
                </button>
                <button key="drawer1-copy-link" className="flex flex-col items-center gap-2 group shrink-0" onClick={() => { showToast('已复制链接'); setIsShareDrawerOpen(false); }}>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/60 active:scale-95 transition-transform">
                    <CornerUpRight size={20} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">复制链接</span>
                </button>
                <button 
                  key="drawer1-copy-topic"
                  className="flex flex-col items-center gap-2 group shrink-0" 
                  onClick={() => { 
                    setIsShareDrawerOpen(false);
                    setCircleInitialTopicInfo(topic);
                    setScreen('create-circle');
                    showToast('话题配置已复制，您可以修改后发布');
                  }}
                >
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/60 active:scale-95 transition-transform">
                    <Copy size={20} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">复制话题并创建</span>
                </button>
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (topic.status !== 'completed') {
    return (
      <div className="flex flex-col h-full bg-dark pt-8">
        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-8">
          <motion.div
            layoutId={`topic-card-${topic.id}`}
            className={`relative min-h-[720px] rounded-[48px] overflow-hidden border border-white/20 shadow-2xl px-7 pt-6 pb-7 flex flex-col justify-between bg-gradient-to-br ${
              topic.tone === 'blue' ? 'from-indigo-600 via-indigo-950' :
              topic.tone === 'amber' ? 'from-amber-600 via-amber-950' : 'from-emerald-600 via-emerald-950'
            } to-black`}
          >
            {topic.image && (
              <img src={topic.image} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60" />
            )}
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 70% 28%, white 0%, transparent 65%)' }} />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <button
                onClick={() => setScreen('home')}
                className="w-10 h-10 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label="关闭详情"
              >
                <X size={20} />
              </button>
              <div className="flex gap-2">
                {topicGifts.length > 0 && <GiftDonorStack gifts={topicGifts} onClick={() => setIsGiftDonorModalOpen(true)} />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(topic.id);
                  }}
                  className={`w-10 h-10 rounded-2xl border backdrop-blur-md flex items-center justify-center active:scale-95 transition-all ${
                    isFavorite ? 'bg-gold text-dark border-gold' : 'bg-black/25 text-white border-white/10'
                  }`}
                  aria-label={isFavorite ? '取消收藏' : '收藏'}
                >
                  <Star size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsShareDrawerOpen(true); }} className="w-10 h-10 rounded-2xl border backdrop-blur-md flex items-center justify-center bg-black/25 text-white border-white/10 active:scale-95">
                  <CornerUpRight size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHeatingModalOpen(true);
                  }}
                  className={`w-10 h-10 rounded-2xl border backdrop-blur-md flex items-center justify-center active:scale-95 transition-all ${
                    isSpotlighted ? 'bg-gold text-dark border-gold' : 'bg-black/25 text-gold border-gold/30'
                  }`}
                >
                  <Flame size={14} className={isSpotlighted ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            <HeatingConfirmationModal 
              isOpen={isHeatingModalOpen}
              onClose={() => setIsHeatingModalOpen(false)}
              onConfirm={() => spotlightTopic(topic.id)}
            />

            <GiftDonorDetailModal 
              isOpen={isGiftDonorDetailModalOpen}
              onClose={() => setIsGiftDonorDetailModalOpen(false)}
              gifts={topicGifts}
            />

            <div className="relative z-10 space-y-7">
              <div className="space-y-4">
                <div className="space-y-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUserName(topic.creator);
                      setScreen('user-profile');
                    }}
                    className="flex items-center gap-2 w-fit rounded-full bg-white/10 border border-white/10 py-1.5 pl-1.5 pr-3 backdrop-blur-md active:scale-95 transition-transform"
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.creator}`} alt="" className="w-7 h-7 rounded-full bg-white/10" />
                    <span className="text-[10px] font-black text-white/70 tracking-widest">{topic.creator} 发起</span>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-[10px] font-black text-white/75 tracking-widest">{topic.city}</span>
                    <span className="rounded-full bg-gold/15 border border-gold/20 px-3 py-1.5 text-[10px] font-black text-gold tracking-widest">待成圈</span>
                    <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-[10px] font-black text-white/55 tracking-widest">拍{topic.durationLimit || 15}秒视频</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl font-black leading-[0.9] tracking-tight text-white">{topic.title}</h1>
                  <p className="text-sm text-white/75 leading-relaxed max-w-[280px]">{topic.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-6">
                 <div>
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest">共创进度</h4>
                     <span className="text-[10px] font-black text-gold">{topic.joinedCount}/{topic.targetCount} <span className="text-white/30 ml-0.5">人</span></span>
                   </div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-gold rounded-full"
                      />
                   </div>
                   <div className="flex justify-between items-center">
                     <p className="text-[10px] text-white/40 tracking-wide">
                       再邀请 <span className="text-white font-bold">{topic.targetCount - topic.joinedCount}</span> 人即可成圈
                     </p>
                     <p className="text-[10px] font-black text-red-primary tracking-widest bg-red-primary/10 px-2 py-1 rounded-md">限时 {topic.deadline}</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between gap-3 pb-3">
                   <div className="flex -space-x-2 min-w-0">
                     {Array.from({ length: Math.min(topic.joinedCount, 8) }).map((_, i) => (
                       <button
                         key={i}
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedUserName(`共创者 ${i + 1}`);
                           setScreen('user-profile');
                         }}
                         className="w-9 h-9 rounded-full border-2 border-black bg-white/10 overflow-hidden active:scale-90 transition-transform relative z-10"
                       >
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.id + i}`} alt="" className="w-full h-full object-cover" />
                       </button>
                     ))}
                   </div>
                   <button
                     onClick={() => setIsCreatorsExpanded(true)}
                     className="shrink-0 h-10 px-4 rounded-full bg-white/10 border border-white/10 text-[10px] font-black text-white/65 active:scale-95 transition-transform"
                   >
                     查看共创人
                   </button>
                 </div>

                 <div className="pt-2 border-t border-white/5">
                   {userTopicClips.length === 0 ? (
                     <button
                       onClick={() => {
                          if (topic.creator === CURRENT_USER.name) {
                            setScreen('create-and-shoot');
                          } else {
                            setScreen('join');
                          }
                       }}
                       className="w-full h-14 bg-red-primary text-white rounded-[20px] font-black uppercase shadow-[0_10px_25px_-5px_rgba(255,36,66,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2.5"
                     >
                       <Camera size={18} />
                       <div className="flex flex-col items-start leading-tight">
                         <span className="text-sm">{topic.creator === CURRENT_USER.name ? '开始拍摄' : '参与话题'}</span>
                         <span className="text-[10px] text-white/80">拍下此刻</span>
                       </div>
                     </button>
                   ) : (
                     <button
                       onClick={() => setIsInviteModalOpen(true)}
                       className="w-full h-14 bg-white/10 border border-white/10 text-white rounded-[20px] font-black uppercase text-sm shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2.5"
                     >
                       <UserPlus size={18} />
                       <span className="text-sm">邀请好友加入</span>
                     </button>
                   )}
                 </div>
              </div>

              {userTopicClips.length > 0 && (
                <div className="flex flex-col items-center gap-1 pt-4 opacity-50">
                  <p className="text-[9px] font-black text-white/60 tracking-[0.2em] uppercase">下滑查看拍摄记录</p>
                  <ChevronDown size={12} className="text-white animate-bounce" />
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {userTopicClips.length > 0 && (
              <motion.div
                key="user-clips"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">我的拍摄记录</h3>
                  <span className="text-[10px] text-green-400 font-bold">{userTopicClips.length} 个片段</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {userTopicClips.map((clip) => (
                    <div key={clip.id} className="aspect-[4/3] rounded-[24px] bg-white/5 border border-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera size={24} className="text-white/5" />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 z-20">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClipId(clip.id);
                            setIsVisibilityDrawerOpenForClips(true);
                          }}
                          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 border border-white/10 transition-all active:scale-95 hover:text-white"
                        >
                          <Lock size={12} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setClipToDelete(clip.id);
                            setIsDeletingClip(true);
                          }}
                          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-rose-400 border border-white/10 transition-all active:scale-95 hover:bg-rose-500/20"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-center">
                        <p className="text-[9px] font-bold text-white/60 truncate tracking-wide">已录制 • 待解锁</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {isDeletingClip && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
                  onClick={() => setIsDeletingClip(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm bg-[#121212] rounded-[32px] p-8 border border-white/10 shadow-2xl space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
                      <Trash2 size={32} />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-bold text-white">您确定要删除该作品吗？</h3>
                      <p className="text-xs text-white/40 leading-relaxed">删除后将无法恢复，且您在该话题中的贡献片段将被移除。</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsDeletingClip(false)}
                        className="h-12 rounded-2xl bg-white/5 text-white/60 font-bold active:scale-95 transition-transform"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          if (clipToDelete) {
                            deleteVlog(clipToDelete);
                            showToast('片段已删除');
                          }
                          setIsDeletingClip(false);
                        }}
                        className="h-12 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-transform"
                      >
                        确认删除
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {isCreatorsExpanded && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCreatorsExpanded(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[50]"
                />
                <motion.div
                  key="creators-expanded"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute inset-x-0 bottom-0 h-[85vh] bg-[#121212] rounded-t-[40px] z-[51] flex flex-col overflow-hidden border-t border-white/10"
                >
                  <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide">全部共创者</h3>
                      <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">还差 {remainingCount} 个共创人成圈</p>
                    </div>
                    <button 
                      onClick={() => setIsCreatorsExpanded(false)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {Array.from({ length: topic.joinedCount }).map((_, i) => (
                      <div
                        key={`joined-${topic.id}-${i}`}
                        onClick={() => {
                          setSelectedUserName(`共创者 ${i + 1}`);
                          setScreen('user-profile');
                        }}
                        className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-3xl active:scale-[0.98] transition-transform cursor-pointer"
                      >
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.id + i}`} 
                          alt="" 
                          className="w-12 h-12 rounded-full border-2 border-black bg-white/10" 
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-white">共创者 {i + 1}</h4>
                          <p className="text-[10px] text-white/30 uppercase tracking-tighter">已上传共创片段</p>
                        </div>
                        <ChevronRight size={16} className="text-white/20" />
                      </div>
                    ))}
                    
                    {Array.from({ length: remainingCount }).map((_, i) => (
                      <div 
                        key={`empty-${i}`} 
                        className="flex items-center gap-4 bg-white/[0.02] border border-dashed border-white/10 p-4 rounded-3xl"
                      >
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                          <UserIcon size={20} className="text-white/10" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white/20 italic">虚位以待</h4>
                          <p className="text-[10px] text-white/10 uppercase tracking-tighter">等待共创者加入</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-dark/80 backdrop-blur-xl border-t border-white/5">
                    <button
                      onClick={() => setIsInviteModalOpen(true)}
                      className="w-full h-14 bg-white text-dark font-black rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <UserPlus size={18} />
                      邀请好友
                    </button>
                    <div className="mt-4 text-center">
                      <p className="text-[10px] text-white/20 font-medium">邀请好友加入，成圈后解锁集体记忆</p>
                    </div>
                  </div>
                </motion.div>

                <FriendSelectionModal 
                  isOpen={isInviteModalOpen}
                  onClose={() => setIsInviteModalOpen(false)}
                  remainingCount={remainingCount}
                  onInvite={(friends) => {
                    showToast(`已向 ${friends.length} 位好友发送邀请`);
                    setIsInviteModalOpen(false);
                  }}
                />
              </>
            )}
            <VisibilitySelectorDrawer 
              isOpen={isVisibilityDrawerOpenForClips}
              onClose={() => setIsVisibilityDrawerOpenForClips(false)}
              visibility={clipVisibility}
              setVisibility={setClipVisibility}
              selectedFriendIds={selectedFriendIds}
              setSelectedFriendIds={setSelectedFriendIds}
            />
          </AnimatePresence>
        </main>
        {shareDrawer}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('home')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
          <X size={14} className="text-white" />
        </button>
          <div className="flex-1 flex items-center justify-between px-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h2 className="font-bold tracking-tight text-white">话题详情</h2>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${
                topic.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-gold/10 text-gold'
              }`}>
                {topic.status === 'completed' ? `${topic.joinedCount}人共创` : '待成圈'}
              </span>
            </div>
          </div>
        </div>
        {topic.status === 'completed' ? (
          <button onClick={() => setIsShareDrawerOpen(true)} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
            <CornerUpRight size={20} className="text-white" />
          </button>
        ) : (
          <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                setIsHeatingModalOpen(true);
            }}
            className={`h-10 px-4 rounded-2xl flex items-center gap-1.5 transition-all text-xs font-black uppercase border shadow-lg ${
              isSpotlighted ? 'bg-gold text-dark border-gold' : 'glass-pill text-gold border-gold/30 hover:bg-gold/10 active:scale-95'
            }`}
          >
            <Flame size={14} className={isSpotlighted ? 'fill-current' : 'fill-none'} />
          </button>
        )}
        <HeatingConfirmationModal 
          isOpen={isHeatingModalOpen}
          onClose={() => setIsHeatingModalOpen(false)}
          onConfirm={() => spotlightTopic(topic.id)}
        />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className={`p-4 pb-4 bg-gradient-to-b ${
          topic.tone === 'blue' ? 'from-indigo-500/20' : 
          topic.tone === 'amber' ? 'from-amber-500/20' : 'from-emerald-500/20'
        } to-dark space-y-2 relative`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 100%)' }}></div>
          
          <div className="flex items-center justify-between z-10 relative">
             <div className="flex flex-col gap-0.5">
               <div className="flex items-center gap-3">
                 <h1 className="text-xl font-bold leading-tight text-white">{topic.title}</h1>
               </div>
               <div className="flex items-center gap-2">
                 <p className="text-white/40 text-[10px] line-clamp-1">{topic.description}</p>
               </div>
             </div>
          </div>
        </div>

        <section className="px-6 space-y-8 -mt-2 pb-32">
          {topic.status === 'completed' && (
            <div className="space-y-6 pt-2">
              <div className="relative group cursor-pointer overflow-hidden rounded-[40px] border border-white/5 bg-black shadow-2xl" onClick={() => showToast('即将开始播放完整共创作品...')}>
                <div className="grid grid-cols-2 gap-0.5">
                  {Array.from({ length: Math.min(topic.targetCount, 4) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-[3/4] bg-dark relative overflow-hidden group/item"
                    >
                      <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                        <Zap size={24} className="text-white/5 fill-white/5" />
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg border border-white/5">
                        <p className="text-[9px] font-black text-white/50 tracking-tighter uppercase">Scene {i+1}</p>
                      </div>
                      
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${topic.id + i}`} alt="" className="w-5 h-5 rounded-full border border-white/20 shadow-sm" />
                        <span className="text-[9px] font-bold text-white/60 tracking-wider">@{i % 2 === 0 ? 'Soul' : 'Echo'}</span>
                      </div>
                    </div>
                  ))}
                  {topic.targetCount > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <span className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-black text-white/90 tracking-widest uppercase shadow-xl">
                         +{topic.targetCount - 4} MORE
                       </span>
                    </div>
                  )}
                </div>
                
                {/* Large Central Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 rounded-full bg-gold/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-white/20 transform group-active:scale-95 transition-all">
                    <Zap size={28} className="text-dark fill-dark ml-0.5" />
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                   <p className="text-[9px] font-black text-gold tracking-widest uppercase">{topic.targetCount}位共创人集结</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/[0.03] p-5 rounded-[32px] border border-white/5 backdrop-blur-xl">
                 <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1.5 rounded-xl border border-white/5">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                     <p className="text-[11px] font-black text-white tracking-[0.1em] uppercase">作品已就绪</p>
                   </div>
                 </div>
                 <button 
                  onClick={() => setScreen('gift')} 
                  className="flex items-center gap-2 bg-white text-dark px-5 py-3 rounded-[20px] font-black text-[11px] uppercase shadow-xl active:scale-95 transition-all hover:bg-gold hover:text-dark"
                >
                  <Gift size={14} />
                  赏爆它
                </button>
              </div>
            </div>
          )}

          {topic.status === 'completed' && (
            <div 
              onClick={() => {
                setSelectedUserName(topic.creator);
                setScreen('user-profile');
              }}
              className="flex items-center p-4 bg-card bento-card border border-white/5 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.creator}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-bold leading-none text-white">{topic.creator}</p>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1.5">话题发起人 · {topic.city}</p>
              </div>
              <ChevronRight size={16} className="text-white/10" />
            </div>
          )}

          {topic.status !== 'completed' ? (
            <div className="space-y-4">
              <div className={`relative overflow-hidden rounded-[44px] border border-white/15 px-6 pt-6 pb-5 shadow-2xl min-h-[520px] flex flex-col justify-between bg-gradient-to-br ${
                topic.tone === 'blue' ? 'from-indigo-600 via-indigo-950' :
                topic.tone === 'amber' ? 'from-amber-600 via-amber-950' : 'from-emerald-600 via-emerald-950'
              } to-black`}>
                {topic.image && (
                  <img src={topic.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 blur-xl scale-110" />
                )}
                <div className="absolute inset-0 bg-black/35 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2 min-w-0">
                    <span className="rounded-full bg-white/12 border border-white/10 px-3 py-1.5 text-[10px] font-black text-white/80 tracking-widest">
                      {topic.city}
                    </span>
                    <span className="rounded-full bg-gold/15 border border-gold/20 px-3 py-1.5 text-[10px] font-black text-gold tracking-widest">
                      待成圈
                    </span>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-black/25 border border-white/10 px-3 py-2 text-right backdrop-blur-md">
                    <p className="text-[8px] font-black text-white/35 tracking-widest">剩余</p>
                    <p className="text-sm font-black text-red-primary mt-0.5">{topic.deadline}</p>
                  </div>
                </div>

                <div className="relative z-10 space-y-5">
                  <div className="space-y-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUserName(topic.creator);
                        setScreen('user-profile');
                      }}
                      className="flex items-center gap-2 w-fit rounded-full bg-white/10 border border-white/10 py-1.5 pl-1.5 pr-3 backdrop-blur-md active:scale-95 transition-transform"
                    >
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.creator}`} alt="" className="w-7 h-7 rounded-full bg-white/10" />
                      <span className="text-[10px] font-black text-white/70 tracking-widest">{topic.creator} 发起</span>
                    </button>

                    <div>
                      <p className="text-[10px] font-black text-white/45 tracking-widest uppercase mb-2">{topic.mode} · {topic.durationLimit || 15}s</p>
                      <h3 className="text-4xl font-black leading-[0.95] text-white tracking-tight">{topic.title}</h3>
                      <p className="text-sm text-white/70 leading-relaxed mt-4">{topic.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[28px] bg-white/10 border border-white/10 p-4 backdrop-blur-md">
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-white/45 tracking-widest uppercase">还差 {remainingCount} 人解锁</p>
                          <div className="mt-2 h-2 rounded-full bg-white/15 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              className="h-full rounded-full bg-gold"
                            />
                          </div>
                        </div>
                        <div className="shrink-0 flex items-baseline gap-1">
                          <span className="text-4xl font-black text-white leading-none">{topic.joinedCount}</span>
                          <span className="text-lg font-black text-white/35">/{topic.targetCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex -space-x-2 min-w-0">
                        {Array.from({ length: Math.min(topic.joinedCount, 5) }).map((_, i) => (
                          <button
                            key={`creator1-${topic.id}-${i}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUserName(`共创者 ${i + 1}`);
                              setScreen('user-profile');
                            }}
                            className="w-9 h-9 rounded-full border-2 border-black bg-white/10 overflow-hidden active:scale-90 transition-transform"
                          >
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.id + i}`} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                        {Array.from({ length: Math.min(remainingCount, 3) }).map((_, i) => (
                          <div key={`empty-${i}`} className="w-9 h-9 rounded-full border-2 border-black bg-white/10 flex items-center justify-center">
                            <Plus size={13} className="text-white/35" />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setIsCreatorsExpanded(prev => !prev)}
                        className="shrink-0 h-10 px-4 rounded-full bg-white/10 border border-white/10 text-[10px] font-black text-white/60 active:scale-95 transition-transform"
                      >
                        {isCreatorsExpanded ? '收起共创人' : '查看共创人'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isCreatorsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-[28px] bg-card border border-white/5 p-4 space-y-4 shadow-xl"
                  >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white tracking-wide">全部共创人</h3>
                    <p className="text-[10px] text-white/30 mt-1">满员后同步解锁所有人的素材。</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: visibleCreatorSlots }).map((_, i) => (
                    i < topic.joinedCount ? (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserName(`共创者 ${i + 1}`);
                          setScreen('user-profile');
                        }}
                        className="aspect-square rounded-[22px] bg-white/5 border border-white/10 overflow-hidden active:scale-90 transition-transform relative shadow-lg"
                      >
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.id + i}`} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 right-1 rounded-full bg-black/40 py-0.5 text-[7px] font-black text-white/60">已加入</span>
                      </button>
                    ) : (
                      <div key={i} className="aspect-square rounded-[22px] border border-dashed border-white/10 bg-white/[0.025] flex items-center justify-center">
                        <Plus size={16} className="text-white/12" />
                      </div>
                    )
                  ))}
                </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-black/5 rounded-[32px] p-6 space-y-6 border border-white/[0.03] shadow-xl">
              <div className="flex justify-between items-center px-1">
                  <h4 className="font-bold flex items-center gap-2 text-white text-sm">
                    <MessageCircle size={16} /> 话题评论 <span className="text-white/20 ml-1 text-xs">{topic.likes}+</span>
                  </h4>
              </div>
              <div className="space-y-4">
                  {[
                    { name: '南川', text: '这种拼在一起的日常很有生命力。', time: '12h' },
                    { name: 'Echo', text: '比普通 vlog 更像一群人的共同记忆。', time: '15h' }
                  ].map((cmt, i) => (
                    <div key={cmt.name} className="flex gap-3 group">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cmt.name}`} alt="" className="w-8 h-8 rounded-full bg-white/5 shrink-0 object-cover border border-white/5" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-tighter">{cmt.name}</p>
                            <span className="text-[8px] font-bold text-white/10 uppercase">{cmt.time} · IP：{['广东', '四川', '浙江', '江苏', '北京', '上海'][i % 6]}</span>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed italic border-l-2 border-white/5 pl-3 py-0.5">{cmt.text}</p>
                        </div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 flex gap-2">
                 <input 
                   className="flex-1 h-11 bg-white/5 border border-white/10 rounded-[20px] px-5 text-xs font-bold focus:border-white/30 outline-none transition-all placeholder:text-white/10" 
                   placeholder="留下你的共创注脚..."
                 />
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="p-6 pt-2 bg-dark/80 backdrop-blur-md border-t border-white/[0.03]">
        {topic.status !== 'completed' && (
          <p className="text-[10px] text-white/40 text-center font-medium mb-3">
             加入话题后，该话题的收益将由同圈创作者评分
          </p>
        )}
        <div className="flex gap-2">
          <button 
            onClick={() => toggleFavorite(topic.id)}
            className={`flex-1 h-14 rounded-[24px] font-black text-xs uppercase transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
              isFavorite ? 'bg-gold text-dark shadow-gold/20' : 'bg-white/5 text-white/40 border border-white/5'
            }`}
          >
            <Star size={16} className={isFavorite ? 'fill-current' : ''} />
            <span>{isFavorite ? '已收藏' : '收藏作品'}</span>
          </button>
          
          {topic.status !== 'completed' ? (
            <>
              <button 
                onClick={() => setScreen('join')}
                className={`flex-[1.5] h-14 bg-red-primary text-white font-black rounded-[24px] shadow-[0_10px_25px_-5px_rgba(255,36,66,0.5)] active:scale-95 transition-all text-xs uppercase flex items-center justify-center gap-2`}
              >
                拍下此刻
              </button>
              <button onClick={() => showToast('邀请链接已复制，去发给好友吧！')} className="flex-1 h-14 bg-white/5 text-white/40 font-black rounded-[24px] text-xs uppercase border border-white/5 active:scale-95 flex items-center justify-center">
                邀请
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setScreen('gift')}
                className="flex-[1.5] h-14 bg-gold text-dark font-black rounded-[24px] shadow-[0_10px_25px_-5px_rgba(214,178,126,0.5)] active:scale-95 transition-all text-xs uppercase flex items-center justify-center gap-2"
              >
                赠送作品
              </button>
              <button onClick={() => setIsShareDrawerOpen(true)} className="flex-[1] h-14 bg-white/5 text-white/40 font-black rounded-[24px] text-xs uppercase border border-white/5 active:scale-95 flex items-center justify-center">
                分享
              </button>
            </>
          )}
        </div>
      </footer>
      <VisibilitySelectorDrawer 
        isOpen={isVisibilityDrawerOpenForClips}
        onClose={() => setIsVisibilityDrawerOpenForClips(false)}
        visibility={clipVisibility}
        setVisibility={setClipVisibility}
        selectedFriendIds={selectedFriendIds}
        setSelectedFriendIds={setSelectedFriendIds}
      />
      {shareDrawer}
    </div>
  );
};

// --- Me (Profile) Screen ---

const NetworkListScreen = ({ 
  setScreen, 
  prevScreen, 
  initialTab,
  userName = "Wesley"
}: { 
  setScreen: (s: Screen) => void, 
  prevScreen: Screen,
  initialTab: 'friends' | 'followers' | 'following',
  userName?: string
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: '1', name: '林野', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop', bio: '记录生活的碎片', isFollowing: true, followsMe: true },
    { id: '2', name: 'Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop', bio: 'Stay curious.', isFollowing: true, followsMe: true },
    { id: '3', name: '周屿', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop', bio: '捕风者', isFollowing: false, followsMe: true },
    { id: '4', name: '张震', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop', bio: '光影记录家', isFollowing: true, followsMe: false },
    { id: '5', name: '苏苏', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop', bio: '正在努力共创中', isFollowing: true, followsMe: true },
    { id: '6', name: 'Echo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Echo', bio: '灵感捕捉机', isFollowing: false, followsMe: true },
  ];

  const filteredByTab = users.filter(u => {
    if (activeTab === 'friends') return u.isFollowing && u.followsMe;
    if (activeTab === 'following') return u.isFollowing;
    if (activeTab === 'followers') return u.followsMe;
    return true;
  });

  const filteredUsers = filteredByTab.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen(prevScreen)} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-4">
          {[
            { id: 'friends', label: '朋友' },
            { id: 'following', label: '关注' },
            { id: 'followers', label: '粉丝' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm font-bold relative pb-1 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-white/30'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="p-6">
          <div className="relative group mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="搜索用户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium outline-none focus:border-white/20 focus:bg-white/10 transition-all text-white"
            />
          </div>

          <div className="space-y-3">
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-[28px] active:bg-white/5 transition-all group"
                onClick={() => setScreen('user-profile')}
              >
                <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl border border-white/10 object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
                  <p className="text-[10px] text-white/30 mt-1 truncate tracking-wide">{user.bio}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    user.isFollowing ? 'bg-white/5 text-white/40 border border-white/5' : 'bg-white text-dark shadow-lg'
                  }`}
                >
                  {user.isFollowing && user.followsMe ? '互相关注' : user.isFollowing ? '已关注' : '关注'}
                </button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center space-y-4 opacity-50">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                  <UserIcon size={32} />
                </div>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">暂无相关成果</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const MeScreen = ({ setScreen, diamondBalance, energyBalance, likedCount, savedCount, worksCount, setInitialNetworkTab }: { 
  setScreen: (s: Screen) => void,
  diamondBalance: number,
  energyBalance: number,
  likedCount: number,
  savedCount: number,
  worksCount: number,
  setInitialNetworkTab: (t: 'friends' | 'followers' | 'following') => void
}) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => { setInitialNetworkTab('friends'); setScreen('network-list'); }} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5 shadow-sm">
          <Users size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">我的</h2>
        <button onClick={() => setScreen('settings')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5 shadow-sm active:scale-95 transition-transform">
          <Settings size={20} className="text-white" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        <section 
          onClick={() => setScreen('personal-profile')}
          className="text-center py-8 cursor-pointer group active:scale-95 transition-all"
        >
          <div className="relative inline-block">
             <div className="w-24 h-24 rounded-[32px] bg-white/5 border-4 border-white/5 shadow-xl flex items-center justify-center overflow-hidden group-hover:border-white/10 transition-all">
                <UserIcon size={40} className="text-white/10" />
             </div>
             <div className="absolute -bottom-2 -right-2 glass-pill px-2 py-1 flex items-center gap-1 rounded-full text-xs font-black text-gold shadow-lg border border-white/5">
                <Flame size={12} fill="currentColor" /> 7
             </div>
          </div>
          <h1 className="text-3xl font-bold mt-6 text-white">{CURRENT_USER.name}</h1>
          <p className="text-white/40 text-sm mt-1">@wesleyyy1</p>
          <p className="text-white/20 text-[10px] font-bold mt-1 uppercase">IP：广东</p>
          
          <div className="flex justify-center space-x-8 mt-8">
            <button onClick={(e) => { e.stopPropagation(); setInitialNetworkTab('friends'); setScreen('network-list'); }} className="text-center group">
              <p className="text-lg font-bold group-active:scale-95 transition-transform text-white">3</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">好友</p>
            </button>
            <div className="h-8 w-[1px] bg-white/5 self-center"></div>
            <button onClick={(e) => { e.stopPropagation(); setInitialNetworkTab('followers'); setScreen('network-list'); }} className="text-center group">
              <p className="text-lg font-bold group-active:scale-95 transition-transform text-white">5</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">粉丝</p>
            </button>
            <div className="h-8 w-[1px] bg-white/5 self-center"></div>
            <button onClick={(e) => { e.stopPropagation(); setInitialNetworkTab('following'); setScreen('network-list'); }} className="text-center group">
              <p className="text-lg font-bold group-active:scale-95 transition-transform text-white">4</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">关注</p>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div 
             onClick={() => setScreen('my-works')}
             className="bento-card p-6 bg-gradient-to-br from-white/10 via-card to-card border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10">
                <Camera size={23} />
              </div>
              <div>
                <h4 className="font-bold text-white">我的作品</h4>
                <p className="text-xs text-white/40">{12 + worksCount} 个共创记录</p>
              </div>
            </div>
            <ChevronRight className="text-white/30 relative z-10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
               onClick={() => setScreen('liked-topics')}
               className="bento-card p-5 bg-card border border-white/5 flex flex-col items-start gap-4 active:scale-[0.98] transition-all cursor-pointer shadow-lg text-left"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-white">我的喜欢</h4>
                <p className="text-xs text-white/40">{likedCount} 个喜欢的作品</p>
              </div>
            </button>

            <button 
               onClick={() => setScreen('saved-topics')}
               className="bento-card p-5 bg-card border border-white/5 flex flex-col items-start gap-4 active:scale-[0.98] transition-all cursor-pointer shadow-lg text-left"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-gold">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-white">我的收藏</h4>
                <p className="text-xs text-white/40">{savedCount} 个收藏的作品</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setScreen('recharge')} className="bento-card p-5 bg-card space-y-4 active:scale-95 transition-transform cursor-pointer shadow-md border border-white/5">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <Gift size={20} />
              </div>
              <div>
                 <p className="text-xl font-bold text-white">{diamondBalance}</p>
                 <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">钻石余额</p>
              </div>
            </div>
            <div onClick={() => setScreen('energy-detail')} className="bento-card p-5 bg-card space-y-4 active:scale-95 transition-transform cursor-pointer shadow-md border border-white/5">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                 <p className="text-xl font-bold text-white">{energyBalance}</p>
                 <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">获得点赞</p>
              </div>
            </div>
          </div>

          <div 
             onClick={() => setScreen('shop')}
             className="bento-card p-6 bg-card border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-gold/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10 min-w-0">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/10 shrink-0">
                <Star size={22} fill="currentColor" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white">DR商城</h4>
                <p className="text-xs text-white/40 truncate">{energyBalance.toLocaleString()} 积分可兑换权益</p>
              </div>
            </div>
            <ChevronRight className="text-gold/60 relative z-10 shrink-0" />
          </div>

          <div 
             onClick={() => setScreen('smart-ring')}
             className="bento-card bg-gradient-to-br from-gold/10 via-card to-card p-6 border border-gold/10 hover:border-gold/30 transition-all cursor-pointer shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="flex justify-between items-start z-10 relative">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">DR Ring Pro 已连接</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">86</span>
                  <span className="text-sm font-medium text-white/40 font-black tracking-widest uppercase">分</span>
                </div>
                <p className="text-xs text-white/50 italic">心率稳定，今日状态极佳。</p>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wesley" alt="" className="w-16 h-16 rounded-full border-4 border-gold shadow-[0_0_20px_rgba(214,178,126,0.1)] object-cover" />
            </div>
          </div>


        </section>
      </main>
    </div>
  );
};

// --- Messages Screen ---

const MessagesScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 space-y-2 sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">消息</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
         <div className="divide-y divide-white/[0.03]">
            {[
              { name: '林野', msg: '我刚拍了一段 3 秒片段...', time: '09:41', unread: 2 },
              { name: 'Mia', msg: '谢谢你给早餐桌送的礼物...', time: '昨天', unread: 0 },
              { name: '系统通知', msg: '《下班后的三十分钟》已完成...', time: '周一', unread: 0 },
            ].map((convo) => (
              <div 
                key={convo.name}
                onClick={() => setScreen('dm')}
                className="flex items-center px-6 py-4 active:bg-white/[0.02] transition-colors cursor-pointer relative"
              >
                 <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${convo.name}`} alt="" className="w-14 h-14 rounded-2xl bg-soft border border-white/5 object-cover" />
                    {convo.unread > 0 && (
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center shadow-lg border-[2px] border-dark">
                          <span className="text-[10px] font-black text-white">{convo.unread}</span>
                       </div>
                    )}
                 </div>
                 <div className="ml-4 flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[17px] font-bold text-white">{convo.name}</h4>
                       <span className="text-[11px] text-white/20">{convo.time}</span>
                    </div>
                    <p className="text-sm text-white/40 truncate mt-0.5">{convo.msg}</p>
                 </div>
              </div>
            ))}
         </div>
      </main>
    </div>
  );
};

// --- Friends Screen ---

const FriendsScreen = ({ setScreen, setSelectedUserName, initialTab = 'friends' }: { setScreen: (s: Screen) => void, setSelectedUserName: (name: string) => void, initialTab?: 'friends' | 'followers' | 'following' }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'followers' | 'following'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: '1', name: '林野', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop', bio: '记录生活的碎片', isFollowing: true, followsMe: true },
    { id: '2', name: 'Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop', bio: 'Stay curious.', isFollowing: true, followsMe: true },
    { id: '3', name: '周屿', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop', bio: '捕风者', isFollowing: false, followsMe: true },
    { id: '4', name: '张震', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop', bio: '光影记录家', isFollowing: true, followsMe: false },
    { id: '5', name: '苏苏', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop', bio: '正在努力共创中', isFollowing: true, followsMe: true },
    { id: '6', name: 'Echo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Echo', bio: '灵感捕捉机', isFollowing: false, followsMe: true },
  ];

  const filteredByTab = users.filter(u => {
    if (activeTab === 'friends') return u.isFollowing && u.followsMe;
    if (activeTab === 'following') return u.isFollowing;
    if (activeTab === 'followers') return u.followsMe;
    return true;
  });

  const filteredUsers = filteredByTab.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderUserList = (userList: typeof users) => (
    <div className="divide-y divide-white/[0.03]">
      {userList.map(user => (
        <div 
          key={user.id}
          onClick={() => {
              setSelectedUserName(user.name);
              setScreen('user-profile');
          }}
          className="flex items-center px-6 py-4 active:bg-white/[0.02] transition-all cursor-pointer"
        >
          <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl bg-white/10 border border-white/5 object-cover" />
          <div className="ml-4 flex-1">
              <p className="text-[17px] font-bold text-white">{user.name}</p>
              <p className="text-xs text-white/30 truncate mt-0.5">{user.bio}</p>
          </div>
          <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUserName(user.name);
                setScreen('dm');
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase border border-white/5 rounded-xl transition-all"
          >
            私信
          </button>
        </div>
      ))}
      {userList.length === 0 && (
        <div className="py-20 text-center opacity-40">
          <p className="text-xs font-black uppercase tracking-widest">暂无相关人员</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'friends') {
      return (
        <>
          <div className="px-6 mb-6">
            <div className="p-6 bg-gradient-to-br from-green-500/20 to-dark bento-card border border-green-500/10 space-y-3">
              <p className="text-xs font-black uppercase text-green-400 tracking-widest">好友定义</p>
              <h3 className="text-xl font-bold leading-tight">互相关注的人，就是好友。</h3>
              <p className="text-white/40 text-xs leading-relaxed">好友可直接发起私信，也可以在共创召集中作为第一顺位被邀请。</p>
            </div>
          </div>
          {renderUserList(filteredUsers)}
        </>
      );
    }
    return renderUserList(filteredUsers);
  };


  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('friends')}
            className={`font-bold transition-colors ${activeTab === 'friends' ? 'text-white' : 'text-white/40'}`}
          >
            好友
          </button>
          <button 
            onClick={() => setActiveTab('following')}
            className={`font-bold transition-colors ${activeTab === 'following' ? 'text-white' : 'text-white/40'}`}
          >
            关注
          </button>
          <button 
            onClick={() => setActiveTab('followers')}
            className={`font-bold transition-colors ${activeTab === 'followers' ? 'text-white' : 'text-white/40'}`}
          >
            粉丝
          </button>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-12">
        {renderContent()}
      </main>
    </div>
  );
};

// --- Settings Screen ---

const SettingsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8 overflow-y-auto no-scrollbar pb-10">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white">系统设置</h2>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 px-6 space-y-4">
        { [
          { icon: UserIcon, label: '账号资料', desc: '昵称、头像、简介', screen: 'account-profile' },
          { icon: ShieldCheck, label: '隐私政策', desc: '关注、作品、私信权限', screen: 'privacy-policy' },
          { icon: Bell, label: '通知设置', desc: '成圈、关注、评论提醒', screen: 'notification-settings' },
          { icon: MessageSquare, label: '用户反馈', desc: '在使用中遇到问题或建议', screen: 'feedback' },
        ].map(item => (
          <div 
            key={item.label} 
            onClick={() => setScreen(item.screen as any)}
            className="p-4 bg-card bento-card border border-white/5 flex items-center gap-4 active:bg-white/5 transition-colors cursor-pointer"
          >
             <div className="w-10 h-10 glass-pill rounded-xl flex items-center justify-center text-white/60">
                <item.icon size={20} />
             </div>
             <div className="flex-1">
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">{item.desc}</p>
             </div>
             <ChevronRight size={16} className="text-white/10" />
          </div>
        ))}

        <div className="pt-8">
           <button onClick={() => setScreen('login')} className="w-full h-14 glass-pill rounded-2xl text-rose-400 font-bold text-sm active:scale-95 transition-transform uppercase tracking-widest border border-rose-500/10">
              退出当前账号
           </button>
        </div>
      </main>
    </div>
  );
};

const AccountProfileScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('settings')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5 shadow-sm active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">帐号资料</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center border-4 border-white/5 relative">
            <UserIcon size={40} className="text-white/40" />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-dark active:scale-95 transition-transform border-white/10 shadow-lg">
              <Camera size={14} className="text-white" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">昵称</label>
            <div className="w-full px-4 py-4 rounded-3xl bg-white/5 border border-white/10 text-white font-bold flex justify-between items-center">
              <span>{CURRENT_USER.name}</span>
              <ChevronRight size={16} className="text-white/20" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">简介</label>
            <div className="w-full px-4 py-4 rounded-3xl bg-white/5 border border-white/10 text-white font-bold flex justify-between items-center">
              <span className="text-white/60 text-sm truncate">添加简介，让大家更好认识你</span>
              <ChevronRight size={16} className="text-white/20" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">性别</label>
            <div className="w-full px-4 py-4 rounded-3xl bg-white/5 border border-white/10 text-white font-bold flex justify-between items-center">
              <span className="text-white/60 text-sm">不公开</span>
              <ChevronRight size={16} className="text-white/20" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const PrivacyPolicyScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('settings')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5 shadow-sm active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">隐私政策</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-6 text-white/80 text-sm leading-relaxed">
        <h3 className="text-xl font-bold text-white">Dream Record 隐私保护指引</h3>
        <p>本指引旨在帮助你了解我们如何收集、使用、存储及分享你的个人信息，以及你如何管理这些信息。</p>
        
        <h4 className="font-bold text-white text-base">1. 我们收集的信息</h4>
        <p>当你使用本应用时，为了提供基本服务，我们可能会收集你的设备信息、网络信息、使用日志等数据。</p>
        
        <h4 className="font-bold text-white text-base">2. 信息的存储</h4>
        <p>我们承诺将你的信息存储在安全可靠的环境中，采用加密等技术措施保护数据安全。</p>
        
        <h4 className="font-bold text-white text-base">3. 信息的使用</h4>
        <p>收集的信息将专门用于持续优化产品体验、为你推荐个性化内容等，绝不出售给任何第三方。</p>
        
        <h4 className="font-bold text-white text-base">4. 你的权利</h4>
        <p>你有权随时查询、更正或要求删除你的个人信息，也可以在账号设置中管理各类隐私权限选项。</p>
      </main>
    </div>
  );
};

const NotificationSettingsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('settings')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5 shadow-sm active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">通知设置</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/10">
            <div>
              <p className="text-base font-bold text-white mb-0.5">消息通知</p>
              <p className="text-[10px] text-white/40">接收私信、群聊等即时消息</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-indigo-600 flex items-center px-1">
              <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/10">
            <div>
              <p className="text-base font-bold text-white mb-0.5">互动通知</p>
              <p className="text-[10px] text-white/40">有点赞、评论、关注时提醒我</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-white/20 flex items-center px-1">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/10">
            <div>
              <p className="text-base font-bold text-white mb-0.5">系统公告</p>
              <p className="text-[10px] text-white/40">接收应用更新与重要活动通知</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-indigo-600 flex items-center px-1">
              <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Saved Topics Screen ---

const TopicCollectionScreen = ({ setScreen, topicsList, setSelectedTopic, topicIds, title, emptyText, emptyIcon }: { 
  setScreen: (s: Screen) => void, 
  topicsList: Topic[],
  setSelectedTopic: (t: Topic) => void,
  topicIds: Set<string>,
  title: string,
  emptyText: string,
  emptyIcon: React.ReactNode
}) => {
  const topics = topicsList.filter(t => topicIds.has(t.id));

  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white">{title}</h2>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-6">
        {topics.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                {emptyIcon}
             </div>
             <p className="text-white/20 font-black uppercase text-xs tracking-widest">{emptyText}</p>
          </div>
        ) : (
          <div className="columns-2 gap-4 space-y-4">
             {topics.map((topic, i) => (
                <motion.div 
                  key={`${topic.id}-${i}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setScreen('topic-detail');
                  }}
                  className="break-inside-avoid bento-card p-4 space-y-3 bg-card shadow-lg cursor-pointer"
                >
                   <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-br from-indigo-500/10 to-dark relative overflow-hidden ${
                     topic.tone === 'amber' ? 'from-amber-500/20' : 
                     topic.tone === 'green' ? 'from-green-500/20' : 'from-blue-500/20'
                   }`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Users size={48} className="text-white" />
                      </div>
                      {topic.status === 'completed' ? (
                        <div className="absolute top-2 right-2 bg-green-500/10 px-2 py-0.5 rounded text-[8px] font-black uppercase text-green-600">
                          {topic.joinedCount}人共创
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 bg-gold/10 px-2 py-0.5 rounded text-[8px] font-black uppercase text-gold">
                          待成圈
                        </div>
                      )}
                   </div>
                   <div className="space-y-1">
                     <h4 className="text-sm font-bold line-clamp-2 leading-tight text-white">{topic.title}</h4>
                     {topic.status !== 'completed' && (
                       <p className="text-[9px] font-black text-gold/80 uppercase tracking-tight">
                         还需 {topic.targetCount - topic.joinedCount} 人成圈
                       </p>
                     )}
                     <div className="flex items-center justify-between pt-1">
                         <div 
                           className="flex items-center gap-1 cursor-pointer"
                           onClick={(e) => {
                              e.stopPropagation();
                           }}
                         >
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.creator}`} alt="" className="w-4 h-4 rounded-full bg-soft object-cover" />
                            <span className="text-[10px] text-white/40">@{topic.creator}</span>
                         </div>
                        {topic.status === 'completed' ? (
                          <div className="flex items-center gap-1 text-[10px] text-white/60">
                            <Heart size={10} className="fill-gold stroke-none" /> {topic.likes}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-gold font-black italic">
                            <Users size={10} className="fill-gold stroke-none" /> {topic.joinedCount}/{topic.targetCount}
                          </div>
                        )}
                     </div>
                   </div>
                </motion.div>
             ))}
          </div>
        )}
      </main>

      <footer className="p-6 pt-0 bg-dark/80 backdrop-blur-md border-t border-white/[0.03]">
         <button onClick={() => setScreen('home')} className="w-full h-14 bg-white text-dark rounded-[24px] font-black uppercase text-xs shadow-2xl active:scale-95 transition-transform flex items-center justify-center">
            去发现更多
         </button>
      </footer>
    </div>
  );
};

const LikedTopicsScreen = ({ setScreen, topics, likedTopicIds, setSelectedTopic }: { 
  setScreen: (s: Screen) => void, 
  topics: Topic[],
  likedTopicIds: Set<string>,
  setSelectedTopic: (t: Topic) => void
}) => (
  <TopicCollectionScreen
    setScreen={setScreen}
    topicsList={topics}
    setSelectedTopic={setSelectedTopic}
    topicIds={likedTopicIds}
    title="我的喜欢"
    emptyText="还没有喜欢过任何作品哦"
    emptyIcon={<Heart size={32} />}
  />
);

const SavedTopicsScreen = ({ setScreen, topics, savedTopicIds, setSelectedTopic }: { 
  setScreen: (s: Screen) => void, 
  topics: Topic[],
  savedTopicIds: Set<string>,
  setSelectedTopic: (t: Topic) => void
}) => (
  <TopicCollectionScreen
    setScreen={setScreen}
    topicsList={topics}
    setSelectedTopic={setSelectedTopic}
    topicIds={savedTopicIds}
    title="我的收藏"
    emptyText="还没有收藏过任何作品哦"
    emptyIcon={<Bookmark size={32} />}
  />
);

// --- My Works Screen ---

const MyWorksScreen = ({ setScreen, topics, setSelectedTopic, userVlogs, setCircleIsMyWorkMode, setCircleInitialTopicId }: {
  setScreen: (s: Screen) => void,
  topics: Topic[],
  setSelectedTopic: (t: Topic) => void,
  userVlogs: UserVlog[],
  setCircleIsMyWorkMode: (b: boolean) => void,
  setCircleInitialTopicId: (id: string | undefined) => void
}) => {
  const [filter, setFilter] = useState('全部');
  const [isVisibilityDrawerOpen, setIsVisibilityDrawerOpen] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workVisibilities, setWorkVisibilities] = useState<Record<string, Visibility>>({});
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());

  const filterOptions = ['全部', '发起', '参与', '已成圈', '待成圈'];

  const staticWorks = [
    { id: 'sw-1', type: '发起', status: '已成圈', title: '今天的城市声音', likes: '8.2k' },
    { id: 'sw-2', type: '参与', status: '已成圈', title: '今天真实的早餐桌', likes: '12.8k' },
    { id: 'sw-3', type: '参与', status: '待成圈', title: '下班后的三十分钟', likes: '5.4k' },
    { id: 'sw-4', type: '发起', status: '待成圈', title: '深夜的一盏灯', likes: '2.9k' },
    { id: 'sw-5', type: '参与', status: '已成圈', title: '早高峰的地铁窗', likes: '3.6k' },
    { id: 'sw-6', type: '发起', status: '已成圈', title: '周末的桌面', likes: '4.1k' },
  ];

  const allWorks = [...userVlogs, ...staticWorks];

  const filteredWorks = allWorks.filter((work) => {
    if (filter === '全部') return true;
    if (filter === '发起') return work.type === '发起';
    if (filter === '参与') return work.type === '参与';
    if (filter === '已成圈') return work.status === '已成圈';
    if (filter === '待成圈') return work.status === '待成圈';
    return true;
  });

  const getVisibility = (id: string) => workVisibilities[id] || 'public';

  const handleSetVisibility = (v: Visibility) => {
    if (editingWorkId) {
      setWorkVisibilities(prev => ({ ...prev, [editingWorkId]: v }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark">
      <header className="p-6 flex items-center justify-between z-20 sticky top-0 bg-dark/80 backdrop-blur-xl border-b border-white/[0.03]">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-white">我的作品</h2>
        <button onClick={() => setScreen('saved-topics')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center text-white/40">
          <Star size={18} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <section className="px-6 py-6">
          <div className="p-6 bg-gradient-to-br from-gold/10 via-card to-card rounded-[32px] border border-gold/10 shadow-xl">
            <p className="text-[10px] font-black text-gold tracking-widest uppercase">共创记录</p>
            <div className="flex items-end gap-2 mt-3">
              <h1 className="text-5xl font-bold text-white">{allWorks.length}</h1>
              <span className="text-xs text-white/40 font-black uppercase tracking-widest mb-1">个作品</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mt-3">在这里你可以随时调整共创作品的可见范围。</p>
          </div>
        </section>

        <section className="px-6 space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filterOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  filter === opt ? 'bg-white text-dark shadow-lg' : 'bg-white/5 text-white/40 border border-white/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
              {filteredWorks.map((work, i) => {
                const topic = topics.find(t => t.id === (work as any).topicId) || topics[i % topics.length];
                const visibility = getVisibility(work.id);
                
                return (
                  <motion.div
                    key={work.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedTopic(topic);
                      if (work.status === '已成圈') {
                        setCircleIsMyWorkMode(true);
                        setCircleInitialTopicId(topic.id);
                        setScreen('circle');
                      } else {
                        setScreen('topic-detail');
                      }
                    }}
                    className="aspect-[4/3] bg-card bento-card border border-white/5 relative overflow-hidden group cursor-pointer"
                  >
                  <div className="absolute inset-0 bg-white/5 flex items-center justify-center opacity-40">
                    <p className="text-2xl font-bold text-white/5">#{work.id}</p>
                  </div>

                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setEditingWorkId(work.id);
                         setIsVisibilityDrawerOpen(true);
                       }}
                       className="w-7 h-7 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/60 active:scale-90 transition-all hover:bg-black/60 hover:text-white"
                     >
                       {visibility === 'public' && <Globe size={14} />}
                       {visibility === 'friends' && <Users2 size={14} />}
                       {visibility === 'private' && <Lock size={14} />}
                       {visibility === 'selected' && <UserIcon size={14} />}
                     </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-3">
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-wider">话题 #{work.id + 102}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${work.status === '已成圈' ? 'bg-green-400' : 'bg-gold'}`}></span>
                        <span className="text-[8px] font-black uppercase text-white/60 tracking-wider">{work.status}</span>
                      </div>
                      <p className="text-[10px] font-bold text-white/70">{work.likes}</p>
                    </div>
                    <p className="text-[10px] text-white/50 font-black mt-1 truncate">{work.title}</p>
                  </div>
                </motion.div>
              );
            })}
            {filteredWorks.length === 0 && (
              <div className="col-span-2 py-20 text-center">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">暂无相关作品</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <VisibilitySelectorDrawer 
        isOpen={isVisibilityDrawerOpen}
        onClose={() => setIsVisibilityDrawerOpen(false)}
        visibility={editingWorkId ? getVisibility(editingWorkId) : 'public'}
        setVisibility={handleSetVisibility}
        selectedFriendIds={selectedFriendIds}
        setSelectedFriendIds={setSelectedFriendIds}
      />
    </div>
  );
};

// --- Create Circle Screen ---

const CreateCircleScreen = ({ setScreen, setSelectedTopic, initialTopicInfo }: { setScreen: (s: Screen) => void, setSelectedTopic: (t: Topic) => void, initialTopicInfo?: Partial<Topic> }) => {
  const [participants, setParticipants] = useState(initialTopicInfo?.targetCount || 8);
  const [duration, setDuration] = useState(initialTopicInfo?.durationLimit || 5);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private' | 'selected'>('public');
  const [showSelector, setShowSelector] = useState(false);
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  const [topicTitle, setTopicTitle] = useState(initialTopicInfo?.title || '');
  const [topicDescription, setTopicDescription] = useState(initialTopicInfo?.description || '');

  const friends = [
    { id: '1', name: '林野', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop' },
    { id: '2', name: 'Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop' },
    { id: '3', name: '周屿', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop' },
    { id: '4', name: '张震', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop' },
    { id: '5', name: '苏苏', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop' },
  ];

  const toggleFriend = (id: string) => {
    const next = new Set(selectedFriendIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedFriendIds(next);
  };

  const selectedFriendNames = friends
    .filter(f => selectedFriendIds.has(f.id))
    .map(f => f.name)
    .join('、');

  return (
    <div className="flex flex-col h-full bg-dark pt-8 relative overflow-hidden">
      <header className="p-6 flex items-center justify-between z-20 sticky top-0 bg-dark/80 backdrop-blur-xl border-b border-white/[0.03]">
        <button onClick={() => setScreen('home')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white">发起共创</h2>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-10">
        <div className="space-y-4">
          <input 
            className="w-full h-14 bg-soft rounded-2xl px-5 font-bold outline-none border border-white/5 focus:border-white/20 text-white" 
            placeholder="你需要大家做什么" 
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-soft rounded-2xl p-5 font-medium outline-none border border-white/5 focus:border-white/20 text-white text-sm min-h-[120px] resize-none"
            placeholder="添加话题描述，让更多人加入共创..."
            value={topicDescription}
            onChange={(e) => setTopicDescription(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">参与人数（2-12）</label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
              <button 
                key={num} 
                onClick={() => setParticipants(num)}
                className={`h-12 rounded-2xl font-black text-xs transition-all ${participants === num ? 'bg-gold text-dark shadow-lg shadow-gold/20' : 'bg-white/5 text-white/40 border border-white/5'}`}
              >
                {num} 人
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">作品时间限制 (3-10秒)</label>
          <div className="flex items-center gap-4 bg-soft p-4 rounded-2xl border border-white/5">
             <span className="text-sm font-bold text-white w-8">{duration}s</span>
             <input 
               type="range" 
               min="3" 
               max="10" 
               value={duration} 
               onChange={(e) => setDuration(parseInt(e.target.value))}
               className="flex-1 accent-gold h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
             />
             <div className="flex gap-1">
                {[3, 5, 8, 10].map(v => (
                  <button 
                    key={v}
                    onClick={() => setDuration(v)}
                    className={`px-2 py-1 rounded-lg text-[8px] font-black tracking-tighter ${duration === v ? 'bg-gold text-dark' : 'bg-white/5 text-white/40'}`}
                  >
                    {v}S
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">可见范围</label>
          <div 
            onClick={() => setShowSelector(true)}
            className="p-6 rounded-[32px] border border-white/5 bg-white/5 flex items-center justify-between active:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-active:text-gold transition-colors">
                {visibility === 'public' && <Globe size={20} />}
                {visibility === 'friends' && <Users2 size={20} />}
                {visibility === 'private' && <Lock size={20} />}
                {visibility === 'selected' && <UserIcon size={20} />}
              </div>
              <div>
                <p className="text-sm font-black text-white tracking-wide">谁可以看</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest">
                    {visibility === 'public' && '公开'}
                    {visibility === 'friends' && '朋友'}
                    {visibility === 'private' && '私密'}
                    {visibility === 'selected' && '部分可见'}
                  </p>
                  {visibility === 'selected' && selectedFriendIds.size > 0 && (
                    <span className="text-[9px] text-white/20 font-medium">({selectedFriendNames.length > 15 ? selectedFriendNames.slice(0, 15) + '...' : selectedFriendNames})</span>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20" />
          </div>
        </div>

      </main>

      <footer className="p-6 pb-10 bg-dark/80 backdrop-blur-md border-t border-white/[0.03]">
        <p className="text-[10px] text-white/40 text-center font-medium mb-4">
            创建话题后，该话题产生的收益，将由所有同圈的创作者平分。
        </p>
        <button 
          onClick={() => {
            // Mock a "created" topic
            const newTopic: Topic = {
              id: 'new-' + Date.now(),
              title: topicTitle || '未命名共创',
              description: '由你发起的新共创话题。',
              prompt: '捕捉你眼前的时刻',
              city: '上海',
              creator: CURRENT_USER.name,
              joinedCount: 1,
              targetCount: participants,
              deadline: '23h 59m',
              status: 'forming',
              tone: 'amber',
              mode: 'Video',
              likes: '0',
            };
            setSelectedTopic(newTopic);
            setScreen('topic-detail');
          }} 
          className="w-full h-14 bg-white text-dark rounded-full font-black uppercase text-xs shadow-2xl active:scale-95 transition-transform flex items-center justify-center"
        >
          发起召集
        </button>
      </footer>

      <VisibilitySelectorDrawer 
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        visibility={visibility}
        setVisibility={setVisibility}
        selectedFriendIds={selectedFriendIds}
        setSelectedFriendIds={setSelectedFriendIds}
      />
    </div>
  );
};

const CreateSuccessScreen = ({ setScreen, showToast }: { setScreen: (s: Screen) => void, showToast: (m: string) => void }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-dark items-center justify-center p-10 text-center space-y-8">
      <div className="relative">
         <div className="w-32 h-32 bg-emerald-500 rounded-[40px] flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.2)]">
            <Check size={64} className="text-white" strokeWidth={3} />
         </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-bold">主题已发布!</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-[240px]">你的共创邀请已同步至好友动态。快去拍摄你的第一帧吧。</p>
      </div>
      <div className="w-full space-y-3">
        <button onClick={() => setScreen('topic-detail')} className="w-full h-14 bg-white text-dark rounded-full font-black uppercase text-xs shadow-2xl active:scale-95 transition-transform">
          完成并返回
        </button>
        <button onClick={() => setIsInviteModalOpen(true)} className="w-full h-14 bg-white/10 backdrop-blur-xl rounded-full font-black uppercase text-xs active:scale-95 transition-transform border border-white/10 text-white/60">
          邀请好友加速成圈
        </button>
      </div>

      <AnimatePresence>
        <FriendSelectionModal 
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          remainingCount={10}
          onInvite={(friends) => {
            showToast(`已向 ${friends.length} 位好友发送邀请`);
            setIsInviteModalOpen(false);
          }}
        />
      </AnimatePresence>
    </div>
  );
};

const CreateAndShootScreen = ({ setScreen, showToast }: { setScreen: (s: Screen) => void, showToast: (m: string) => void }) => {
  return (
    <div className="flex flex-col h-full bg-black relative">
       {/* Viewfinder/Result Background */}
       <div className="absolute inset-0 transition-colors duration-700 bg-[#111]">
          <div className="w-full h-full flex flex-col items-center justify-center">
             <Camera size={64} className="text-white/5" />
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-[85%] aspect-[3/4.5] border border-white/5 rounded-[48px] relative">
                   <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-white/5"></div>
                   <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-white/5"></div>
                </div>
             </div>
          </div>
       </div>

       {/* Overlays */}
       <div className="absolute inset-x-0 top-0 p-6 pt-12 flex items-center justify-between z-30">
          <button 
            onClick={() => setScreen('topic-detail')} 
            className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
             <p className="text-[10px] font-black uppercase text-green-400 tracking-widest leading-none mb-1">
               最后一步
             </p>
             <h3 className="text-sm font-bold truncate max-w-[180px] text-white">
               正在捕捉
             </h3>
          </div>
          <div className="w-10"></div>
       </div>

       <div className="absolute inset-x-0 bottom-0 p-8 pb-12 z-30 flex flex-col gap-6">
          <div className="flex items-center justify-between px-4">
             <button onClick={() => showToast('美颜模式已开启')} className="w-12 h-12 glass-pill rounded-full flex items-center justify-center text-white active:scale-95 transition-transform backdrop-blur-md">
                <Sparkles size={22} />
             </button>
             <button 
               onClick={() => setScreen('video-edit')}
               className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
             >
                <div className="w-14 h-14 bg-white rounded-full"></div>
             </button>
             <button className="w-12 h-12 glass-pill rounded-full flex items-center justify-center text-white active:scale-95 transition-transform backdrop-blur-md">
                <RotateCw size={22} />
             </button>
          </div>
          <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
            按下快门定格瞬间
          </p>
       </div>
    </div>
  );
};

const JoinScreen = ({ topic, setScreen, showToast }: { topic: Topic, setScreen: (s: Screen) => void, showToast: (m: string) => void }) => {
  return (
    <div className="flex flex-col h-full bg-black relative">
       {/* Viewfinder/Result Background */}
       <div className="absolute inset-0 transition-colors duration-700 bg-[#111]">
          <div className="w-full h-full flex flex-col items-center justify-center">
             <Camera size={64} className="text-white/5" />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-[85%] aspect-[3/4.5] border border-white/5 rounded-[48px] relative">
                   <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-white/5"></div>
                   <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-white/5"></div>
                </div>
             </div>
          </div>
       </div>

       {/* Overlays */}
       <div className="absolute inset-x-0 top-0 p-6 pt-12 flex items-center justify-between z-30">
          <button 
            onClick={() => setScreen('topic-detail')} 
            className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
             <p className="text-[10px] font-black uppercase text-gold tracking-widest leading-none mb-1">
               共创中
             </p>
             <h3 className="text-sm font-bold truncate max-w-[180px] text-white">
               {topic.title}
             </h3>
          </div>
          <div className="w-10"></div>
       </div>

       <div className="absolute inset-x-0 bottom-0 p-8 pb-12 z-30 flex flex-col gap-6">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="glass-pill px-5 py-2 backdrop-blur-xl bg-black/20 border border-white/5">
                 <p className="text-xs font-bold text-white/90">正在执行: {topic.prompt}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-4">
               <button onClick={() => showToast('美颜模式已开启')} className="w-12 h-12 glass-pill rounded-full flex items-center justify-center text-white">
                  <Sparkles size={22} />
               </button>
               <button 
                 onClick={() => setScreen('video-edit')}
                 className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
               >
                  <div className="w-14 h-14 bg-white rounded-full"></div>
               </button>
               <button onClick={() => showToast('已切换至前置摄像头')} className="w-12 h-12 glass-pill rounded-full flex items-center justify-center text-white">
                  <RotateCw size={22} />
               </button>
            </div>
          </div>
       </div>
    </div>
  );
};

const JoinSuccessScreen = ({ setScreen, showToast }: { setScreen: (s: Screen) => void, showToast: (m: string) => void }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isVisibilityDrawerOpen, setIsVisibilityDrawerOpen] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col h-full bg-dark p-10 pt-16">
      <div className="flex-1 flex flex-col items-center justify-center space-y-10">
        <div className="relative">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.2)]"
           >
             <ShieldCheck size={64} className="text-white" strokeWidth={2.5} />
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-pill px-4 py-1.5 rounded-full text-[10px] font-black text-gold tracking-widest uppercase whitespace-nowrap shadow-xl"
           >
             已获得真实标记
           </motion.div>
        </div>

        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-bold">拍摄完成!</h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-[240px] mx-auto">
            你已成功贡献了一份回忆。当共创组达成目标后，完整的合集将同步推送到你的广场。
          </p>
        </div>

        <div 
          onClick={() => setIsVisibilityDrawerOpen(true)}
          className="w-full max-w-[280px] p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between active:bg-white/10 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-active:text-gold transition-colors">
              {visibility === 'public' && <Globe size={18} />}
              {visibility === 'friends' && <Users2 size={18} />}
              {visibility === 'private' && <Lock size={18} />}
              {visibility === 'selected' && <UserIcon size={18} />}
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">谁可以看</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {visibility === 'public' && '公开'}
                {visibility === 'friends' && '朋友'}
                {visibility === 'private' && '私密'}
                {visibility === 'selected' && `选中的朋友 (${selectedFriendIds.size})`}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-white/20" />
        </div>
      </div>

      <div className="w-full space-y-3 pb-6 shrink-0 mt-6">
        <button onClick={() => setScreen('topic-detail')} className="w-full h-14 bg-white text-dark rounded-full font-black uppercase text-xs shadow-2xl active:scale-95 transition-transform">
          完成并返回
        </button>
        <button onClick={() => setIsInviteModalOpen(true)} className="w-full h-14 bg-white/10 backdrop-blur-xl rounded-full font-black uppercase text-xs active:scale-95 transition-transform border border-white/10 text-white/60">
          邀请好友助力
        </button>
      </div>

      <AnimatePresence>
        <FriendSelectionModal 
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          remainingCount={10}
          onInvite={(friends) => {
            showToast(`已向 ${friends.length} 位好友发送邀请`);
            setIsInviteModalOpen(false);
          }}
        />
      </AnimatePresence>

      <VisibilitySelectorDrawer 
        isOpen={isVisibilityDrawerOpen}
        onClose={() => setIsVisibilityDrawerOpen(false)}
        visibility={visibility}
        setVisibility={setVisibility}
        selectedFriendIds={selectedFriendIds}
        setSelectedFriendIds={setSelectedFriendIds}
      />
    </div>
  );
};

// --- Circle (Discover) Screen ---

const CircleScreen = ({ 
  setScreen, 
  topics, 
  setSelectedTopic, 
  setSelectedUserName, 
  savedTopicIds, 
  toggleFavorite, 
  likedTopicIds, 
  toggleLike, 
  spotlightTopicIds, 
  spotlightTopic, 
  showToast, 
  diamondBalance,
  initialTopicId,
  isMyWorkMode,
  setCircleIsMyWorkMode,
  setCircleInitialTopicId,
  setCircleInitialTopicInfo,
  isGiftDonorDetailModalOpen,
  setIsGiftDonorDetailModalOpen
}: { 
  setScreen: (s: Screen) => void, 
  topics: Topic[],
  setSelectedTopic: (t: Topic) => void,
  setSelectedUserName: (name: string) => void,
  savedTopicIds: Set<string>,
  toggleFavorite: (id: string) => void,
  likedTopicIds: Set<string>,
  toggleLike: (id: string) => void,
  spotlightTopicIds: Set<string>,
  spotlightTopic: (id: string) => void,
  showToast: (m: string) => void,
  diamondBalance: number,
  initialTopicId?: string,
  isMyWorkMode?: boolean,
  setCircleIsMyWorkMode: (b: boolean) => void,
  setCircleInitialTopicId: (id: string | undefined) => void,
  setCircleInitialTopicInfo: (info: Partial<Topic> | undefined) => void,
  isGiftDonorDetailModalOpen: boolean,
  setIsGiftDonorDetailModalOpen: (val: boolean) => void
}) => {
  const [activeTab, setActiveTab] = useState('推荐');
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const [isVisibilityDrawerOpen, setIsVisibilityDrawerOpen] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  
  const [sharingTopic, setSharingTopic] = useState<Topic | null>(null);
  const [isGiftDrawerOpen, setIsGiftDrawerOpen] = useState(false);
  const [isGiftersDrawerOpen, setIsGiftersDrawerOpen] = useState(false);
  const [expandedCreatorsId, setExpandedCreatorsId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isPureMode, setIsPureMode] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<any>(null);
  const [isHeatingModalOpen, setIsHeatingModalOpen] = useState(false);
  const [isGiftDonorModalOpen, setIsGiftDonorModalOpen] = useState(false);
  const [selectedShareUserIds, setSelectedShareUserIds] = useState<Set<string>>(new Set());

  const toggleShareUser = (id: string) => {
    const next = new Set(selectedShareUserIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedShareUserIds(next);
  };

  const startLongPress = () => {
    setLongPressTimer(setTimeout(() => {
      setIsPureMode(prev => !prev);
      showToast(isPureMode ? '退出纯净模式' : '进入纯净模式');
    }, 600));
  };

  const endLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleShare = (topic: Topic) => {
    setSharingTopic(topic);
    setSelectedShareUserIds(new Set());
    setIsShareDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-black font-sans relative overflow-hidden">
      {/* Header Overlay */}
      <AnimatePresence>
        {!isPureMode && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 px-4 pt-12 flex items-center justify-between pointer-events-none"
          >
            {isMyWorkMode ? (
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setCircleIsMyWorkMode(false);
                  setCircleInitialTopicId(undefined);
                  setScreen('my-works'); 
                }}
                className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <>
                 <button
                    onClick={(e) => { e.stopPropagation(); setIsGiftDrawerOpen(true); }}
                    className="flex items-center gap-2 glass-pill px-3 py-1.5 rounded-full pointer-events-auto bg-black/20 active:scale-95 transition-transform"
                 >
                    <Gem size={14} className="text-indigo-400" />
                    <span className="text-[11px] font-black tracking-widest text-white shadow-sm">{diamondBalance.toLocaleString()}</span>
                 </button>
                 <GiftDonorStack gifts={MOCK_GIFT_RECORDS.slice(0, 5)} onClick={() => setIsGiftDonorDetailModalOpen(true)} />
              </>
            )}
          </motion.header>
        )}
      </AnimatePresence>
      <GiftDonorDetailModal 
              isOpen={isGiftDonorDetailModalOpen}
              onClose={() => setIsGiftDonorDetailModalOpen(false)}
              gifts={MOCK_GIFT_RECORDS}
            />

      {/* Full Screen Scroll Container */}
      <main className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-24">
        {(isMyWorkMode ? topics : [...topics, ...topics])
          .filter(t => t.status === 'completed')
          .filter(t => isMyWorkMode ? t.id === initialTopicId : true)
          .map((topic, i) => {
          const isFavorite = savedTopicIds.has(topic.id);
          const isLiked = likedTopicIds.has(topic.id);
          const isSpotlighted = spotlightTopicIds.has(topic.id) || topic.status === 'completed';
          
          return (
            <section 
              key={`${topic.id}-${i}`} 
              className="h-full w-full snap-start relative flex flex-col justify-end pb-12 overflow-hidden"
              onPointerDown={startLongPress}
              onPointerUp={endLongPress}
              onPointerLeave={endLongPress}
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
            >
              {/* Play/Pause Indicator Animation */}
              <AnimatePresence>
                {isPaused && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.5 }}
                     className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                   >
                     <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-2xl">
                        <Play size={42} className="text-white fill-white ml-1" strokeWidth={3} />
                     </div>
                   </motion.div>
                )}
              </AnimatePresence>

              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${
                topic.tone === 'blue' ? 'from-indigo-600 via-indigo-900' : 'from-amber-600 via-amber-900'
              } to-black z-0 shadow-inner`}>
                <div className={`absolute inset-0 bg-black/20 transition-opacity ${isPaused ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent opacity-95"></div>
              </div>

              {/* Interaction Bar (Fixed Right) */}
              <AnimatePresence>
                {!isPureMode && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-4 bottom-14 z-20 flex flex-col items-center gap-6"
                  >
                    <div className="relative mb-2">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserName(topic.creator);
                          setScreen('user-profile');
                        }}
                        className="w-14 h-14 rounded-full border-2 border-white/20 p-0.5 bg-dark active:scale-95 transition-transform"
                      >
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.creator}`} alt="" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setScreen('join'); }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-primary rounded-full flex items-center justify-center text-white border-2 border-dark"
                      >
                        <Plus size={15} strokeWidth={3} />
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLike(topic.id); }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                          isLiked ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-white border border-white/5'
                        }`}
                      >
                        <Heart size={24} className={isLiked ? 'fill-current' : ''} />
                      </button>
                      <span className="text-[10px] font-black text-white/80">{topic.likes}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/5 active:scale-95 transition-transform"
                      >
                        <MessageCircle size={24} />
                      </button>
                      <span className="text-[10px] font-black text-white/80">42</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(topic.id); }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                          isFavorite ? 'bg-gold text-dark shadow-lg shadow-gold/20' : 'bg-white/10 text-white border border-white/5'
                        }`}
                      >
                        <Star size={24} className={isFavorite ? 'fill-current' : ''} />
                      </button>
                      <span className="text-[10px] font-black text-white/80">
                        {topic.bookmarks && topic.bookmarks !== '0' ? topic.bookmarks : '收藏'}
                      </span>
                    </div>
 
                    <div className="flex flex-col items-center gap-1.5">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (isMyWorkMode) {
                            setSharingTopic(topic);
                            setIsMoreDrawerOpen(true);
                          } else {
                            handleShare(topic);
                          }
                        }}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/5 active:scale-95 transition-transform"
                      >
                        {isMyWorkMode ? <MoreHorizontal size={24} /> : <CornerUpRight size={24} />}
                      </button>
                      <span className="text-[10px] font-black text-white/80">
                        {isMyWorkMode ? '更多' : (topic.shares && topic.shares !== '0' ? topic.shares : '分享')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <HeatingConfirmationModal 
                isOpen={isHeatingModalOpen}
                onClose={() => setIsHeatingModalOpen(false)}
                onConfirm={() => sharingTopic && spotlightTopic(sharingTopic.id)}
              />

              {/* Infobar (Bottom Left) */}
              <AnimatePresence>
                {!isPureMode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="relative z-10 px-6 pb-6 space-y-2 max-w-[80%] pointer-events-auto"
                  >
                    <p className="text-white font-medium text-lg leading-snug flex items-center gap-2 flex-wrap">
                      <span>{topic.title}</span>
                      {isSpotlighted && (
                        <span className="inline-flex items-center justify-center rounded-full bg-gold/15 border border-gold/20 w-6 h-6 text-gold">
                          <Flame size={11} className="fill-current" />
                        </span>
                      )}
                    </p>
                    
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCreatorsId(expandedCreatorsId === topic.id ? null : topic.id);
                      }}
                      className="flex items-center gap-2 pt-2 cursor-pointer active:scale-95 transition-transform origin-left w-fit"
                    >
                        <div className={`flex ${expandedCreatorsId === topic.id ? 'flex-wrap gap-2' : '-space-x-2'}`}>
                          {Array.from({ length: expandedCreatorsId === topic.id ? topic.joinedCount : Math.min(topic.joinedCount, 3) }).map((_, i) => (
                            <motion.div 
                              layout
                              key={i} 
                              onClick={(e) => {
                                if (expandedCreatorsId === topic.id) {
                                  e.stopPropagation();
                                  setSelectedUserName(`共创者 ${i + 1}`);
                                  setScreen('user-profile');
                                }
                              }}
                              className={`rounded-full border-2 border-dark overflow-hidden ${expandedCreatorsId === topic.id ? 'w-8 h-8 shadow-lg active:scale-90 transition-transform' : 'w-7 h-7'}`}
                            >
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.id + i}`} alt="" className="w-full h-full object-cover" />
                            </motion.div>
                          ))}
                          {expandedCreatorsId !== topic.id && topic.joinedCount > 3 && (
                              <div className="w-7 h-7 rounded-full border-2 border-dark bg-white/10 backdrop-blur-md flex items-center justify-center -ml-2 z-10">
                                <span className="text-[8px] font-black text-white">+{topic.joinedCount - 3}</span>
                              </div>
                          )}
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">
                          {topic.status === 'completed' ? `${topic.joinedCount}人共创` : `还差 ${topic.targetCount - topic.joinedCount} 人即可解锁`}
                          <ChevronRight size={12} className={`inline-block ml-0.5 transition-transform ${expandedCreatorsId === topic.id ? 'rotate-90' : ''}`} />
                        </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </main>

       <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 h-[60%] bg-dark/95 backdrop-blur-2xl rounded-t-[32px] z-[60] border-t border-white/5 flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-3 mb-6 flex-shrink-0" onClick={() => setShowComments(false)} />
            <div className="px-6 pb-4 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                评论 <span className="text-white/20 text-xs">42</span>
              </h3>
              <button onClick={() => setShowComments(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar">
              {[
                { name: '南川', text: '这种拼在一起的日常很有生命力。', time: '12h' },
                { name: 'Echo', text: '比普通 vlog 更像一群人的共同记忆。', time: '15h' },
                { name: '林野', text: '想知道这是哪个城市的街景。', time: '18h' },
              ].map((cmt, i) => (
                <div key={i} className="flex gap-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cmt.name}`} alt="" className="w-8 h-8 rounded-full border border-white/10 bg-white/5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black text-white/30 tracking-widest uppercase">{cmt.name}</p>
                      <span className="text-[9px] text-white/10">{cmt.time} · IP：{['广东', '浙江', '上海', '北京', '四川'][i % 5]}</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{cmt.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-black/40 border-t border-white/5 pb-10">
              <div className="flex gap-3 items-center">
                <input 
                  type="text" 
                  placeholder="留下你的共创注脚..." 
                  className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold focus:border-white/20 outline-none placeholder:text-white/10"
                />
                <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-dark">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGiftDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsGiftDrawerOpen(false); }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111111] rounded-t-3xl pt-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 flex flex-col max-h-[72vh]"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 flex-shrink-0" />
              <div className="flex justify-between items-center px-6 pb-5">
                <div>
                  <h3 className="text-white font-bold text-lg">选择礼物</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">赠送后将展示在评论区</p>
                </div>
                <button onClick={() => setIsGiftDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/60 active:scale-95 transition-transform">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 overflow-y-auto px-6 pb-6 no-scrollbar">
                {GIFTS.map((gift) => (
                  <button
                    key={gift.name}
                    onClick={() => {
                      showToast(`已送出${gift.name}`);
                      setIsGiftDrawerOpen(false);
                    }}
                    className="bg-white/[0.04] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  >
                    <span className="text-3xl leading-none">{gift.icon}</span>
                    <span className="text-[10px] font-black text-white/80 leading-tight text-center">{gift.name}</span>
                    <span className="text-[9px] font-black text-gold tracking-widest">{gift.price}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShareDrawerOpen && sharingTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsShareDrawerOpen(false); }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111111] rounded-t-[32px] pt-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5"
            >
              <div className="flex justify-between items-center px-6 mb-4">
                <h3 className="text-white text-sm font-black tracking-[0.2em] uppercase">分享给好友</h3>
                <button 
                  onClick={() => setIsShareDrawerOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/40 active:scale-95 transition-transform"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Multi-select Friends List */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
                {SHARE_FRIENDS.map((friend) => (
                  <button 
                    key={friend.id} 
                    className="flex flex-col items-center gap-2 min-w-[64px] group relative" 
                    onClick={() => toggleShareUser(friend.id)}
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all p-0.5 active:scale-95 ${
                      selectedShareUserIds.has(friend.id) ? 'border-red-primary bg-red-primary/10' : 'border-white/5 bg-white/5'
                    }`}>
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    
                    {/* Checkbox Overlay */}
                    <div className={`absolute top-0 right-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedShareUserIds.has(friend.id) 
                        ? 'bg-red-primary border-red-primary opacity-100 scale-100' 
                        : 'bg-black/20 border-white/20 opacity-40 scale-75'
                    }`}>
                      {selectedShareUserIds.has(friend.id) && <Check size={12} className="text-white" strokeWidth={4} />}
                    </div>

                    <span className={`text-[10px] font-black tracking-tight transition-colors ${
                      selectedShareUserIds.has(friend.id) ? 'text-white' : 'text-white/40'
                    }`}>
                      {friend.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action Bar / Send Button */}
              <AnimatePresence>
                {selectedShareUserIds.size > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="px-6 py-2"
                  >
                    <button 
                      onClick={() => {
                        showToast(`已向 ${selectedShareUserIds.size} 位好友发送共创邀请`);
                        setIsShareDrawerOpen(false);
                      }}
                      className="w-full h-14 bg-red-primary text-white rounded-2xl font-black uppercase text-xs shadow-[0_10px_30px_rgba(255,36,66,0.3)] active:scale-95 transition-transform"
                    >
                      发送给 {selectedShareUserIds.size} 位好友
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-white/5 w-full mx-auto max-w-[80%] my-2" />

              {/* Other Sharing Channels */}
              <div className="flex gap-6 overflow-x-auto no-scrollbar px-6 pb-2">
                <button key="drawer2-wechat" className="flex flex-col items-center gap-2 group" onClick={() => { showToast('正在跳转微信...'); setIsShareDrawerOpen(false); }}>
                  <div className="w-12 h-12 bg-[#07C160]/10 border border-[#07C160]/20 rounded-2xl flex items-center justify-center text-[#07C160] active:scale-95 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">微信好友</span>
                </button>
                <button key="drawer2-moments" className="flex flex-col items-center gap-2 group" onClick={() => { showToast('正在跳转朋友圈...'); setIsShareDrawerOpen(false); }}>
                  <div className="w-12 h-12 bg-[#07C160]/10 border border-[#07C160]/20 rounded-2xl flex items-center justify-center text-[#07C160] active:scale-95 transition-transform">
                    <Users size={24} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">朋友圈</span>
                </button>
                <button key="drawer2-copy-link" className="flex flex-col items-center gap-2 group" onClick={() => { showToast('已复制链接'); setIsShareDrawerOpen(false); }}>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/60 active:scale-95 transition-transform">
                    <CornerUpRight size={20} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">复制链接</span>
                </button>
                
                <button 
                  key="drawer2-copy-topic"
                  className="flex flex-col items-center gap-2 group" 
                  onClick={() => { 
                    setIsShareDrawerOpen(false);
                    setCircleInitialTopicInfo(sharingTopic);
                    setScreen('create-circle');
                    showToast('话题配置已复制，您可以修改后发布');
                  }}
                >
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/60 active:scale-95 transition-transform">
                    <Copy size={20} />
                  </div>
                  <span className="text-[9px] font-black text-white/40 group-active:text-white uppercase tracking-tighter">复制话题并创建</span>
                </button>
                
                <button 
                  key="drawer2-heat-topic"
                  className="flex flex-col items-center gap-2 group" 
                  onClick={() => { 
                    setIsShareDrawerOpen(false);
                    setIsHeatingModalOpen(true);
                  }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
                      spotlightTopicIds.has(sharingTopic.id) ? 'bg-gold/10 text-gold border-gold/30' : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    <Flame size={20} className={spotlightTopicIds.has(sharingTopic.id) ? 'fill-current' : ''} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${spotlightTopicIds.has(sharingTopic.id) ? 'text-gold' : 'text-white/40 group-active:text-white'}`}>
                    {spotlightTopicIds.has(sharingTopic.id) ? '已加热' : '加热话题'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMoreDrawerOpen && sharingTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsMoreDrawerOpen(false); }}
            className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111111] rounded-t-[32px] pt-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5"
            >
              <div className="flex justify-between items-center px-6 mb-6 flex-shrink-0">
                <h3 className="text-white text-sm font-black tracking-[0.2em] uppercase">更多选项</h3>
                <button 
                  onClick={() => setIsMoreDrawerOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/40 active:scale-95 transition-transform"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 grid grid-cols-4 gap-4 mb-8 flex-shrink-0">
                {[
                  { icon: <CornerUpRight size={20} />, label: '分享片段', action: () => { setIsMoreDrawerOpen(false); setIsShareDrawerOpen(true); } },
                  { icon: <ShieldCheck size={20} />, label: '权限设置', action: () => { setIsMoreDrawerOpen(false); setIsVisibilityDrawerOpen(true); } },
                  { icon: <RotateCw size={20} />, label: '作品合集', action: () => { showToast('即将跳转合集页面'); setIsMoreDrawerOpen(false); } },
                  { icon: <Trash2 size={20} className="text-red-primary" />, label: '删除作品', action: () => { showToast('作品已申请删除'); setIsMoreDrawerOpen(false); } },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="flex flex-col items-center gap-3 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/60 active:scale-95 transition-all group-hover:bg-white/10 group-hover:text-white">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold text-white/30 group-active:text-white transition-colors text-center">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="px-6 space-y-2 flex-shrink-0">
                 <button onClick={() => { showToast('已保存到本地相册'); setIsMoreDrawerOpen(false); }} className="w-full flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 active:bg-white/10 transition-colors">
                    <span className="text-sm font-bold text-white/80">下载作品</span>
                    <ChevronRight size={16} className="text-white/20" />
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VisibilitySelectorDrawer 
        isOpen={isVisibilityDrawerOpen}
        onClose={() => setIsVisibilityDrawerOpen(false)}
        visibility={visibility}
        setVisibility={setVisibility}
        selectedFriendIds={selectedFriendIds}
        setSelectedFriendIds={setSelectedFriendIds}
      />
      <AnimatePresence>
        {isGiftersDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsGiftersDrawerOpen(false); }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111111] rounded-t-3xl pt-6 pb-12 space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 flex flex-col max-h-[70vh]"
            >
              <div className="flex justify-between items-center px-6">
                <h3 className="text-white font-bold text-lg">赠送榜单</h3>
                <button onClick={() => setIsGiftersDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/60 active:scale-95 transition-transform">
                  <X size={16} />
                </button>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="overflow-y-auto px-6 space-y-5 pb-6">
                {[
                    {name: 'Alex', diamond: 8000, img: 'G1', rank: 1},
                    {name: 'Soul', diamond: 5200, img: 'G2', rank: 2},
                    {name: 'Echo', diamond: 3100, img: 'G3', rank: 3},
                    {name: 'John', diamond: 1200, img: 'User4', rank: 4},
                    {name: 'Sarah', diamond: 800, img: 'User5', rank: 5},
                    {name: 'Mike', diamond: 400, img: 'Creator0', rank: 6},
                    {name: 'Emma', diamond: 100, img: 'Creator1', rank: 7},
                ].map((g) => (
                  <div key={g.rank} className="flex items-center gap-4">
                    <div className={`w-8 text-center font-black ${g.rank <= 3 ? 'text-gold text-xl' : 'text-white/40 text-sm'}`}>{g.rank}</div>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${g.img}`} alt={g.name} className="w-10 h-10 rounded-full border border-white/10 bg-dark object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white/90">{g.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full">
                      <Gift size={12} className="text-indigo-400" />
                      <span className="text-xs font-black tracking-widest text-white/80">{g.diamond}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

// --- Energy Detail Screen ---

const EnergyDetailScreen = ({ setScreen, prevScreen, balance }: { setScreen: (s: Screen) => void, prevScreen: Screen, balance: number }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'get' | 'use'>('all');
  const [showInfo, setShowInfo] = useState(false);

  const transactions = [
    { id: 1, type: 'get', title: '完成共创话题', amount: 500, time: '今天 09:41', icon: Zap },
    { id: 2, type: 'get', title: '获得他人赠送的礼物', amount: 200, time: '今天 08:30', icon: Gift },
    { id: 3, type: 'use', title: '兑换「星轨戒指」', amount: -600, time: '昨天 21:15', icon: Heart },
    { id: 4, type: 'get', title: '每日登录奖励', amount: 50, time: '昨天 08:00', icon: Flame },
    { id: 5, type: 'get', title: '连续共创 7 天奖励', amount: 1000, time: '3天前', icon: ShieldCheck },
    { id: 6, type: 'use', title: '解锁精选合集权限', amount: -300, time: '5天前', icon: Users },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  return (
    <div className="flex flex-col h-full bg-dark">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen(prevScreen)} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">积分明细</h2>
        <button onClick={() => setShowInfo(!showInfo)} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center text-white/40">
          <HelpCircle size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Total Balance Card */}
        <section className="px-6 py-8">
          <div className="p-8 bg-gradient-to-br from-gold/10 via-card to-card rounded-[40px] border border-gold/10 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase text-gold tracking-widest">当前积分总值</p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-6xl font-bold text-white">{balance.toLocaleString()}</h1>
                  <Zap size={24} className="text-gold fill-gold animate-pulse" />
                </div>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
                <Flame size={24} fill="currentColor" />
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-white/30 uppercase mb-1">今日获得</p>
                <p className="text-xl font-bold text-green-400">+750</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-white/30 uppercase mb-1">本周消耗</p>
                <p className="text-xl font-bold text-rose-500">-600</p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Explainer */}
        <AnimatePresence>
          {showInfo && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 mb-6 overflow-hidden"
            >
              <div className="p-6 bg-soft rounded-[32px] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-gold">
                  <ShieldCheck size={16} />
                  <h4 className="text-sm font-bold">关于“积分值”</h4>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white/80">什么是积分？</p>
                    <p className="text-[11px] text-white/40 leading-relaxed italic">积分是 DR圈共创活跃度的象征，它记录了你对每一个共创话题的参与和对他人的贡献。</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white/80">如何获得？</p>
                    <ul className="text-[11px] text-white/40 list-disc list-inside space-y-1 italic">
                      <li>发起话题：500 积分</li>
                      <li>参与并合拍：300 积分</li>
                      <li>收到礼物：积分值会根据礼物价值增加</li>
                      <li>每日登录：50 积分</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <section className="px-6 mb-4">
          <div className="flex bg-soft p-1 rounded-2xl border border-white/5">
            {[
              { id: 'all', label: '全部记录' },
              { id: 'get', label: '获取' },
              { id: 'use', label: '消耗' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  activeTab === tab.id ? 'bg-white text-dark shadow-md' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Transaction Legend/Info in Header of list */}
        <section className="px-6 mb-2">
           <div className="flex justify-between items-center text-[10px] font-black text-white/10 uppercase tracking-widest px-2">
              <span>项目</span>
              <span>数额/时间</span>
           </div>
        </section>

        {/* Transaction History List */}
        <section className="px-6 space-y-3">
          {filteredTransactions.map((tx, i) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-card bento-card border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-transform shadow-lg"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/[0.03] shrink-0 ${
                  tx.type === 'get' ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  <tx.icon size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold truncate pr-4 text-white">{tx.title}</h4>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">{tx.time}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-lg font-black ${tx.type === 'get' ? 'text-green-400' : 'text-white/80'}`}>
                  {tx.type === 'get' ? '+' : ''}{tx.amount}
                </p>
                <div className="flex items-center justify-end gap-1 text-gold">
                  <Zap size={10} fill="currentColor" />
                </div>
              </div>
            </motion.div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-white/20 text-xs font-black uppercase tracking-widest">暂无记录</p>
            </div>
          )}
        </section>

        {/* Explanatory Module */}
        <section className="p-6 mt-6">
           <div className="bento-card bg-gold p-8 space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mb-16 -mr-16"></div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star size={16} fill="currentColor" className="text-white" />
                 </div>
                 <h4 className="font-bold text-lg text-white">积分等级：精英合创者</h4>
              </div>
              <p className="text-white/80 text-sm leading-relaxed italic">
                 你当前的积分储备已超过全城 85% 的用户。高积分用户在发起话题时会获得优先全城推荐。
              </p>
              <div className="pt-4 flex gap-3">
                 <button className="flex-1 h-12 bg-white text-dark rounded-xl font-black uppercase text-[10px] active:scale-95 transition-transform shadow-xl">
                    查看等级特权
                 </button>
                 <button className="flex-1 h-12 bg-dark/20 text-dark rounded-xl font-black uppercase text-[10px] border border-dark/20 active:scale-95 transition-transform">
                    提升规则
                 </button>
              </div>
           </div>
        </section>
      </main>

      <footer className="p-6 pt-0 bg-dark/80 backdrop-blur-md border-t border-white/[0.03]">
         <button 
           onClick={() => setScreen('shop')}
           className="w-full h-14 bg-white text-dark rounded-[24px] font-black uppercase text-xs shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-2"
         >
           去DR商城兑换权益 <ArrowLeft size={16} className="rotate-180" />
         </button>
      </footer>
    </div>
  );
};

// --- Video Edit Screen ---

const VideoEditScreen = ({ topic, setScreen, showToast, onPost, source = 'join' }: { topic: Topic, setScreen: (s: Screen) => void, showToast: (m: string) => void, onPost: (t: string, s: 'create' | 'join') => void, source?: 'create' | 'join' }) => {
  const [subtitle, setSubtitle] = useState('');
  const [enableTimestamp, setEnableTimestamp] = useState(true);
  const [posting, setPosting] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);

  const handlePost = () => {
    setPosting(true);
    setTimeout(() => {
      onPost(topic.id, source);

      if (source === 'create') {
        setScreen('create-success');
      } else {
        setScreen('join-success');
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
       {/* Header */}
       <div className="absolute top-0 inset-x-0 pt-12 pb-4 flex items-center justify-between px-6 z-30 bg-gradient-to-b from-black/80 to-transparent">
          <button 
            onClick={() => setScreen(source === 'create' ? 'create-and-shoot' : 'join')} 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-sm font-black uppercase text-white tracking-widest">编辑作品</h3>
          <div className="w-10"></div>
       </div>

       {/* Preview Area */}
       <div className="flex-1 flex flex-col items-center justify-center p-6 pt-20 pb-4 overflow-hidden">
          <div className="w-full max-h-[450px] aspect-[9/16] rounded-[40px] bg-[#111] shadow-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
             
             {/* Subtitle Overlay */}
             <div className="absolute top-1/2 inset-x-8 -translate-y-1/2 text-center z-10 px-4">
                <AnimatePresence>
                  {subtitle && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-white text-lg font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight"
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </AnimatePresence>
             </div>

             {/* Timestamp Overlay */}
             <AnimatePresence>
               {enableTimestamp && (
                 <motion.div 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="absolute top-6 left-6 flex flex-col z-10"
                 >
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-primary animate-pulse"></div>
                      <p className="text-[9px] font-black text-white/80 tracking-widest uppercase">REC • SHOT ON DR</p>
                    </div>
                    <p className="text-[12px] font-mono text-white/60 mt-0.5">
                      {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </p>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="text-white/5 opacity-50">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Camera size={60} />
                </motion.div>
             </div>
          </div>
       </div>

       {/* Edit Controls */}
       <div className="bg-dark border-t border-white/5 p-6 pb-12 space-y-5">
          <div className="space-y-3">
             <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">编辑视频字幕 (选填)</label>
                <span className="text-[9px] text-white/10 uppercase font-black">{subtitle.length}/30</span>
             </div>
             <div className="relative group">
                <input 
                  className={`w-full h-12 bg-white/5 rounded-xl px-5 pr-12 font-bold outline-none border transition-all ${isEditingText ? 'border-gold bg-white/10' : 'border-white/5 focus:border-white/20'} text-sm text-white`} 
                  placeholder="给这段作品加句内心独白..."
                  maxLength={30}
                  value={subtitle}
                  onFocus={() => setIsEditingText(true)}
                  onBlur={() => setTimeout(() => setIsEditingText(false), 200)}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {subtitle && (
                    <button onClick={() => setSubtitle('')} className="w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
             </div>
          </div>

          <div 
            onClick={() => setEnableTimestamp(!enableTimestamp)}
            className={`flex items-center justify-between p-4 bg-white/5 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${enableTimestamp ? 'border-gold/30' : 'border-white/5'}`}
          >
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${enableTimestamp ? 'bg-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 text-white/20'}`}>
                   <Zap size={14} fill="currentColor" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white">显示当前时间戳</p>
                   <p className="text-[9px] text-white/30 uppercase tracking-tighter">在视频左上角标记拍摄时刻</p>
                </div>
             </div>
             <div 
               className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${enableTimestamp ? 'bg-gold' : 'bg-white/10'}`}
             >
                <motion.div 
                  animate={{ x: enableTimestamp ? 22 : 2 }}
                  className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-lg"
                />
             </div>
          </div>

          <div className="flex gap-4 pt-1">
             <button 
               onClick={() => setScreen(source === 'create' ? 'create-and-shoot' : 'join')} 
               disabled={posting}
               className="flex-1 h-14 bg-white/5 border border-white/5 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all text-white/40 flex items-center justify-center gap-2"
             >
                <RotateCw size={14} /> 重拍
             </button>
             <button 
               onClick={handlePost}
               disabled={posting}
               className="flex-[2] h-14 bg-white text-dark rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
             >
                {posting ? (
                  <>
                    <RotateCw size={14} className="animate-spin" />
                    <span>发布中...</span>
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </>
                ) : (
                  <>
                    {source === 'create' ? '发起召集并发布' : '完成并发布'} <Check size={16} strokeWidth={4} />
                  </>
                )}
             </button>
          </div>
       </div>
    </div>
  );
};

interface UserVlog {
  id: string;
  topicId: string;
  title: string;
  timestamp: number;
  type: string;
  status: string;
  image: string;
  likes: string;
}

// --- Feedback Screen ---

const FeedbackScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setSelectedImage(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark pt-8 p-6">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg">用户反馈</h2>
        <div className="w-10 h-10"></div>
      </header>

      <div className="space-y-4">
        <textarea
          className="w-full h-40 bg-white/5 rounded-2xl p-4 text-white placeholder-white/30"
          placeholder="请输入您的问题或建议..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
        
        <div className="flex items-center gap-4">
           <input type="file" onChange={handleImageUpload} className="hidden" id="image-upload" />
           <label htmlFor="image-upload" className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10 cursor-pointer">
             {selectedImage ? <img src={selectedImage} className="w-full h-full object-cover rounded-2xl" alt="Preview"/> : <Plus size={24}/>}
           </label>
        </div>

        <button
          className="w-full h-14 bg-gold text-dark font-black rounded-2xl"
          onClick={() => {
            console.log('Submitting:', feedbackText, selectedImage);
            setScreen('me');
          }}
        >
          提交反馈
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const getInitialScreen = (): Screen => {
    // 恢复 404.html SPA 回退的原始路径
    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, '', redirectPath);
    }
    // /go 快捷入口 → 直接进主页
    if (window.location.search.includes('from=go')) {
      window.history.replaceState(null, '', window.location.pathname);
      return 'home';
    }
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    // /login → 直接登录页（跳过 splash）
    if (path === '/draweb/login' || path.endsWith('/login')) return 'login';
    // /spl 或 / → 正常走 splash → home
    return 'splash';
  };

  const [screen, setScreen] = useState<Screen>(getInitialScreen);
  const [prevScreen, setPrevScreen] = useState<Screen>('home');
  const [topics, setTopics] = useState<Topic[]>(TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('林野');
  const [savedTopicIds, setSavedTopics] = useState<Set<string>>(new Set());
  const [likedTopicIds, setLikedTopics] = useState<Set<string>>(new Set());
  const [spotlightTopicIds, setSpotlightTopicIds] = useState<Set<string>>(new Set());
  const [diamondBalance, setDiamondBalance] = useState(1260);
  const [energyBalance] = useState(8420);
  const [userVlogs, setUserVlogs] = useState<UserVlog[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [initialNetworkTab, setInitialNetworkTab] = useState<'friends' | 'followers' | 'following'>('friends');
  const [circleInitialTopicId, setCircleInitialTopicId] = useState<string | undefined>(undefined);
  const [circleInitialTopicInfo, setCircleInitialTopicInfo] = useState<Partial<Topic> | undefined>(undefined);
  const [circleIsMyWorkMode, setCircleIsMyWorkMode] = useState<boolean>(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isGiftDonorDetailModalOpen, setIsGiftDonorDetailModalOpen] = useState(false);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const deleteVlog = (vlogId: string) => {
    if (!window.confirm('确定要删除这段记录吗？删除后该话题的共创人数将减少。')) {
      return;
    }
    
    const vlogToDelete = userVlogs.find(v => v.id === vlogId);
    if (!vlogToDelete) return;

    setUserVlogs(prev => prev.filter(v => v.id !== vlogId));
    
    setTopics(prev => prev.map(t => 
      t.id === vlogToDelete.topicId 
        ? { ...t, joinedCount: Math.max(0, t.joinedCount - 1) } 
        : t
    ));
    
    if (selectedTopic && selectedTopic.id === vlogToDelete.topicId) {
      setSelectedTopic(prev => prev ? { ...prev, joinedCount: Math.max(0, prev.joinedCount - 1) } : null);
    }

    showToast('记录已删除');
  };

  const handlePostVlog = (topicId: string, source: 'create' | 'join') => {
    const topic = topics.find(t => t.id === topicId) || selectedTopic;
    if (!topic) return;

    const newVlog: UserVlog = {
      id: `vlog-${Date.now()}`,
      topicId: topic.id,
      title: topic.title,
      timestamp: Date.now(),
      type: source === 'create' ? '发起' : '参与',
      status: topic.status === 'completed' ? '已成圈' : '待成圈',
      image: `https://api.dicebear.com/7.x/identicon/svg?seed=${Date.now()}`,
      likes: '0'
    };
    
    setUserVlogs(prev => [newVlog, ...prev]);
    
    setTopics(prev => prev.map(t => 
      t.id === topic.id 
        ? { ...t, joinedCount: t.joinedCount + 1 } 
        : t
    ));

    if (selectedTopic && selectedTopic.id === topic.id) {
       setSelectedTopic(prev => prev ? { ...prev, joinedCount: prev.joinedCount + 1 } : null);
    }
  };

  const handleSetScreen = (newScreen: Screen) => {
    setPrevScreen(screen);
    setScreen(newScreen);
  };

  const toggleFavorite = (id: string) => {
    setSavedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLikedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const spotlightTopic = (id: string) => {
    const cost = 100;
    if (diamondBalance < cost) {
      showToast('钻石余额不足，请先充值');
      return;
    }
    
    setDiamondBalance(prev => prev - cost);
    setSpotlightTopicIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    showToast('话题加热成功！已进入热门展示区');
  };

// --- Gift Screen ---

const GiftScreen = ({ setScreen, prevScreen, showToast }: { setScreen: (s: Screen) => void, prevScreen: Screen, showToast: (m: string) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark/95 backdrop-blur-3xl pt-8">
      {/* ... */}
      <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
{/* ... */}
      </main>

      <footer className="p-8 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-400 rounded-md rotate-45"></div>
            <span className="font-bold text-sm">628</span>
            <button onClick={() => setScreen('recharge')} className="text-[10px] text-indigo-400 font-black uppercase tracking-widest ml-1">充值</button>
         </div>
         <button 
           onClick={() => {
             showToast('礼物已送出，稍后将在评论区展示！');
             setTimeout(() => setScreen(prevScreen), 800);
           }} 
           className="h-12 px-10 bg-white text-dark rounded-full font-black text-xs uppercase shadow-2xl active:scale-95 transition-transform"
         >
            立即赠送
         </button>
      </footer>
    </div>
  );
};

  const renderScreen = () => {
    const sS = handleSetScreen;
    switch (screen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen setScreen={sS} showToast={showToast} />;
      case 'home':
        return (
          <HomeScreen 
            setScreen={sS} 
            setSelectedTopic={setSelectedTopic} 
            topics={topics}
            savedTopicIds={savedTopicIds} 
            toggleFavorite={toggleFavorite} 
            likedTopicIds={likedTopicIds}
            toggleLike={toggleLike}
            setSelectedUserName={setSelectedUserName} 
            spotlightTopicIds={spotlightTopicIds}
            spotlightTopic={spotlightTopic}
            showToast={showToast}
          />
        );
      case 'topic-detail':
        return selectedTopic ? (
          <TopicDetail 
            topic={selectedTopic} 
            setScreen={sS} 
            toggleFavorite={toggleFavorite} 
            isFavorite={savedTopicIds.has(selectedTopic.id)} 
            toggleLike={toggleLike}
            isLiked={likedTopicIds.has(selectedTopic.id)}
            setSelectedTopic={setSelectedTopic} 
            setSelectedUserName={setSelectedUserName} 
            showToast={showToast}
            isSpotlighted={spotlightTopicIds.has(selectedTopic.id)}
            spotlightTopic={spotlightTopic}
            userVlogs={userVlogs}
            deleteVlog={deleteVlog}
            setCircleInitialTopicInfo={setCircleInitialTopicInfo}
          />
        ) : (
          <HomeScreen 
            setScreen={sS} 
            setSelectedTopic={setSelectedTopic} 
            topics={topics} 
            savedTopicIds={savedTopicIds} 
            toggleFavorite={toggleFavorite} 
            likedTopicIds={likedTopicIds} 
            toggleLike={toggleLike} 
            setSelectedUserName={setSelectedUserName} 
            spotlightTopicIds={spotlightTopicIds} 
            spotlightTopic={spotlightTopic} 
            showToast={showToast} 
          />
        );
      case 'create-circle':
        return <CreateCircleScreen setScreen={sS} setSelectedTopic={setSelectedTopic} initialTopicInfo={circleInitialTopicInfo} />;
      case 'create-and-shoot':
        return <CreateAndShootScreen setScreen={sS} showToast={showToast} />;
      case 'create-success':
        return <CreateSuccessScreen setScreen={sS} showToast={showToast} />;
      case 'circle':
        return (
          <CircleScreen 
            setScreen={sS} 
            topics={topics}
            setSelectedTopic={setSelectedTopic} 
            setSelectedUserName={setSelectedUserName} 
            savedTopicIds={savedTopicIds}
            toggleFavorite={toggleFavorite}
            likedTopicIds={likedTopicIds}
            toggleLike={toggleLike}
            spotlightTopicIds={spotlightTopicIds}
            spotlightTopic={spotlightTopic}
            showToast={showToast}
            diamondBalance={diamondBalance}
            initialTopicId={circleInitialTopicId}
            isMyWorkMode={circleIsMyWorkMode}
            setCircleIsMyWorkMode={setCircleIsMyWorkMode}
            setCircleInitialTopicId={setCircleInitialTopicId}
            setCircleInitialTopicInfo={setCircleInitialTopicInfo}
            isGiftDonorDetailModalOpen={isGiftDonorDetailModalOpen}
            setIsGiftDonorDetailModalOpen={setIsGiftDonorDetailModalOpen}
          />
        );
      case 'feedback':
        return <FeedbackScreen setScreen={sS} />;
      case 'join':
        return selectedTopic ? <JoinScreen topic={selectedTopic} setScreen={sS} showToast={showToast} /> : <div className="flex flex-col items-center justify-center h-full text-white/40"><p>请先选择话题</p><button onClick={() => sS('home')} className="mt-4 px-6 py-2 glass-pill">返回首页</button></div>;
      case 'video-edit':
        return (
          <VideoEditScreen 
            topic={selectedTopic || topics[0]} 
            setScreen={sS} 
            showToast={showToast} 
            onPost={handlePostVlog}
            source={(selectedTopic?.creator === CURRENT_USER.name && (prevScreen === 'join' || prevScreen === 'create-and-shoot')) ? 'create' : 'join'} 
          />
        );
      case 'join-success':
        return <JoinSuccessScreen setScreen={sS} showToast={showToast} />;
      case 'messages':
        return <MessagesScreen setScreen={sS} />;
      case 'me':
        return <MeScreen setScreen={sS} diamondBalance={diamondBalance} energyBalance={energyBalance} likedCount={likedTopicIds.size} savedCount={savedTopicIds.size} worksCount={userVlogs.length} setInitialNetworkTab={setInitialNetworkTab} />;
      case 'my-works':
        return <MyWorksScreen setScreen={sS} topics={topics} setSelectedTopic={setSelectedTopic} userVlogs={userVlogs} setCircleIsMyWorkMode={setCircleIsMyWorkMode} setCircleInitialTopicId={setCircleInitialTopicId} />;
      case 'smart-ring':
        return <SmartRingScreen setScreen={sS} />;
      case 'shop':
        return <ShopScreen setScreen={sS} balance={energyBalance} />;
      case 'recharge':
        return <RechargeScreen setScreen={sS} balance={diamondBalance} />;
      case 'settings':
        return <SettingsScreen setScreen={sS} />;
      case 'friends':
        return <FriendsScreen setScreen={sS} setSelectedUserName={setSelectedUserName} initialTab={initialNetworkTab} />;
      case 'network-list':
        return <NetworkListScreen setScreen={sS} prevScreen={prevScreen} initialTab={initialNetworkTab} userName={selectedUserName} />;
      case 'liked-topics':
        return <LikedTopicsScreen setScreen={sS} topics={topics} likedTopicIds={likedTopicIds} setSelectedTopic={setSelectedTopic} />;
      case 'saved-topics':
        return <SavedTopicsScreen setScreen={sS} topics={topics} savedTopicIds={savedTopicIds} setSelectedTopic={setSelectedTopic} />;
      case 'dm':
        return <DMScreen setScreen={sS} setSelectedUserName={setSelectedUserName} />;
      case 'relation-invite':
        return <RelationInviteScreen setScreen={sS} />;
      case 'relation-sent':
        return <RelationSentScreen setScreen={sS} />;
      case 'relation-review':
        return <RelationReviewScreen setScreen={sS} showToast={showToast} />;
      case 'user-profile':
        return <UserProfileScreen setScreen={sS} userName={selectedUserName} prevScreen={prevScreen} showToast={showToast} setInitialNetworkTab={setInitialNetworkTab} />;
      case 'personal-profile':
        return <PersonalProfileScreen setScreen={sS} />;
      case 'gift':
        return <GiftScreen setScreen={sS} prevScreen={prevScreen} showToast={showToast} />;
      case 'energy-detail':
        return <EnergyDetailScreen setScreen={sS} prevScreen={prevScreen} balance={energyBalance} />;
      case 'account-profile':
        return <AccountProfileScreen setScreen={sS} />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen setScreen={sS} />;
      case 'notification-settings':
        return <NotificationSettingsScreen setScreen={sS} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-4">
            <Settings className="animate-spin-slow" size={48} />
            <p className="font-black uppercase tracking-widest text-sm">功能开发中... ({screen})</p>
            <button onClick={() => sS('home')} className="px-6 py-2 glass-pill rounded-xl text-white">返回首页</button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-[402px] mx-auto h-[874px] bg-dark overflow-hidden relative shadow-[0_0_120px_rgba(0,0,0,0.15)] border-[8px] border-[#f5f5f5] rounded-[56px] font-sans my-4">
      {/* Simulated Status Bar / Dynamic Island */}
      <div className="absolute top-0 inset-x-0 h-10 z-[100] flex justify-between items-center px-10 pointer-events-none">
        <span className="text-[13px] font-black tracking-tight mt-3 text-white">9:41</span>
        <div className="w-[110px] h-[30px] bg-dark rounded-full mt-3 shadow-2xl border border-black/5 flex items-center justify-center gap-1.5 overflow-hidden">
           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
           <div className="w-6 h-0.5 bg-white/20 rounded-full"></div>
        </div>
        <div className="flex gap-1.5 items-center mt-3 scale-90">
          <div className="w-5 h-2.5 bg-dark/20 rounded-[3px] relative overflow-hidden ring-[1px] ring-black/10">
             <div className="absolute inset-y-0 left-0 bg-dark w-3/4"></div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={screen + (selectedTopic?.id || '')}
          initial={{ opacity: 0, scale: screen === 'topic-detail' ? 0.96 : 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: screen === 'topic-detail' ? 1.04 : 0.98 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="h-full relative flex flex-col"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] px-6 py-4 bg-black/80 backdrop-blur-md text-white font-bold text-xs shadow-2xl border border-white/10 rounded-full whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {(screen === 'home' || screen === 'circle' || screen === 'messages' || screen === 'me') && (
        <>
          <BottomNav 
            active={screen} 
            setScreen={handleSetScreen} 
            onPlusClick={() => {
              setCircleInitialTopicInfo(undefined);
              handleSetScreen('create-circle');
            }}
          />
        </>
      )}
    </div>
  );
}

// --- Splash Screen ---

const SplashScreen = () => {
  return (
    <div className="flex flex-col h-full bg-dark items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFD700]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFD700]/5 blur-[150px] rounded-full" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <Logo size={100} className="mb-10" />
        
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center space-y-4"
          >
            <h2 className="w-full px-4 text-center text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-normal whitespace-nowrap">让相信真爱的人聚在一起</h2>
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#D4AF37]/30" />
              <div className="h-[1px] w-8 bg-[#D4AF37]/30" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="mt-12"
          >
            <p className="text-[9px] font-light text-white/20 tracking-[0.4em] uppercase">DR Moments Journal · Premium Edition</p>
          </motion.div>
        </div>
      </div>

      {/* Elegant Progress Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeInOut" 
            }}
            className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"
          />
        ))}
      </div>
    </div>
  );
};

// --- Smart Ring Screen ---

const SmartRingScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5 shadow-sm">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">智能戒指</h2>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-12">
        <section className="bg-gradient-to-br from-gold/30 via-card to-card p-8 bento-card border border-gold/10 flex items-center justify-between shadow-xl">
           <div className="space-y-2 relative z-10">
              <p className="text-xs font-black uppercase text-gold tracking-widest">DR Ring Pro</p>
              <h3 className="text-6xl font-bold leading-none text-white">86</h3>
              <p className="text-white/40 text-xs italic">今日状态良好 · 已佩戴 7.5h</p>
           </div>
           <img src="https://images.unsplash.com/photo-1611078440058-20412803b9b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Ring" className="w-24 h-24 rounded-full border-[10px] border-gold shadow-[0_0_40px_rgba(214,178,126,0.1)] relative z-10 object-cover" />
        </section>

        <section className="grid grid-cols-3 gap-3">
           {[
             { label: '准备度', val: '86', desc: '稳定', tone: 'red' },
             { label: '睡眠', val: '82', desc: '1h 深睡', tone: 'indigo' },
             { label: '活动', val: '74', desc: '1.8k 步', tone: 'emerald' },
           ].map(item => (
             <div key={item.label} className="p-4 bg-card bento-card border border-white/5 space-y-2 shadow-lg">
                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">{item.label}</p>
                <p className="text-xl font-bold text-white">{item.val}</p>
                <p className="text-[10px] text-white/20 truncate italic">{item.desc}</p>
             </div>
           ))}
        </section>

        <section className="p-6 bg-card bento-card border border-white/5 space-y-6 shadow-xl">
           <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-white">心率趋势 (24h)</h4>
              <span className="text-[10px] font-black text-white/10 uppercase tracking-widest underline decoration-green-500/30">同步正常</span>
           </div>
           <div className="h-24 flex items-end gap-2 px-1">
              {[40, 60, 45, 80, 55, 70, 50, 65, 40].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-gold/5 via-gold/10 to-gold/40 rounded-t-full" style={{ height: `${h}%` }}></div>
              ))}
           </div>
           <div className="pt-4 border-t border-white/5 flex justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase text-white/20">静息心率</p>
                 <p className="text-lg font-bold text-white">62 bpm</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase text-white/20">HRV 变异率</p>
                 <p className="text-lg font-bold text-white">48 ms</p>
              </div>
           </div>
        </section>

        <div className="p-4 bg-soft rounded-[24px] border border-white/5 flex gap-4 items-center">
           <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
              <Bell size={20} />
           </div>
           <div className="flex-1">
              <p className="text-sm font-bold text-white">今晚建议早点休息</p>
              <p className="text-xs text-white/40 mt-0.5 leading-relaxed italic">体温较昨日略高，身体处于恢复期。</p>
           </div>
        </div>
      </main>
    </div>
  );
};

// --- DM (Chat) Screen ---

const DMScreen = ({ setScreen, setSelectedUserName }: { setScreen: (s: Screen) => void, setSelectedUserName: (name: string) => void }) => {
  const userName = "林野";
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: '我刚拍了一段 3 秒片段，顺手把声音也录进去了。', sender: 'other', time: '09:41' },
    { id: 2, text: '我这边也补好了，今天的城市声音很完整。', sender: 'me', time: '09:42' },
  ]);

  const handleSend = () => {
    if (!msg.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: msg,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setMsg('');
  };

  return (
    <div className="flex flex-col h-full bg-dark pt-8 relative overflow-hidden">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('messages')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="text-center group active:scale-95 transition-transform cursor-pointer" onClick={() => {
            setSelectedUserName(userName);
            setScreen('user-profile');
        }}>
           <h2 className="font-bold text-white">{userName}</h2>
           <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">在线 · 共创进行中</p>
        </div>
        <button onClick={() => setScreen('gift')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center text-rose-500 border border-white/5">
          <Gift size={20} />
        </button>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
         <div className="flex justify-center">
            <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-white/20 uppercase tracking-widest">09:41</span>
         </div>

         {messages.map((m) => (
           <div key={m.id} className={`flex gap-4 ${m.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} max-w-full animate-in fade-in slide-in-from-bottom-2`}>
              <div className="w-10 h-10 rounded-2xl bg-soft flex-shrink-0 border border-white/5"></div>
              <div className={`p-4 shadow-lg space-y-2 border ${
                m.sender === 'me' 
                ? 'bg-white rounded-[24px] rounded-tr-none text-dark border-transparent' 
                : 'bg-card rounded-[24px] rounded-tl-none text-white/80 border-white/5'
              }`}>
                 <p className="text-xs leading-relaxed font-medium">{m.text}</p>
                 <span className={`text-[8px] font-black block text-right uppercase tracking-widest ${m.sender === 'me' ? 'text-dark/40' : 'text-white/20'}`}>
                   {m.time}
                 </span>
              </div>
           </div>
         ))}

         <div className="mx-auto w-full p-4 bg-card bento-card border border-gold/30 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
               <p className="text-[10px] font-black text-gold tracking-widest uppercase">共创动态</p>
               <span className="text-[10px] font-black text-white/20">召集中</span>
            </div>
            <div>
               <h4 className="font-bold text-white">今天的城市声音</h4>
               <p className="text-[10px] text-white/40 mt-1 italic">6/8 · 过程与成品同步预览</p>
            </div>
            <button onClick={() => setScreen('topic-detail')} className="w-full h-10 bg-gold/10 text-gold font-black text-[10px] uppercase rounded-xl border border-gold/20">
               进入话题详情
            </button>
         </div>


      </main>

      <div className="absolute inset-x-6 bottom-8 z-50">
         <div className="h-14 glass-pill rounded-full flex items-center pr-2 pl-6 gap-4 shadow-2xl bg-dark/80 backdrop-blur-xl border border-white/5">
            <input 
              className="flex-1 bg-transparent text-sm font-bold placeholder:text-white/20 outline-none text-white" 
              placeholder="想对林野说点什么..." 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={() => setScreen('gift')} className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
               <Gift size={20} />
            </button>
            <button 
              onClick={handleSend}
              disabled={!msg.trim()}
              className={`h-10 px-6 font-black rounded-full text-xs uppercase shadow-xl transition-all ${
                msg.trim() ? 'bg-white text-dark' : 'bg-white/5 text-white/10'
              }`}
            >
               发送
            </button>
         </div>
      </div>
    </div>
  );
};

// --- Shop Screen ---

const ShopScreen = ({ setScreen, balance }: { setScreen: (s: Screen) => void, balance: number }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">DR商城</h2>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-24">
        <section className="p-8 bg-gradient-to-br from-card via-card to-indigo-500/10 bento-card border border-indigo-500/10 space-y-3 relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16"></div>
           <p className="text-xs font-black uppercase text-indigo-400 tracking-widest relative z-10">我的积分余额</p>
           <h1 className="text-6xl font-bold relative z-10 text-white">{balance.toLocaleString()}</h1>
           <p className="text-white/40 text-xs relative z-10 leading-relaxed italic">
             积分由共创礼物及动态获得，仅限商城内实物或虚拟权益兑换。
           </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
           {SHOP_ITEMS.map(item => (
              <div key={item.name} className="p-4 bg-card bento-card border border-white/5 space-y-4 shadow-lg group active:scale-95 transition-transform">
                 <div className="aspect-square rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/5 transition-colors overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-${item.price === '680' ? '1542291026-7eec264c27ff' : item.price === '320' ? '1610421255869-7c1bd36122d7' : item.price === '880' ? '1505740420928-5e560c06d30e' : '1523275335684-37898b6baf30'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80`} alt={item.name} className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-gold text-lg font-bold mt-1">{item.price}<span className="text-[10px] text-white/20 ml-1 uppercase font-black">{item.unit}</span></p>
                 </div>
                 <button className="w-full h-10 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">
                    立即兑换
                 </button>
              </div>
           ))}
        </div>
      </main>
    </div>
  );
};

// --- Recharge Screen ---

const RechargeScreen = ({ setScreen, balance }: { setScreen: (s: Screen) => void, balance: number }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center border border-white/5 shadow-sm">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="font-bold text-white text-lg tracking-tight">钻石充值</h2>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-24">
        <div className="space-y-3">
           <p className="text-xs font-black text-white/40 tracking-widest uppercase">账户可用余额</p>
           <h1 className="text-6xl font-bold flex items-center gap-4 text-white">
              {balance.toLocaleString()}
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center rotate-45 shadow-lg shadow-gold/20"></div>
           </h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { amount: '68', label: '6 钻石', price: '6.00' },
            { amount: '128', label: '12+1 钻石', price: '12.00', bonus: true },
            { amount: '328', label: '32+5 钻石', price: '32.00', bonus: true },
            { amount: '648', label: '64+12 钻石', price: '64.00', bonus: true },
          ].map(opt => (
            <div key={opt.amount} className={`p-6 bento-card border active:scale-95 transition-all cursor-pointer shadow-lg ${opt.bonus ? 'bg-gold/5 border-gold/10' : 'bg-card border-white/5'}`}>
               <p className={`text-sm font-bold ${opt.bonus ? 'text-gold' : 'text-white/60'}`}>{opt.label}</p>
               <h3 className="text-3xl font-bold mt-2 text-white">{opt.price}</h3>
               {opt.bonus && <span className="inline-block mt-4 px-2 py-0.5 bg-gold text-dark text-[8px] font-black rounded uppercase">赠送礼包</span>}
            </div>
          ))}
        </div>

        <div className="p-6 bg-soft rounded-[32px] border border-white/5 space-y-4">
           <h4 className="font-bold text-sm text-white">充值说明</h4>
           <p className="text-xs text-white/40 leading-relaxed italic">
             钻石是 DR圈内的通用货币，可用于礼物赠送、道具购买等。一旦充值暂不支持退款，请理性参与共创。
           </p>
        </div>
      </main>
    </div>
  );
};

// --- Relation Invite Screen ---

// --- Relation Invite Screen ---

const RelationInviteScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [selectedType, setSelectedType] = useState('真爱');
  const [targetId, setTargetId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const relations = [
    { title: '真爱', desc: '一对一专属关系，永不落幕', color: '#f43f5e', icon: Heart, badge: 'Soulmate' },
    { title: '闺蜜', desc: '亲密无间的挚友（最多 3 个）', color: '#6366f1', icon: Sparkles, badge: 'BFF' },
    { title: '兄弟', desc: '肝胆相照的兄弟（最多 3 个）', color: '#10b981', icon: Zap, badge: 'Brother' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#050505] overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-30 blur-[120px] bg-gradient-to-br from-rose-500/20 via-indigo-500/10 to-transparent"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      <header className="p-6 flex items-center justify-between relative z-20">
        <button onClick={() => setScreen('me')} className="w-12 h-12 glass-pill rounded-2xl flex items-center justify-center border border-white/5 active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-white tracking-widest uppercase text-xs">星轨绑定</h2>
          <div className="h-0.5 w-4 bg-gold mx-auto mt-1 rounded-full opacity-50"></div>
        </div>
        <button className="w-12 h-12 glass-pill rounded-2xl flex items-center justify-center border border-white/5 opacity-50">
          <HelpCircle size={20} className="text-white" />
        </button>
      </header>

      <main className="flex-1 p-6 space-y-10 overflow-y-auto no-scrollbar relative z-10">
        {/* Connection Ritual Header */}
        <section className="text-center space-y-4 pt-4">
          <div className="relative inline-block">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] border border-dashed border-white/10 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10px] border border-dashed border-gold/20 rounded-full"
            />
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 p-1 relative z-10 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wesley" className="w-full h-full object-cover rounded-full" alt="Me" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
            </div>
            <motion.div 
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 60, opacity: 1 }}
              className="absolute top-1/2 -right-8 flex gap-1 items-center"
            >
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_gold]"
                />
              ))}
            </motion.div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white italic tracking-tight">开启关系共鸣</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">The Stellar Alignment Ritual</p>
          </div>
        </section>

        {/* Relation Selector */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">选择共鸣类型</h4>
            <span className="text-[10px] font-black text-gold/40 italic">Select Frequency</span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
            {relations.map(item => (
              <motion.div
                key={item.title}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(item.title)}
                className={`relative min-w-[140px] aspect-[4/5] p-5 rounded-[32px] border transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer ${
                  selectedType === item.title 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/5 border-white/5'
                }`}
              >
                {selectedType === item.title && (
                  <motion.div 
                    layoutId="rel-bg"
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundColor: item.color, filter: 'blur(40px)' }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{item.badge}</span>
                    <h4 className={`font-black text-lg transition-colors ${selectedType === item.title ? 'text-white' : 'text-white/40'}`}>{item.title}</h4>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      selectedType === item.title 
                      ? 'bg-white text-dark scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                      : 'bg-white/5 text-white/20'
                    }`}>
                      <item.icon size={20} fill={selectedType === item.title ? "currentColor" : "none"} />
                    </div>
                    <p className={`text-[9px] font-medium leading-tight h-8 flex items-end transition-opacity ${selectedType === item.title ? 'opacity-60' : 'opacity-0'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Animated Ring if selected */}
                {selectedType === item.title && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.15, scale: 1.5 }}
                    className="absolute bottom-[-20%] right-[-20%] w-32 h-32 border border-white rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Target ID Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest uppercase">定位共鸣坐标</h4>
            <span className="text-[10px] font-black text-gold/40 italic">Target DR ID</span>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center text-white/20">
              <Search size={18} />
            </div>
            <input 
              value={targetId}
              onChange={(e) => {
                setTargetId(e.target.value);
                if (e.target.value.length > 5) {
                  setIsSearching(true);
                  setTimeout(() => setIsSearching(false), 800);
                }
              }}
              className="w-full h-16 bg-white/5 rounded-[24px] pl-14 pr-14 font-bold border border-white/5 focus:border-white/20 focus:bg-white/10 transition-all outline-none text-white tracking-widest placeholder:text-white/10" 
              placeholder="ENTER DR ID..." 
            />
            <div className="absolute inset-y-0 right-5 flex items-center">
              {isSearching ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full"
                />
              ) : targetId.length > 0 && (
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>
          {targetId.length > 5 && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5"
            >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${targetId}`} className="w-10 h-10 rounded-xl bg-white/5" alt="Found" />
              <div>
                <p className="text-xs font-bold text-white">找到匹配用户: <span className="text-gold italic">@{targetId}</span></p>
                <p className="text-[9px] font-black text-white/30 uppercase mt-0.5 tracking-wider">Signals Match - Frequency Stabilized</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="p-8 pt-0 relative z-20">
         <button 
           onClick={() => setScreen('relation-sent')} 
           disabled={!targetId}
           className="w-full h-16 group relative overflow-hidden rounded-[24px] disabled:opacity-30 transition-all active:scale-95"
         >
            <div className="absolute inset-0 bg-white group-hover:bg-gold transition-colors duration-500"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]"></div>
            
            <div className="relative z-10 flex items-center justify-center gap-3 text-dark">
              <div className="flex flex-col items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] leading-none mb-1">Star Trail Ring</span>
                <span className="text-[10px] font-black italic opacity-60">购买「星轨戒指」并发送</span>
              </div>
              <ChevronRight size={18} strokeWidth={3} />
            </div>

            {/* Shimmer Effect */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
            />
         </button>
         
         <p className="text-center mt-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
           Consumed 520 Diamonds for the Ritual
         </p>
      </footer>
    </div>
  );
};

// --- Relation Sent Screen ---

const RelationSentScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#050505] px-10 text-center relative overflow-hidden">
      {/* Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -500 - Math.random() * 500 }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute w-0.5 h-0.5 bg-white rounded-full bg-gold"
          style={{ 
            left: `${Math.random() * 100}%`,
            top: '110%'
          }}
        />
      ))}

      <div className="relative mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-40px] border border-dashed border-gold/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] border border-dashed border-white/10 rounded-full"
        />
        
        <motion.div 
          initial={{ scale: 0, scaleY: 0.5 }}
          animate={{ scale: 1, scaleY: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-32 h-32 bg-white rounded-[42px] flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.15)] relative z-10 group"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={56} className="text-dark" strokeWidth={2.5} />
          </motion.div>
          
          <motion.div
             animate={{ height: ['0%', '100%', '0%'], opacity: [0, 0.5, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute inset-0 w-full rounded-[42px] bg-gold"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white italic tracking-tight">星讯已发出!</h2>
          <p className="text-[10px] font-black uppercase text-gold/40 tracking-[0.4em]">Signal Transmitted Successfully</p>
        </div>
        <p className="text-white/40 text-xs leading-relaxed italic max-w-[240px] mx-auto">
          你的「星轨戒指」已穿透时空。当对方在频率中捕捉到你，专属共鸣标记将永久闪烁在你们的数字星系中。
        </p>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setScreen('home')} 
        className="w-full mt-12 group h-16 bg-white/5 border border-white/10 rounded-[28px] relative overflow-hidden flex items-center justify-center active:scale-95 transition-all"
      >
        <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
        <span className="relative z-10 font-black text-xs uppercase tracking-widest text-white group-hover:text-dark transition-colors">回到现实世界</span>
      </motion.button>
    </div>
  );
};

// --- User Profile Screen (Public) ---
const UserProfileScreen = ({ setScreen, userName, prevScreen, showToast, setInitialNetworkTab }: { setScreen: (s: Screen) => void, userName: string, prevScreen: Screen, showToast: (m: string) => void, setInitialNetworkTab: (tab: 'followers' | 'following' | 'friends') => void }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [filter, setFilter] = useState('全部');

  const filterOptions = ['全部', '发起', '参与', '已成圈', '待成圈'];

  const allWorks = [
    { id: 1, type: '发起', status: '已成圈' },
    { id: 2, type: '发起', status: '待成圈' },
    { id: 3, type: '参与', status: '已成圈' },
    { id: 4, type: '参与', status: '待成圈' },
    { id: 5, type: '参与', status: '已成圈' },
    { id: 6, type: '发起', status: '已成圈' },
  ];

  const filteredWorks = allWorks.filter(w => {
    if (filter === '全部') return true;
    if (filter === '发起') return w.type === '发起';
    if (filter === '参与') return w.type === '参与';
    if (filter === '已成圈') return w.status === '已成圈';
    if (filter === '待成圈') return w.status === '待成圈';
    return true;
  });
  const publicProfile = {
    description: '喜欢收集城市角落里的声音和短暂的光，也愿意把日常交给一群人共同完成。',
    gender: userName === 'Mia' ? '女' : '男',
    zodiac: userName === 'Mia' ? '天秤座' : '水瓶座',
    age: userName === 'Mia' ? '25' : '27',
  };

  return (
    <div className="flex flex-col h-full bg-dark">
      <header className="p-6 flex items-center justify-between z-20">
        <button onClick={() => setScreen(prevScreen)} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold">用户详情</h2>
        <button onClick={() => showToast('已生成个人主页分享卡片。')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
          <CornerUpRight size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <section className="text-center py-6 px-8">
           <div className="relative w-24 h-24 mx-auto">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="" className="w-24 h-24 rounded-[32px] mx-auto shadow-2xl object-cover border border-white/10" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gold rounded-full border-4 border-dark flex items-center justify-center text-dark scale-90">
                 <ShieldCheck size={14} strokeWidth={3} />
              </div>
           </div>
           <h1 className="text-2xl font-bold mt-4">{userName}</h1>
           <p className="text-white/40 text-[10px] mt-1 uppercase tracking-widest font-black">@{userName.toLowerCase()}_dr</p>
           <p className="text-white/20 text-[10px] font-bold mt-1">IP：{['广东', '浙江', '上海', '北京', '四川'][userName.length % 5]}</p>
           <p className="text-white/50 text-xs leading-relaxed mt-4 max-w-[280px] mx-auto">{publicProfile.description}</p>
           
           <div className="flex justify-center gap-8 mt-6">
              <button 
                onClick={() => { setInitialNetworkTab('followers'); setScreen('network-list'); }}
                className="text-center active:scale-95 transition-transform"
              >
                 <p className="text-lg font-bold text-white">1.2k</p>
                 <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">粉丝</p>
              </button>
              <div className="text-center">
                 <p className="text-lg font-bold text-white">86</p>
                 <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">共创话题</p>
              </div>
              <button 
                onClick={() => { setInitialNetworkTab('following'); setScreen('network-list'); }}
                className="text-center active:scale-95 transition-transform"
              >
                 <p className="text-lg font-bold text-white">14w</p>
                 <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">获赞</p>
              </button>
           </div>

           <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { label: '性别', value: publicProfile.gender },
                { label: '星座', value: publicProfile.zodiac },
                { label: '年龄', value: `${publicProfile.age} 岁` },
              ].map(item => (
                <div key={item.label} className="bg-white/5 border border-white/5 rounded-2xl px-3 py-3">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                  <p className="text-xs font-bold text-white mt-1">{item.value}</p>
                </div>
              ))}
           </div>

           <div className="flex gap-3 mt-8 px-4">
              <button 
                onClick={() => setIsFollowed(!isFollowed)}
                className={`flex-1 h-12 rounded-2xl font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${
                  isFollowed 
                  ? 'bg-white/5 border border-white/10 text-white/40' 
                  : 'bg-white text-dark shadow-xl hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isFollowed ? '已关注' : '关注 TA'}
              </button>
              <button 
                onClick={() => setScreen('dm')}
                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] text-white active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} /> 发送私信
              </button>
           </div>
        </section>

        <section className="px-6 space-y-6">
           {/* Relationship Section */}
           <div className="p-6 bg-gradient-to-br from-rose-500/10 to-dark bento-card border border-rose-500/10 space-y-4">
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-sm font-bold flex items-center gap-2">
                       <Heart size={14} className="text-rose-500 fill-current" /> 关系状态
                    </h4>
                    <p className="text-[10px] text-white/40 font-black uppercase mt-1 tracking-widest leading-relaxed">
                       目前还没有与 TA 建立专属关系标记
                    </p>
                 </div>
                 <button 
                  onClick={() => setScreen('relation-invite')}
                  className="h-9 px-4 bg-white text-dark rounded-xl text-[10px] font-black uppercase active:scale-95 transition-transform"
                >
                    发起绑定
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">TA 的共创作品</h4>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {filterOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                      filter === opt 
                      ? 'bg-white text-dark shadow-lg' 
                      : 'bg-white/5 text-white/40 border border-white/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pb-8">
                 {filteredWorks.map(work => (
                    <div key={work.id} className="aspect-[4/3] bg-card bento-card border border-white/5 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/5 flex items-center justify-center opacity-40">
                          <p className="text-2xl font-bold text-white/5">#{work.id}</p>
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-3">
                          <p className="text-[8px] font-black uppercase text-white/40 tracking-wider">
                             话题 #{work.id+102}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                             <div className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${work.status === '已成圈' ? 'bg-green-400' : 'bg-gold'}`}></span>
                                <span className="text-[8px] font-black uppercase text-white/60 tracking-wider">
                                   {work.status}
                                </span>
                             </div>
                             <p className="text-[10px] font-bold">2.4k</p>
                          </div>
                       </div>
                    </div>
                 ))}
                 {filteredWorks.length === 0 && (
                   <div className="col-span-2 py-20 text-center">
                     <p className="text-white/20 text-xs font-black uppercase tracking-widest">暂无相关作品</p>
                   </div>
                 )}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};


// --- Personal Profile Screen ---

const PersonalProfileScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex flex-col h-full bg-dark pt-8">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-xl z-20">
        <button onClick={() => setScreen('me')} className="w-10 h-10 glass-pill rounded-2xl flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold">个人主页</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <section className="text-center py-10">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wesley" alt="" className="w-32 h-32 rounded-[40px] border border-white/10 mx-auto shadow-2xl object-cover" />
           <h1 className="text-3xl font-bold mt-6">Wesley</h1>
           <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-black">@wesleyyy1</p>
           <p className="text-white/20 text-[10px] font-bold mt-1">IP：广东</p>
           <p className="text-white/50 text-xs leading-relaxed mt-4 px-8">
             喜欢记录城市里转瞬即逝的真实片段，也愿意和陌生人一起完成一段共同记忆。
           </p>
        </section>

        <section className="px-6 space-y-4">
           <div className="p-6 bg-gradient-to-br from-indigo-500/20 to-dark bento-card border border-indigo-500/10 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">积分值</p>
                 <h4 className="text-lg font-bold mt-1 text-white">DR 级 · 核心共创者</h4>
              </div>
              <div className="w-10 h-10 glass-pill rounded-xl flex items-center justify-center text-gold">
                 <ShieldCheck size={20} />
              </div>
           </div>

           <div className="p-6 bg-card bento-card border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest">个人资料</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '性别', value: '男' },
                  { label: '星座', value: '水瓶座' },
                  { label: '年龄', value: '27 岁' },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl bg-white/5 border border-white/5 p-3">
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-xs text-white font-bold mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                <p className="text-[9px] text-white/25 font-black uppercase tracking-widest">个人描述</p>
                <p className="text-sm text-white/70 leading-relaxed mt-2">喜欢记录城市里转瞬即逝的真实片段，也愿意和陌生人一起完成一段共同记忆。</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-3">
              {[
                { label: '参与共创', val: '32', icon: Flame },
                { label: '获得热度', val: '1.2k', icon: Heart },
              ].map(stat => (
                <div key={stat.label} className="p-5 bg-card bento-card border border-white/5 space-y-3">
                   <stat.icon size={16} className="text-white/20" />
                   <div>
                      <p className="text-2xl font-bold leading-none">{stat.val}</p>
                      <p className="text-[10px] font-black uppercase text-white/40 mt-1 tracking-widest">{stat.label}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-6 bg-white/5 rounded-[32px] space-y-6 border border-white/5 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">已绑定关系</h4>
                 <button onClick={() => setScreen('relation-invite')} className="w-8 h-8 glass-pill rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <Plus size={18} />
                 </button>
              </div>
              <div className="space-y-4">
                 {[
                   { name: '林野', type: '真爱', time: '214 天', color: 'rose' },
                   { name: 'Mia', type: '闺蜜', time: '45 天', color: 'indigo' },
                 ].map(rel => (
                    <div key={rel.name} className="flex items-center justify-between p-4 glass-pill rounded-2xl border border-white/5 bg-white/[0.02]">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-soft flex items-center justify-center">
                             <UserIcon size={16} className="text-white/20" />
                          </div>
                          <div>
                             <p className="text-sm font-bold">{rel.name}</p>
                             <p className={`text-[10px] font-black uppercase tracking-widest ${rel.color === 'rose' ? 'text-rose-400' : 'text-indigo-400'}`}>{rel.type}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">绑定时长</p>
                          <p className="text-xs font-bold">{rel.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

// --- Relation Review Screen ---

const RelationReviewScreen = ({ setScreen, showToast }: { setScreen: (s: Screen) => void, showToast: (m: string) => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      {/* Immersive Space Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-full h-full opacity-40 blur-[130px] bg-gradient-to-bl from-gold/30 via-indigo-600/10 to-transparent"></div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 70% 20%, rgba(255,215,0,0.15) 0%, transparent 60%)' 
          }}
        ></motion.div>
      </div>

      <header className="p-6 flex items-center justify-between relative z-20">
        <button onClick={() => setScreen('messages')} className="w-12 h-12 glass-pill rounded-2xl flex items-center justify-center border border-white/5 active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-white tracking-[0.3em] uppercase text-[10px] opacity-60">Incoming Signal</h2>
          <div className="h-0.5 w-8 bg-gold mx-auto mt-1 rounded-full animate-pulse"></div>
        </div>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 p-8 space-y-10 overflow-y-auto no-scrollbar relative z-10 pt-12">
        {/* Transmission Source Header */}
        <section className="space-y-6 text-center">
          <div className="relative inline-block">
             <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
               className="absolute inset-[-15px] border border-gold/30 rounded-full"
             />
             <div className="w-28 h-28 rounded-[48px] bg-gradient-to-br from-gold to-yellow-600 p-1 shadow-[0_0_60px_rgba(255,215,0,0.2)] relative z-10">
                <div className="w-full h-full rounded-[44px] bg-dark overflow-hidden flex items-center justify-center p-0.5 relative group">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=FriendLin" className="w-full h-full object-cover rounded-[42px]" alt="Sender" />
                  <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-dark shadow-xl border-4 border-dark">
                  <Heart size={18} fill="currentColor" />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-gold tracking-[0.4em] mb-1">来自 林野 的讯号</h4>
            <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none">邀请你开启「真爱」绑定</h1>
          </div>
        </section>

        {/* Message Content */}
        <section className="relative">
           <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold to-transparent opacity-20"></div>
           <div className="bg-white/5 rounded-[32px] p-8 border border-white/5 relative backdrop-blur-md overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageCircle size={60} />
              </div>
              <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">附带讯息 / Transmitted Note</h4>
              <p className="text-base font-medium leading-[1.8] italic text-white/80">
                “我们从城市声音认识，想把这段关系标记得更正式一点，在每个共创的时刻，你都是唯一的频率。”
              </p>
           </div>
        </section>

        {/* Ritual Cost Disclosure */}
        <div className="p-6 bg-gradient-to-r from-gold/10 to-transparent rounded-2xl space-y-4 border border-gold/10">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold">
                <Gem size={14} />
              </div>
              <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest uppercase">协议说明</h4>
           </div>
           <p className="text-[11px] text-white/50 leading-relaxed italic border-l border-white/10 pl-4">
             确认绑定将消耗对方刚才支付的「星轨戒指」(520 钻石)。真爱关系每位用户仅限一位。绑定后，双方空间将产生永久的数字共鸣标记。
           </p>
        </div>
      </main>

      <footer className="p-8 pb-12 relative z-20 space-y-4">
         <button 
           onClick={() => {
             showToast('恭喜！星轨轨道已对接成功。');
             setTimeout(() => setScreen('me'), 1000);
           }} 
           className="w-full h-16 bg-white rounded-[24px] font-black uppercase text-xs text-dark shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
         >
            <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center gap-2">
              同意并开启共鸣 <Zap size={14} fill="currentColor" />
            </span>
         </button>
         
         <button 
           onClick={() => setScreen('messages')} 
           className="w-full h-14 bg-white/5 border border-white/10 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] text-white/40 active:scale-95 transition-all"
         >
            暂时保持独立轨道
         </button>
      </footer>
    </div>
  );
};
