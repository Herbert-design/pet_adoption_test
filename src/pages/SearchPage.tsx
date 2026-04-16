import React, { useState, useEffect } from 'react';
import { Search, History, Lock, ArrowRight, Loader2, X, Trash2, Ghost } from 'lucide-react';
import { PetCardSkeleton } from '@/src/components/Skeleton';
import { Pet, getAllPets, getHistoryList, saveSearchQuery, getPersistentSearchHistory, deleteSearchHistory } from '@/src/types';
import { PetCard } from '@/src/components/PetCard';
import { TopAppBar, BottomNavBar } from '@/src/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/src/lib/utils';

export function SearchPage() {
  const navigate = useNavigate();
  const { authenticated, loading: authLoading } = useAuth();
  const [query, setQuery] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [persistentHistory, setPersistentHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearchData = async () => {
      setLoading(true);
      try {
        const fetchedPets = await getAllPets();
        setPets(fetchedPets);
        
        if (authenticated) {
          const [fetchedHistoryIds, fetchedPersistentHistory] = await Promise.all([
            getHistoryList(),
            getPersistentSearchHistory()
          ]);
          setHistoryIds(fetchedHistoryIds);
          setPersistentHistory(fetchedPersistentHistory);
        }
      } catch (error) {
        console.error('Failed to load search data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSearchData();
  }, [authenticated]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await saveSearchQuery(query.trim());
      const updatedHistory = await getPersistentSearchHistory();
      setPersistentHistory(updatedHistory);
    }
  };

  const handleHistoryClick = (item: string) => {
    setQuery(item);
  };

  const handleDeleteHistoryItem = async (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    await deleteSearchHistory(item);
    setPersistentHistory(prev => prev.filter(i => i !== item));
  };

  const clearAllHistory = async () => {
    await deleteSearchHistory();
    setPersistentHistory([]);
  };

  const filteredPets = pets.filter(pet => 
    pet.name.includes(query) || 
    pet.breed.includes(query) || 
    pet.personality.some(p => p.includes(query))
  );

  const viewedPets = pets.filter(pet => historyIds.includes(pet.id));

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen pb-32 bg-surface">
        <TopAppBar title="搜索发现" />
        <main className="pt-32 px-6 max-w-2xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center">
            <Lock className="text-secondary" size={48} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">登录后查看搜索历史</h2>
            <p className="text-on-surface-variant leading-relaxed">
              登录后，我们将为您保存搜索偏好和浏览记录，帮助您更快找到心仪的伙伴。
            </p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="w-full h-16 bg-primary text-white rounded-full font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            立即登录
            <ArrowRight size={20} />
          </button>
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-surface text-on-surface">
      <TopAppBar title="搜索发现" />
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <section className="mb-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-surface-container-high border-none rounded-default focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder-on-surface-variant/60 shadow-sm" 
              placeholder="搜索品种、性格或地点..." 
              type="text" 
            />
            {query && (
              <button 
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </form>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Search History Chips */}
            {query === '' && persistentHistory && persistentHistory.length > 0 && (
              <section className="animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant/60">历史搜索</h3>
                  <button 
                    onClick={clearAllHistory}
                    className="p-1 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {persistentHistory?.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleHistoryClick(item)}
                      className="group flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest rounded-full transition-all cursor-pointer border border-on-surface-variant/5"
                    >
                      <span className="text-sm font-medium">{item}</span>
                      <button 
                        onClick={(e) => handleDeleteHistoryItem(e, item)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-error/10 hover:text-error rounded-full transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Viewed Pets Section */}
            {query === '' && viewedPets.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <History size={18} className="text-primary" />
                  <h3 className="text-lg font-bold">最近浏览</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                  {viewedPets.map(pet => (
                    <div key={pet.id} className="min-w-[160px] w-[160px]">
                      <PetCard pet={pet} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty View State */}
            {query === '' && viewedPets.length === 0 && persistentHistory.length === 0 && (
               <section className="py-20 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30 text-center animate-in fade-in zoom-in-95">
               <div className="flex flex-col items-center space-y-4">
                 <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center">
                   <Search size={32} className="text-on-surface-variant/20" />
                 </div>
                 <div className="space-y-1">
                   <p className="font-bold text-on-surface text-lg">开始探索</p>
                   <p className="text-sm text-on-surface-variant">输入关键词，寻找您的下一位毛孩子伙伴</p>
                 </div>
               </div>
             </section>
            )}

            {/* Search Results */}
            <section className={cn("animate-in fade-in slide-in-from-bottom-4 duration-700", query === '' ? "mt-4" : "")}>
              <h3 className="text-xl font-bold mb-6">
                {query ? (
                  <>找到 <span className="text-primary">{filteredPets.length}</span> 个结果</>
                ) : (
                  '推荐给您的伙伴'
                )}
              </h3>
              
              {query && filteredPets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
                  <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center animate-bounce duration-[2000ms]">
                    <Ghost className="text-on-surface-variant/40" size={40} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-on-surface">没找到相关的毛孩子</p>
                    <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
                      换个关键词（比如“狗狗”、“猫咪”）试试，或者探索其他品种。
                    </p>
                  </div>
                  <button 
                    onClick={() => setQuery('')}
                    className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-full transition-all hover:bg-primary/20 active:scale-95"
                  >
                    清除搜索条件
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {filteredPets.map(pet => (
                    <div key={pet.id} className="animate-in fade-in zoom-in-95 duration-500">
                      <PetCard pet={pet} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <BottomNavBar />
    </div>
  );
}
