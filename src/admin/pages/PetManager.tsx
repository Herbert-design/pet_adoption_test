import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  MapPin, 
  Trash2, 
  Plus, 
  Search, 
  ChevronRight, 
  Upload, 
  X, 
  Check,
  AlertCircle
} from 'lucide-react';
import { getAllPets, Pet, supabase } from '../../types';
import { uploadPetImage } from '../services/R2UploadService';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function PetManager() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: '',
    breed: '',
    age: '',
    gender: '雄性',
    weight: '',
    distance: '0.0km',
    type: 'dog',
    location: '',
    personality: [],
    story: '',
    medicalStatus: [],
    status: 'available'
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    setLoading(true);
    const data = await getAllPets(true);
    setPets(data);
    setLoading(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);
    
    try {
      const result = await uploadPetImage(file);
      setFormData(prev => ({ ...prev, image: result.url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('请上传宠物图片');
      return;
    }

    try {
      const { error } = await supabase
        .from('pets')
        .insert({
          name: formData.name,
          breed: formData.breed,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          distance: formData.distance,
          image: formData.image,
          type: formData.type,
          location: formData.location,
          personality: formData.personality,
          story: formData.story,
          medical_status: formData.medicalStatus,
          status: 'available'
        });

      if (error) throw error;
      
      alert('发布成功！');
      setActiveTab('list');
      loadPets();
      resetForm();
    } catch (error) {
      console.error('Submit failed:', error);
      alert('提交失败，请检查数据');
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setFormData({
      name: '',
      breed: '',
      age: '',
      gender: '雄性',
      weight: '',
      distance: '0.0km',
      type: 'dog',
      location: '',
      personality: [],
      story: '',
      medicalStatus: [],
      status: 'available'
    });
  };

  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant pb-6">
        <div className="flex bg-surface-container rounded-2xl p-1.5 shadow-inner">
          <button 
            onClick={() => setActiveTab('list')}
            className={cn(
              "px-8 py-2.5 rounded-xl font-bold text-sm transition-all",
              activeTab === 'list' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            在册宠物 ({pets.length})
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={cn(
              "px-8 py-2.5 rounded-xl font-bold text-sm transition-all",
              activeTab === 'add' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            登记新宠物
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="relative group w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="搜索宠物名或品种..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-surface-container-high rounded-full pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all font-medium"
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 gap-4"
          >
            {loading ? (
              [...Array(5)].map((_, i) => <div key={i} className="h-24 bg-surface-container rounded-2xl animate-pulse" />)
            ) : filteredPets.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center gap-4 text-on-surface-variant">
                <Dog size={48} className="opacity-20" />
                <p>未找到相关宠物信息</p>
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-3xl border border-outline-variant overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high/50 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">
                    <tr>
                      <th className="px-8 py-4">基本信息</th>
                      <th className="px-8 py-4">品种</th>
                      <th className="px-8 py-4">地区</th>
                      <th className="px-8 py-4">状态</th>
                      <th className="px-8 py-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 italic-none font-sans">
                    {filteredPets.map((pet) => (
                      <tr key={pet.id} className="hover:bg-surface-container/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={pet.image} alt={pet.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm transition-transform group-hover:scale-105" />
                            <div>
                              <div className="font-black text-lg">{pet.name}</div>
                              <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                                {pet.gender === '雄性' ? <span>♂</span> : <span>♀</span>}
                                <span>·</span>
                                <span>{pet.age}</span>
                                <span>·</span>
                                <span>{pet.weight}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-bold bg-surface-container px-3 py-1 rounded-lg text-on-surface-variant">{pet.breed}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant font-medium">
                            <MapPin size={14} className="text-primary" />
                            {pet.location}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                            pet.status === 'available' ? "bg-tertiary-fixed text-on-tertiary-fixed font-bold leading-none" : "bg-surface-container text-on-surface-variant font-medium"
                          )}>
                            {pet.status === 'available' ? '待领养' : '已领养'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><ChevronRight size={20}/></button>
                             <button className="p-2 text-on-surface-variant hover:text-error transition-colors"><Trash2 size={20}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form 
            key="add"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20"
          >
            {/* Left: Image Upload */}
            <div className="space-y-6">
              <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant flex flex-col items-center justify-center relative overflow-hidden group min-h-[420px]">
                {imagePreview ? (
                  <div className="absolute inset-2">
                    <img src={imagePreview} className="w-full h-full object-cover rounded-[2rem]" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => { setImagePreview(null); setFormData(p => ({ ...p, image: '' })); }}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all shadow-xl"
                    >
                      <X size={20} />
                    </button>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm rounded-[2rem]">
                        <div className="flex flex-col items-center gap-3 text-white">
                          <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm font-black uppercase tracking-widest">R2上传中...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                      <Upload className="text-primary" size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">点击上传图片</h4>
                      <p className="text-sm text-on-surface-variant mt-1">支持 JPG, PNG, WebP (最大 5MB)</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  disabled={isUploading}
                />
              </div>

              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant space-y-4">
                <h4 className="font-black text-primary flex items-center gap-2">
                  <AlertCircle size={18} />
                  注意事项
                </h4>
                <ul className="text-xs text-on-surface-variant leading-relaxed space-y-2 list-disc pl-4">
                  <li>图片资源将自动上传至 Cloudflare R2 并返回公开链接。</li>
                  <li>一旦发布，宠物将立即在移动端 App 实时上线。</li>
                  <li>请确保填写的品种和所在地信息准确，以便用户精准搜索。</li>
                </ul>
              </div>
            </div>

            {/* Right: Form Data */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant grid grid-cols-2 gap-8">
                <div className="col-span-2 flex items-center gap-4 mb-2">
                   <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                   <h3 className="text-xl font-headline font-black">核心属性</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">宠物姓名</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    type="text" placeholder="例：大福" 
                    className="w-full h-14 bg-surface-container px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">品种</label>
                   <input 
                    required
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    type="text" placeholder="例：金毛寻回犬 / 狸花猫" 
                    className="w-full h-14 bg-surface-container px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">类型</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'dog' | 'cat'})}
                    className="w-full h-14 bg-surface-container px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all font-medium"
                  >
                    <option value="dog">狗狗</option>
                    <option value="cat">猫咪</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">性别</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as '雄性' | '雌性'})}
                    className="w-full h-14 bg-surface-container px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all font-medium"
                  >
                    <option value="雄性">雄性 (♂)</option>
                    <option value="雌性">雌性 (♀)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">年龄描述</label>
                  <input 
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    type="text" placeholder="例：2岁 / 3个月" 
                    className="w-full h-14 bg-surface-container px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">所在地</label>
                  <input 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    type="text" placeholder="例：上海 · 静安区" 
                    className="w-full h-14 bg-surface-container px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all font-medium" 
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold ml-2">背后的故事</label>
                  <textarea 
                    required
                    value={formData.story}
                    onChange={(e) => setFormData({...formData, story: e.target.value})}
                    placeholder="讲述它的故事，让有缘人更了解它..."
                    className="w-full h-32 bg-surface-container p-6 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all font-medium resize-none text-sm leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                 <button 
                  type="button"
                  onClick={resetForm}
                  className="px-10 py-4 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-all"
                 >
                   取消重置
                 </button>
                 <button 
                   type="submit"
                   disabled={isUploading}
                   className="px-12 py-4 bg-primary text-white rounded-full font-black text-lg shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                 >
                   <Check size={24} />
                   立即发布
                 </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

