export const api_base_url = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
];

export const getAvatarForUser = (user, fallback = DEFAULT_AVATARS[0]) => {
  const raw = user?.avatar || user?.profilePic || user?.image;
  if (typeof raw === 'string' && raw.trim()) {
    return raw;
  }

  const seed = (user?._id || user?.username || user?.email || 'guest').toString();
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % DEFAULT_AVATARS.length;
  return DEFAULT_AVATARS[index] || fallback;
};