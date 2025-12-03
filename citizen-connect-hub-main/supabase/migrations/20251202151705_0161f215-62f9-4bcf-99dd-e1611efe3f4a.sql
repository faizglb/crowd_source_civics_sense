-- Create enum types
CREATE TYPE public.complaint_status AS ENUM ('pending', 'assigned', 'in_progress', 'resolved');
CREATE TYPE public.complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.complaint_category AS ENUM ('roads', 'water_supply', 'electricity', 'sanitation', 'street_lights', 'others');
CREATE TYPE public.user_role AS ENUM ('citizen', 'admin', 'department_head', 'field_officer');

-- Departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_handled complaint_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Profiles table for all users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'citizen',
  department_id UUID REFERENCES public.departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category complaint_category NOT NULL,
  description TEXT NOT NULL,
  text_from_voice TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  address TEXT,
  status complaint_status DEFAULT 'pending',
  priority complaint_priority DEFAULT 'medium',
  department_id UUID REFERENCES public.departments(id),
  assigned_to UUID REFERENCES auth.users(id),
  expected_resolution_date DATE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Media table for complaint attachments
CREATE TABLE public.complaint_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Status updates/history table
CREATE TABLE public.status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  status complaint_status NOT NULL,
  remarks TEXT,
  updated_by UUID REFERENCES auth.users(id),
  before_photo_url TEXT,
  after_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_updates ENABLE ROW LEVEL SECURITY;

-- Departments policies (public read)
CREATE POLICY "Departments are viewable by everyone" ON public.departments FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Complaints policies
CREATE POLICY "Anyone can view complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create complaints" ON public.complaints FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own complaints" ON public.complaints FOR UPDATE USING (auth.uid() = user_id);

-- Media policies
CREATE POLICY "Anyone can view complaint media" ON public.complaint_media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add media" ON public.complaint_media FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Status updates policies
CREATE POLICY "Anyone can view status updates" ON public.status_updates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add status updates" ON public.status_updates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate unique complaint ID
CREATE OR REPLACE FUNCTION public.generate_complaint_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.complaint_id := 'CMP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Trigger for complaint ID generation
CREATE TRIGGER generate_complaint_id_trigger
  BEFORE INSERT ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.generate_complaint_id();

-- Insert default departments
INSERT INTO public.departments (name, category_handled) VALUES
  ('Roads & Infrastructure', 'roads'),
  ('Water Supply Department', 'water_supply'),
  ('Electricity Board', 'electricity'),
  ('Sanitation Department', 'sanitation'),
  ('Street Lighting Division', 'street_lights'),
  ('General Services', 'others');

-- Enable realtime for complaints
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;