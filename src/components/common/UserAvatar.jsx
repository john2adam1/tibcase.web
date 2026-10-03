import React from 'react';

const PALETTE = [
  ['#FEE2E2', '#B91C1C'],
  ['#FFEDD5', '#C2410C'],
  ['#FEF3C7', '#B45309'],
  ['#DCFCE7', '#15803D'],
  ['#CFFAFE', '#0E7490'],
  ['#DBEAFE', '#1D4ED8'],
  ['#EDE9FE', '#6D28D9'],
  ['#FCE7F3', '#BE185D'],
];

function getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] || '';
  const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + second).toUpperCase();
}

// Telegram-style avatar: colored circle with the user's initials (no photo upload).
export default function UserAvatar({ name, size = 76, style }) {
  const key = String(name || '');
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const [bg, fg] = PALETTE[hash % PALETTE.length];

  return (
    <div
      aria-label={key}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: Math.round(size * 0.38),
        letterSpacing: '0.02em',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
