import React from 'react';

/**
 * Reusable shimmering placeholder shown while data is loading.
 * Reserves layout space so content doesn't jump when it arrives.
 */
export default function Skeleton({ width = '100%', height = 16, radius = 10, style, className = '' }) {
  return (
    <span
      className={`ui-skeleton ${className}`}
      aria-hidden="true"
      style={{ display: 'block', width, height, borderRadius: radius, ...style }}
    />
  );
}
