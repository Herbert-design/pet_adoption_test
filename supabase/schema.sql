-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL, -- '雄性' | '雌性'
  weight TEXT NOT NULL,
  distance TEXT NOT NULL,
  image TEXT NOT NULL,
  type TEXT NOT NULL, -- 'dog' | 'cat'
  location TEXT NOT NULL,
  personality TEXT[] NOT NULL,
  story TEXT NOT NULL,
  medical_status JSONB NOT NULL,
  status TEXT DEFAULT 'available', -- 'available' | 'adopted'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending' | 'reviewing' | 'approved' | 'rejected'
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  home_area NUMERIC,
  living_count TEXT,
  motivation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, pet_id)
);

-- Create viewing history table
CREATE TABLE IF NOT EXISTS history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create search history table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info' | 'success' | 'alert'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security (RLS)

-- Pets: Everyone can read
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to pets" ON pets FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert pets" ON pets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update pets" ON pets FOR UPDATE USING (auth.role() = 'authenticated');

-- Applications: Users can see and insert their own
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update applications" ON applications FOR UPDATE USING (auth.role() = 'authenticated');

-- Favorites: Users can see and manage their own
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- History: Users can see and manage their own
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own history" ON history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles: Users can see all profiles but only update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Search History: Users can manage their own
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own search history" ON search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own search history" ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own search history" ON search_history FOR DELETE USING (auth.uid() = user_id);

-- Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (new.id, split_part(new.email, '@', 1), 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed Data (Run this in the Supabase SQL Editor to populate with test pets)
INSERT INTO pets (id, name, breed, age, gender, weight, distance, image, type, location, personality, story, medical_status)
VALUES 
('11111111-1111-1111-1111-111111111111', '大福', '金毛寻回犬', '2岁', '雄性', '24kg', '5.2km', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFv5qrzZ9V9iP5UsahqdNLNTea3OE61zOA2W2bN65mPBbC0CwkMvvBkcOv59E-ud8zdl0Ca99s6jyLDWOnXA08eKeZJvUMp7pzOS2FzTE6Mj-cr5Q69bX1h1b3JkG4wyKEmB57iI4Q3aLCrB_w3CuZt1ofjiM9JME5O88uCZcEy3jTeSmRayuxr19JA0sWa6RQQb3x7mNiFRc0PAp7q4Ih6ElpRiFkORj5UP7qFxbAf-M3gwQxPZO1kFEf0xx6DxLXCx2ovO1bre4', 'dog', '上海 · 静安区', ARRAY['温顺友好', '喜欢社交', '受过训练', '安静乖巧'], '大福是一只性格极其温顺的金毛。他在救助中心待了三个月，原本是在城市的公园里被发现的。他非常懂得社交，能和其他狗狗以及小朋友友好相处。', '[{"label": "狂犬病疫苗", "value": "最后接种日期：2023年10月15日"}, {"label": "绝育手术", "value": "状态：已完成"}, {"label": "驱虫处理", "value": "状态：已完成体内外常规驱虫"}]'),
('22222222-2222-2222-2222-222222222222', '黑炭', '中华田园猫', '3个月', '雄性', '1.5kg', '3.1km', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEgS4_dOny8wvCqmnAwHXOH0T3oQ9PxgxTKcSqlhPmbcSJQbodT2M9oRHCbJf9DxlGvtKuWboqRDTczT20yrBKDB3NMs1Cdtj-ipIFEjrb6mTXGJovNPYdTGdePQfe-w6DSs3Ab_1rtyDbSDGJVwqlx8EHs6Tt5inOE8ZSaRk3d4ShoIvcX36Hav71wks_xXtKV0GMS1c_aLC5fV7w_wuR4Pf0ALOL0zPn8grmsgMm_BTSG2NU7FBdF6jXZXbyFNQtaN0xmetslxA', 'cat', '杭州 · 西湖区', ARRAY['活泼好动', '亲人', '爱干净'], '黑炭是在一个雨夜被志愿者发现的，当时它还很小。现在它已经长成了一只健康活泼的小猫，非常期待有一个温暖的家。', '[{"label": "猫三联疫苗", "value": "已接种第一针"}, {"label": "驱虫处理", "value": "已完成"}]'),
('33333333-3333-3333-3333-333333333333', '棉花糖', '布偶猫', '1岁', '雌性', '4kg', '12km', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd16t3byIWUkVFXEwj-Dm5acBGcXrregGWE_lO2irWhM70NYSrCgO5Q1LoQKY8pBSUVfFr6M6z5vz4fPPqE3_Hh8FYdoqBYb2wGz-mnqy15eYKCeUJsKRiezi1q8yURhQ51mmt8MOgO5vjHFMnzEze3IQ4LLxT4qg-bV_p0_m8oPBjpavBKF5t38XOnlHBjrdh3TYoX7H27q1u4eNV4NAFV0G-TMBfwCO-J2pSuQyH4JFVKKLlZJOg1Oh42z8q4hWFjJG7yyZONYY', 'cat', '北京 · 朝阳区', ARRAY['文静', '粘人', '高颜值'], '棉花糖就像它的名字一样柔软。它喜欢静静地待在窗边晒太阳，是一只非常省心的猫咪。', '[{"label": "全套疫苗", "value": "已接种"}, {"label": "绝育手术", "value": "已完成"}]'),
('44444444-4444-4444-4444-444444444444', '布丁', '柯基', '4岁', '雄性', '12kg', '8km', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsM8reF-SXJKa1fINr7PfLvbq_GKmhPXMrmdwJgXUR1Fv6P1MD4O-Jx2C0OW19Uk9Svn7rZ6jzYSdD5pCpkkMSivdEbvnVs2yoAVh9vjH7oPUC3UVFWRjjVJmE0vZ4t-orwMO5SoAyvqBY2HYpzk71TQrrGtm-b_07vf95dND1-rPmtveGVsmdSwRPgVovoQkjjhsFYmfqdVgm-OV7HQRt8SZDuMu6sLBcKgiACwjwMPo05_CpOOsPhrQ31exJgAovooX-POJqq7I', 'dog', '广州 · 天河区', ARRAY['聪明', '贪吃', '短腿可爱'], '布丁是一只非常典型的柯基，虽然腿短但是跑得很快。它非常聪明，已经学会了很多指令。', '[{"label": "年度疫苗", "value": "已接种"}, {"label": "驱虫", "value": "每月定期"}]')
ON CONFLICT (id) DO NOTHING;

-- Notifications: Users can see and update their own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert notifications" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
