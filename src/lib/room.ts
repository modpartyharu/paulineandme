import { supabase } from '@/integrations/supabase/client';

export function generatePairingCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getRoomId(): string | null {
  return localStorage.getItem('room_id');
}

export function getMyRole(): 'user1' | 'user2' | null {
  return localStorage.getItem('my_role') as 'user1' | 'user2' | null;
}

export function isSetupComplete(): boolean {
  return localStorage.getItem('setup_complete') === 'true';
}

const DEFAULT_CATEGORIES = [
  { name_ko: '데이트', name_en: 'Date', name_de: 'Verabredung', color: '#E8728C', sort_order: 0 },
  { name_ko: '업무', name_en: 'Work', name_de: 'Arbeit', color: '#6B8FC4', sort_order: 1 },
  { name_ko: '개인', name_en: 'Personal', name_de: 'Persönlich', color: '#7A9478', sort_order: 2 },
  { name_ko: '기념일', name_en: 'Anniversary', name_de: 'Jubiläum', color: '#C4A45C', sort_order: 3 },
  { name_ko: '약속', name_en: 'Meeting', name_de: 'Treffen', color: '#9B8CC4', sort_order: 4 },
  { name_ko: '건강/병원', name_en: 'Health', name_de: 'Gesundheit', color: '#5CB4B4', sort_order: 5 },
  { name_ko: '가족', name_en: 'Family', name_de: 'Familie', color: '#E8945C', sort_order: 6 },
  { name_ko: '여행', name_en: 'Travel', name_de: 'Reise', color: '#5C9BE8', sort_order: 7 },
  { name_ko: '기타', name_en: 'Other', name_de: 'Sonstiges', color: '#A0A0A0', sort_order: 8 },
];

export async function createRoom(): Promise<{ roomId: string; pairingCode: string }> {
  const pairingCode = generatePairingCode();
  const { data, error } = await supabase
    .from('rooms')
    .insert({ pairing_code: pairingCode })
    .select()
    .single();

  if (error || !data) throw new Error('Failed to create room');

  // Insert default categories
  await supabase.from('categories').insert(
    DEFAULT_CATEGORIES.map(c => ({ ...c, room_id: data.id }))
  );

  localStorage.setItem('room_id', data.id);
  localStorage.setItem('my_role', 'user1');

  return { roomId: data.id, pairingCode };
}

export async function joinRoom(code: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('id')
    .eq('pairing_code', code)
    .single();

  if (error || !data) return null;

  localStorage.setItem('room_id', data.id);
  localStorage.setItem('my_role', 'user2');

  return data.id;
}

export async function saveProfile(roomId: string, role: string, profile: {
  name: string;
  gender: string;
  birth_date?: string;
  profile_color: string;
  avatar_url?: string;
}) {
  const { error } = await supabase.from('profiles').insert({
    room_id: roomId,
    role,
    name: profile.name,
    gender: profile.gender,
    birth_date: profile.birth_date || null,
    profile_color: profile.profile_color,
    avatar_url: profile.avatar_url || null,
  });

  if (error) throw error;
}

export async function uploadAvatar(roomId: string, role: string, file: File): Promise<string> {
  const path = `${roomId}/${role}.jpg`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}
