export interface Profile {
  id: string;
  room_id: string;
  role: 'user1' | 'user2';
  name: string;
  gender: 'male' | 'female' | 'other';
  birth_date: string | null;
  profile_color: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Room {
  id: string;
  pairing_code: string;
  theme: string;
  anniversary_date: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  room_id: string;
  created_by: 'user1' | 'user2';
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  all_day: boolean;
  person_tag: 'user1' | 'user2' | 'both';
  category_id: string | null;
  location: string | null;
  reminder_minutes: number | null;
  recurrence: string;
  color_override: string | null;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: string;
  room_id: string;
  created_by: 'user1' | 'user2';
  title: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  person_tag: 'user1' | 'user2' | 'both';
  priority: string;
  category_id: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  room_id: string;
  name_ko: string;
  name_en: string;
  name_de: string;
  color: string;
  sort_order: number;
}

export interface KeyDate {
  id: string;
  room_id: string;
  title: string;
  date: string;
  repeat_yearly: boolean;
  key_date_type: string;
  show_dday: boolean;
  image_url: string | null;
}

export interface Message {
  id: string;
  room_id: string;
  sender: 'user1' | 'user2';
  content: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  room_id: string;
  created_by: 'user1' | 'user2';
  title: string;
  content: any;
  person_tag: string;
  updated_at: string;
  created_at: string;
}
