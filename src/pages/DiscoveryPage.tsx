import { Search, LayoutGrid, Dog, Cat, Sparkles } from 'lucide-react';
import { Pet, getAllPets, getFavoritesList } from '@/src/types';
import { PetCard } from '@/src/components/PetCard';
import { TopAppBar, BottomNavBar } from '@/src/components/Navigation';
import { PetCardSkeleton } from '@/src/components/Skeleton';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function DiscoveryPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filter, setFilter] = useState<'all' | 'dog' | 'cat'>('all');
  const [favIds, setFavIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedPets, fetchedFavs] = await Promise.all([
          getAllPets(),
          getFavoritesList()
        ]);
        setPets(fetchedPets);
        setFavIds(fetchedFavs);
      } catch (error) {
        console.error('Failed to load discovery data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPets = pets.filter(pet => filter === 'all' || pet.type === filter);
  const recommendedPets = pets.filter(pet => favIds.includes(pet.id)).slice(0, 2);

  return (
    <div className="min-h-screen pb-32">
      <TopAppBar title="发现 Sanctuary" />
      <main className="pt-20 px-6 max-w-7xl mx-auto">
        <section className="mb-10 pt-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter mb-4">
            寻找你的<span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">命中注定</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-md">在宠愈，每一个生命都值得被温柔以待。开启您的领养之旅，给TA一个温暖的家。</p>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 min-h-[400px]">
            {[...Array(6)].map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {recommendedPets.length > 0 && (
              <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-primary" />
                  <h3 className="text-lg font-bold">为您推荐</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {recommendedPets.map(pet => (
                    <div key={pet.id} className="min-w-[280px] w-[280px]">
                      <PetCard pet={pet} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="sticky top-16 z-40 mb-10 bg-surface/80 backdrop-blur-md py-4 -mx-6 px-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input 
                    onClick={() => navigate('/search')}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-default focus:ring-2 focus:ring-primary cursor-pointer transition-all text-on-surface placeholder-on-surface-variant/60" 
                    placeholder="搜索品种、性格或地点..." 
                    type="text" 
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                  {(['all', 'dog', 'cat'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap",
                        filter === t 
                          ? "bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/20" 
                          : "bg-surface-container-highest hover:bg-surface-container-high text-on-surface"
                      )}
                    >
                      {t === 'all' ? <LayoutGrid size={16} /> : t === 'dog' ? <Dog size={16} /> : <Cat size={16} />}
                      <span>{t === 'all' ? '全部' : t === 'dog' ? '狗狗' : '猫咪'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filteredPets.map(pet => (
                <div key={pet.id}>
                  <PetCard pet={pet} />
                </div>
              ))}
            </div>
            
            {filteredPets.length === 0 && (
              <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                <p className="text-on-surface-variant">暂无符合条件的毛孩子</p>
              </div>
            )}
          </>
        )}
      </main>
      <BottomNavBar />
    </div>
  );
}
