import { Heart, Sparkles, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { Pet, getAllPets, getFavoritesList } from '@/src/types';
import { PetCard } from '@/src/components/PetCard';
import { TopAppBar, BottomNavBar } from '@/src/components/Navigation';
import { PetCardSkeleton } from '@/src/components/Skeleton';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdoptPage() {
  const navigate = useNavigate();
  const { authenticated, loading: authLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authenticated) {
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
          console.error('Failed to load adopt page data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [authenticated]);

  const favoritePets = pets.filter(pet => favIds.includes(pet.id));
  const otherPets = pets.filter(pet => !favIds.includes(pet.id));

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen pb-32 bg-surface">
        <TopAppBar title="领养中心" />
        <main className="pt-32 px-6 max-w-2xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="text-primary" size={48} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">登录后查看领养建议</h2>
            <p className="text-on-surface-variant leading-relaxed">
              登录账户后，我们将根据您的收藏和喜好，为您精准推荐最适合您的毛孩子伙伴。
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
    <div className="min-h-screen pb-32">
      <TopAppBar title="领养中心" />
      <main className="pt-24 px-6 max-w-7xl mx-auto text-on-surface">
        <section className="mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-primary-container/10 p-8 rounded-xl border border-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-headline font-bold text-primary mb-2">开启领养之旅</h2>
              <p className="text-on-surface-variant max-w-md">在这里，您可以找到最适合您的毛孩子。我们优先为您推荐您感兴趣的伙伴。</p>
            </div>
            <Sparkles className="absolute right-4 top-4 text-primary/20" size={80} />
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 min-h-[400px]">
            {[...Array(6)].map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {favoritePets.length > 0 ? (
              <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Heart size={20} className="text-primary fill-current" />
                    <h3 className="text-xl font-bold">优先推荐 (已收藏)</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {favoritePets.map(pet => (
                    <div key={pet.id}>
                      <PetCard pet={pet} />
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="mb-12 bg-surface-container-low p-10 rounded-2xl border border-dashed border-outline-variant/30 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Heart size={40} className="text-on-surface-variant/20" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-on-surface">暂无收藏推荐</h4>
                    <p className="text-sm text-on-surface-variant">收藏您心仪的毛孩子，我们将在这里为您优先展示。</p>
                  </div>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-primary text-sm font-bold"
                  >
                    去发现
                  </button>
                </div>
              </section>
            )}

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck size={20} className="text-tertiary" />
                <h3 className="text-xl font-bold">待领养伙伴</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {otherPets.map(pet => (
                  <div key={pet.id}>
                    <PetCard pet={pet} />
                  </div>
                ))}
              </div>
              {otherPets.length === 0 && (
                 <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                 <p className="text-on-surface-variant">暂无其它伙伴</p>
               </div>
              )}
            </section>
          </>
        )}
      </main>
      <BottomNavBar />
    </div>
  );
}
