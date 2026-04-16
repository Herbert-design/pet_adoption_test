import { Link } from 'react-router-dom';
import { MapPin, Info, Heart, ArrowRight } from 'lucide-react';
import { Pet } from '@/src/types';
import { motion } from 'motion/react';

export function PetCard({ pet }: { pet: Pet }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_12px_32px_rgba(34,26,19,0.04)] hover:shadow-[0_24px_48px_rgba(34,26,19,0.1)] transition-all duration-500 border border-outline-variant/10"
    >
      <Link to={`/pet/${pet.id}`}>
        <div className="aspect-[4/5] overflow-hidden relative">
          <img 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            src={pet.image} 
            alt={pet.name}
            referrerPolicy="no-referrer"
          />
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={
              `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md ${
                pet.type === 'dog' ? 'bg-primary/80' : 'bg-secondary/80'
              }`
            }>
              {pet.type === 'dog' ? '狗狗' : '猫咪'}
            </div>
            {pet.gender === '雄性' ? (
              <div className="bg-blue-500/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">♂</div>
            ) : (
              <div className="bg-pink-500/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">♀</div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <p className="text-white text-xs font-medium line-clamp-2">{pet.personality.join(' · ')}</p>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg md:text-2xl font-headline font-bold text-on-surface truncate group-hover:text-primary transition-colors">{pet.name}</h3>
            <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant">{pet.age}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-on-surface-variant mb-4 md:mb-6">
            <MapPin size={14} className="text-primary/60" />
            <span className="text-xs font-medium truncate opacity-80">{pet.location}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
             <div className="h-10 px-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all w-full">
               立即领养
               <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
