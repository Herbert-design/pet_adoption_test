import { supabase } from './lib/supabase';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: '雄性' | '雌性';
  weight: string;
  distance: string;
  image: string;
  type: 'dog' | 'cat';
  location: string;
  personality: string[];
  story: string;
  medicalStatus: {
    label: string;
    value: string;
  }[];
}

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string;
  updated_at: string;
}

// Local fallback for development/safety
export const PETS: Pet[] = [
  {
    id: '1',
    name: '大福',
    breed: '金毛寻回犬',
    age: '2岁',
    gender: '雄性',
    weight: '24kg',
    distance: '5.2km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFv5qrzZ9V9iP5UsahqdNLNTea3OE61zOA2W2bN65mPBbC0CwkMvvBkcOv59E-ud8zdl0Ca99s6jyLDWOnXA08eKeZJvUMp7pzOS2FzTE6Mj-cr5Q69bX1h1b3JkG4wyKEmB57iI4Q3aLCrB_w3CuZt1ofjiM9JME5O88uCZcEy3jTeSmRayuxr19JA0sWa6RQQb3x7mNiFRc0PAp7q4Ih6ElpRiFkORj5UP7qFxbAf-M3gwQxPZO1kFEf0xx6DxLXCx2ovO1bre4',
    type: 'dog',
    location: '上海 · 静安区',
    personality: ['温顺友好', '喜欢社交', '受过训练', '安静乖巧'],
    story: '大福是一只性格极其温顺的金毛。他在救助中心待了三个月，原本是在城市的公园里被发现的。他非常懂得社交，能和其他狗狗以及小朋友友好相处。',
    medicalStatus: [
      { label: '狂犬病疫苗', value: '最后接种日期：2023年10月15日' },
      { label: '绝育手术', value: '状态：已完成' },
      { label: '驱虫处理', value: '状态：已完成体内外常规驱虫' }
    ]
  },
  {
    id: '2',
    name: '黑炭',
    breed: '中华田园猫',
    age: '3个月',
    gender: '雄性',
    weight: '1.5kg',
    distance: '3.1km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEgS4_dOny8wvCqmnAwHXOH0T3oQ9PxgxTKcSqlhPmbcSJQbodT2M9oRHCbJf9DxlGvtKuWboqRDTczT20yrBKDB3NMs1Cdtj-ipIFEjrb6mTXGJovNPYdTGdePQfe-w6DSs3Ab_1rtyDbSDGJVwqlx8EHs6Tt5inOE8ZSaRk3d4ShoIvcX36Hav71wks_xXtKV0GMS1c_aLC5fV7w_wuR4Pf0ALOL0zPn8grmsgMm_BTSG2NU7FBdF6jXZXbyFNQtaN0xmetslxA',
    type: 'cat',
    location: '杭州 · 西湖区',
    personality: ['活泼好动', '亲人', '爱干净'],
    story: '黑炭是在一个雨夜被志愿者发现的，当时它还很小。现在它已经长成了一只健康活泼的小猫，非常期待有一个温暖的家。',
    medicalStatus: [
      { label: '猫三联疫苗', value: '已接种第一针' },
      { label: '驱虫处理', value: '已完成' }
    ]
  },
  {
    id: '3',
    name: '棉花糖',
    breed: '布偶猫',
    age: '1岁',
    gender: '雌性',
    weight: '4kg',
    distance: '12km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd16t3byIWUkVFXEwj-Dm5acBGcXrregGWE_lO2irWhM70NYSrCgO5Q1LoQKY8pBSUVfFr6M6z5vz4fPPqE3_Hh8FYdoqBYb2wGz-mnqy15eYKCeUJsKRiezi1q8yURhQ51mmt8MOgO5vjHFMnzEze3IQ4LLxT4qg-bV_p0_m8oPBjpavBKF5t38XOnlHBjrdh3TYoX7H27q1u4eNV4NAFV0G-TMBfwCO-J2pSuQyH4JFVKKLlZJOg1Oh42z8q4hWFjJG7yyZONYY',
    type: 'cat',
    location: '北京 · 朝阳区',
    personality: ['文静', '粘人', '高颜值'],
    story: '棉花糖就像它的名字一样柔软。它喜欢静静地待在窗边晒太阳，是一只非常省心的猫咪。',
    medicalStatus: [
      { label: '全套疫苗', value: '已接种' },
      { label: '绝育手术', value: '已完成' }
    ]
  },
  {
    id: '4',
    name: '布丁',
    breed: '柯基',
    age: '4岁',
    gender: '雄性',
    weight: '12kg',
    distance: '8km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsM8reF-SXJKa1fINr7PfLvbq_GKmhPXMrmdwJgXUR1Fv6P1MD4O-Jx2C0OW19Uk9Svn7rZ6jzYSdD5pCpkkMSivdEbvnVs2yoAVh9vjH7oPUC3UVFWRjjVJmE0vZ4t-orwMO5SoAyvqBY2HYpzk71TQrrGtm-b_07vf95dND1-rPmtveGVsmdSwRPgVovoQkjjhsFYmfqdVgm-OV7HQRt8SZDuMu6sLBcKgiACwjwMPo05_CpOOsPhrQ31exJgAovooX-POJqq7I',
    type: 'dog',
    location: '广州 · 天河区',
    personality: ['聪明', '贪吃', '短腿可爱'],
    story: '布丁是一只非常典型的柯基，虽然腿短但是跑得很快。它非常聪明，已经学会了很多指令。',
    medicalStatus: [
      { label: '年度疫苗', value: '已接种' },
      { label: '驱虫', value: '每月定期' }
    ]
  }
];

// Profile Fetchers
export const getMyProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

export const updateMyProfile = async (updates: Partial<Profile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not logged in');

  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) throw error;
};

// Database Fetchers
export const getAllPets = async (): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pets:', error);
    return PETS; 
  }

  if (!data || data.length === 0) {
    return PETS;
  }

  return data.map(p => ({
    ...p,
    medicalStatus: p.medical_status
  }));
};

export const getPetById = async (id: string): Promise<Pet | null> => {
  const localPet = PETS.find(p => p.id === id);
  
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return localPet || null;
  }

  return {
    ...data,
    medicalStatus: data.medical_status
  };
};

// Storage Helpers
export const getFavoritesList = async (): Promise<string[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('pet_id')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data.map(f => f.pet_id);
};

export const toggleFavoritePet = async (petId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const favs = await getFavoritesList();
  const isFav = favs.includes(petId);

  if (isFav) {
    await supabase
      .from('favorites')
      .delete()
      .match({ user_id: user.id, pet_id: petId });
  } else {
    await supabase
      .from('favorites')
      .insert({ user_id: user.id, pet_id: petId });
  }

  return getFavoritesList();
};

export const getHistoryList = async (): Promise<string[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('history')
    .select('pet_id')
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }

  return data.map(h => h.pet_id);
};

export const addToHistoryList = async (petId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('history')
    .insert({ user_id: user.id, pet_id: petId });
};

// Search History Helpers
export const saveSearchQuery = async (query: string) => {
  if (!query.trim()) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Avoid duplicates in recent history
  await supabase
    .from('search_history')
    .delete()
    .match({ user_id: user.id, query: query.trim() });

  await supabase
    .from('search_history')
    .insert({ user_id: user.id, query: query.trim() });
};

export const getPersistentSearchHistory = async (): Promise<string[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('search_history')
    .select('query')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return [];
  return data.map(h => h.query);
};

export const deleteSearchHistory = async (query?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (query) {
    await supabase
      .from('search_history')
      .delete()
      .match({ user_id: user.id, query });
  } else {
    await supabase
      .from('search_history')
      .delete()
      .eq('user_id', user.id);
  }
};

// Auth Helpers
export const checkAuthStatus = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const checkIfAppliedForPet = async (petId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('pet_id', petId);

  if (error) return false;
  return (count || 0) > 0;
};

// Application Types
export interface AdoptionApplication {
  id: string;
  petId: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  date: string;
  pet?: Pet;
  details?: {
    fullName: string;
    phone: string;
    email: string;
    homeArea: number;
    livingCount: string;
    motivation: string;
  };
}

export const getApplicationsList = async (): Promise<AdoptionApplication[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('applications')
    .select('*, pets(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return data.map(app => ({
    id: app.id,
    petId: app.pet_id,
    status: app.status,
    date: new Date(app.created_at).toISOString().split('T')[0].replace(/-/g, '.'),
    pet: app.pets ? {
      ...app.pets,
      medicalStatus: app.pets.medical_status
    } : undefined,
    details: {
      fullName: app.full_name,
      phone: app.phone,
      email: app.email,
      homeArea: Number(app.home_area) || 0,
      livingCount: app.living_count,
      motivation: app.motivation
    }
  }));
};

export const submitAdoptionApplication = async (application: { petId: string, details: any }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in');

  const { error } = await supabase
    .from('applications')
    .insert({
      pet_id: application.petId,
      user_id: user.id,
      full_name: application.details.fullName || application.details.name,
      phone: application.details.phone,
      email: application.details.email,
      home_area: Number(application.details.homeArea) || 0,
      living_count: application.details.livingCount,
      motivation: application.details.motivation,
      status: 'pending'
    });

  if (error) throw error;
};

// Legacy Exports
export const getFavorites = () => {
    console.warn('getFavorites is deprecated. Use getFavoritesList (async)');
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) as string[] : [];
};

export const toggleFavorite = (id: string) => {
    console.warn('toggleFavorite is deprecated. Use toggleFavoritePet (async)');
    const favs = getFavorites();
    const isFav = favs.includes(id);
    const newFavs = isFav 
      ? favs.filter(f => f !== id) 
      : [...favs, id];
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    return newFavs;
};

export const isLoggedIn = () => {
    console.warn('isLoggedIn is deprecated. Use checkAuthStatus (async)');
    return localStorage.getItem('isLoggedIn') === 'true';
};

export const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
};

export const logout = () => {
    localStorage.removeItem('isLoggedIn');
    supabase.auth.signOut();
};
