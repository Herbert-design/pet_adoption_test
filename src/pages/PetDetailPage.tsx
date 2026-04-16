import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Weight, Syringe, MapPin, ShieldCheck, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { Pet, getPetById, toggleFavoritePet, getFavoritesList, addToHistoryList, checkIfAppliedForPet } from '@/src/types';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';

export function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { authenticated } = useAuth();

  useEffect(() => {
    const loadPet = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const fetchedPet = await getPetById(id);
        if (fetchedPet) {
          setPet(fetchedPet);
          // Only if authenticated, check favorite status and add to history
          if (authenticated) {
            const favs = await getFavoritesList();
            setIsFav(favs.includes(id));
            await addToHistoryList(id);
            
            // Check application status
            const applied = await checkIfAppliedForPet(id);
            setHasApplied(applied);
          }
        }
      } catch (error) {
        console.error('Failed to load pet detail:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPet();
  }, [id, authenticated]);

  const handleToggleFavorite = async () => {
    if (!authenticated) {
      navigate('/login');
      return;
    }
    if (id) {
      const newFavs = await toggleFavoritePet(id);
      setIsFav(newFavs.includes(id));
    }
  };

  const handleAdopt = () => {
    if (!authenticated) {
      navigate('/login');
    } else if (hasApplied) {
      navigate('/applications');
    } else {
      navigate(`/apply/${pet?.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">未找到毛孩子</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-primary font-bold"
        >
          返回发现页
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-32">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16 z-50 bg-surface/80 backdrop-blur-xl">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleToggleFavorite}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full transition-all",
              isFav ? "bg-primary text-white" : "bg-surface-container hover:bg-surface-container-high text-primary"
            )}
          >
            <Heart size={20} className={isFav ? "fill-current" : ""} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-all">
            <Share2 className="text-primary" size={20} />
          </button>
        </div>
      </header>

      <main>
        <div className="relative w-full h-[530px] overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            src={pet.image} 
            alt={pet.name}
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-surface to-transparent"></div>
        </div>

        <div className="px-6 -mt-16 relative z-10 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_rgba(34,26,19,0.06)] mb-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold font-headline tracking-tight text-on-surface mb-2">{pet.name}</h1>
                <p className="text-on-surface-variant font-medium tracking-wide">{pet.breed} · {pet.age} · {pet.gender}</p>
              </div>
              <div className="bg-tertiary/10 text-tertiary px-4 py-2 rounded-full flex items-center gap-2">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold tracking-wider">已通过健康审核</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col items-center text-center">
                <Weight className="text-primary mb-2" size={20} />
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">体重</span>
                <span className="text-on-surface font-semibold">{pet.weight}</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col items-center text-center">
                <Syringe className="text-primary mb-2" size={20} />
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">疫苗</span>
                <span className="text-on-surface font-semibold">已接种</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col items-center text-center">
                <MapPin className="text-primary mb-2" size={20} />
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">距离</span>
                <span className="text-on-surface font-semibold">{pet.distance}</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                性格特点
              </h2>
              <div className="flex flex-wrap gap-3">
                {pet.personality.map(tag => (
                  <span key={tag} className="bg-primary-fixed px-4 py-2 rounded-full text-on-primary-fixed text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                关于{pet.name}
              </h2>
              <div className="text-on-surface-variant leading-relaxed text-lg font-normal space-y-4">
                {pet.story.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            <section className="bg-surface-container p-6 rounded-lg">
              <h2 className="text-xl font-bold text-tertiary mb-4 flex items-center gap-2">
                <CheckCircle2 size={24} />
                健康与医疗状态
              </h2>
              <ul className="space-y-4">
                {pet.medicalStatus.map((status, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-tertiary mt-1" size={16} />
                    <div className="flex-1">
                      <p className="text-on-surface font-semibold">{status.label}</p>
                      <p className="text-on-surface-variant text-sm">{status.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-xl px-6 pt-4 pb-8 flex items-center gap-4 z-50">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-surface-container text-primary hover:bg-surface-container-high transition-all"
        >
          <MessageCircle size={24} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdopt}
          className={cn(
            "flex-1 h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_12px_32px_rgba(143,78,0,0.25)]",
            hasApplied 
              ? "bg-surface-container-high text-primary border border-primary/20" 
              : "bg-gradient-to-br from-primary to-primary-container text-white"
          )}
        >
          <span>{hasApplied ? '已提交申请，查看进度' : '立即领养'}</span>
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
