import React from 'react';
import UserAvatar from './UserAvatar.jsx';

export default function ProfileChip({
  user,
  onClick,
  id = 'btn-open-profile',
}) {
  const name = String(user?.name || '').trim();

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-label={name || 'Profil'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0,
        maxWidth: 180,
        height: 40,
        padding: '0 8px 0 4px',
        border: 'none',
        borderRadius: 99,
        background: 'transparent',
        cursor: 'pointer',
        color: 'var(--text-primary)',
      }}
    >
      <UserAvatar name={name} src={user?.image_url} size={32} />
      {name ? (
        <span style={{
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        }}>
          {name}
        </span>
      ) : null}
    </button>
  );
}
