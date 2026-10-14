interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const AVATAR_COLORS = [
  '#7C3AED', // Violet
  '#2563EB', // Blue
  '#EA580C', // Orange
  '#059669', // Emerald
  '#E11D48', // Rose
  '#9333EA', // Purple
  '#0891B2', // Cyan
  '#D97706', // Amber
  '#DB2777', // Pink
  '#4F46E5', // Indigo
];

function getAvatarColor(name: string, color?: string): string {
  if (color && color !== '#0f172a' && color.trim() !== '') {
    return color;
  }
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function Avatar({ name, color, size = 'md' }: AvatarProps) {
  const initials = (name || '')
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const bgColor = getAvatarColor(name, color);

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white shadow-md shrink-0 select-none ${sizes[size]}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
