-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pairing_code text UNIQUE NOT NULL,
  theme text DEFAULT 'blush',
  anniversary_date date,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  role text CHECK (role IN ('user1','user2')) NOT NULL,
  name text NOT NULL,
  gender text CHECK (gender IN ('male','female','other')) DEFAULT 'other',
  birth_date date,
  profile_color text NOT NULL DEFAULT '#E8A598',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, role)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  name_ko text NOT NULL,
  name_en text NOT NULL,
  name_de text NOT NULL,
  color text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  created_by text CHECK (created_by IN ('user1','user2')) NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  all_day boolean DEFAULT false,
  person_tag text CHECK (person_tag IN ('user1','user2','both')) NOT NULL,
  category_id uuid REFERENCES public.categories,
  location text,
  reminder_minutes int,
  recurrence text DEFAULT 'none',
  recurrence_days text[],
  recurrence_end_date date,
  is_shift boolean DEFAULT false,
  shift_label text,
  completed boolean DEFAULT false,
  color_override text,
  is_new_for_user1 boolean DEFAULT false,
  is_new_for_user2 boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  created_by text CHECK (created_by IN ('user1','user2')) NOT NULL,
  title text NOT NULL,
  due_date timestamptz,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  person_tag text CHECK (person_tag IN ('user1','user2','both')) NOT NULL,
  priority text DEFAULT 'medium',
  category_id uuid REFERENCES public.categories,
  recurrence text DEFAULT 'none',
  is_new_for_user1 boolean DEFAULT false,
  is_new_for_user2 boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create key_dates table
CREATE TABLE IF NOT EXISTS public.key_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  title text NOT NULL,
  date date NOT NULL,
  repeat_yearly boolean DEFAULT true,
  key_date_type text DEFAULT 'custom',
  show_dday boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  created_by text CHECK (created_by IN ('user1','user2')) NOT NULL,
  title text DEFAULT '',
  content jsonb,
  person_tag text DEFAULT 'both',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  sender text CHECK (sender IN ('user1','user2')) NOT NULL,
  content text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create lists table
CREATE TABLE IF NOT EXISTS public.lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  name text NOT NULL,
  list_type text DEFAULT 'checklist',
  person_tag text DEFAULT 'both',
  created_at timestamptz DEFAULT now()
);

-- Create list_items table
CREATE TABLE IF NOT EXISTS public.list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES public.lists ON DELETE CASCADE,
  title text NOT NULL,
  checked boolean DEFAULT false,
  quantity text,
  category text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create buckets table
CREATE TABLE IF NOT EXISTS public.buckets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms ON DELETE CASCADE,
  created_by text CHECK (created_by IN ('user1','user2')) NOT NULL,
  title text NOT NULL,
  emoji text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create bucket_items table
CREATE TABLE IF NOT EXISTS public.bucket_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id uuid REFERENCES public.buckets ON DELETE CASCADE,
  title text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Disable RLS on all tables (no auth, pairing code system)
ALTER TABLE public.rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_dates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucket_items DISABLE ROW LEVEL SECURITY;

-- Enable realtime on all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.key_dates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lists;
ALTER PUBLICATION supabase_realtime ADD TABLE public.list_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.buckets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bucket_items;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();