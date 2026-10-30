import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { openExternalUrl } from './utils/openUrl';

export const BRAND_NAMES = ['TibStation'];

const BrandContext = createContext({
  name: 'TibStation',
  nameAi: 'TibStation AI',
});

export function withBrand(text, name = 'TibStation') {
  return String(text || '')
    .replaceAll('TibStation AI', `${name} AI`)
    .replaceAll('TibStation', name);
}

export function BrandProvider({ children }) {
  const value = useMemo(() => ({
    name: 'TibStation',
    nameAi: 'TibStation AI',
  }), []);

  useEffect(() => {
    document.title = `${value.nameAi} — AI mashq, fleshkartalar va bilim xaritasi`;
    const apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute('content', value.name);
  }, [value]);

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}

export function BrandLockup({ className = '', imgClassName = '', nameClassName = '' }) {
  const { name } = useBrand();
  return (
    <span className={`brand-lockup ${className}`.trim()}>
      <img src="/logo.svg" alt="" className={imgClassName} />
      <span className={`brand-lockup-name ${nameClassName}`.trim()}>{name}</span>
    </span>
  );
}

export const SITE_CREDIT_NAME = 'Zoxidjon Coder';
export const SITE_CREDIT_URL = 'https://t.me/zoxidjon_coder';

export function SiteCredit({ className = '' }) {
  const onClick = (e) => {
    e.preventDefault();
    openExternalUrl(SITE_CREDIT_URL);
  };
  return (
    <span className={`site-credit ${className}`.trim()}>
      by{' '}
      <a href={SITE_CREDIT_URL} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {SITE_CREDIT_NAME}
      </a>
    </span>
  );
}
