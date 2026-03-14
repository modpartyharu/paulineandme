import React from 'react';
import type { Profile } from '@/lib/types';

interface AvatarCircleProps {
  profile: Profile;
  size?: number;
}

const AvatarCircle: React.FC<AvatarCircleProps> = ({ profile, size = 32 }) => {
  const initials = profile.name.slice(0, 1).toUpperCase();
  const genderIcon = profile.gender === 'male' ? '♂' : profile.gender === 'female' ? '♀' : '';

  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center font-medium"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: profile.profile_color,
        color: 'white',
        fontSize: size * 0.4,
      }}
    >
      {initials}
      {genderIcon && <span style={{ fontSize: size * 0.25, marginLeft: 1 }}>{genderIcon}</span>}
    </div>
  );
};

export default AvatarCircle;
