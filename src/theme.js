import { useCallback, useEffect, useState } from 'react';

// Theme preference: 'light' | 'dark' | 'system'. Stored in localStorage and applied as
// <html data-theme="dark|light"> (see the "Dark theme" block in index.css).
// index.html applies the same logic inline before first paint to avoid a flash.
export const THEME_KEY = 'tibcase_theme';
const THEMES = ['system', 'light', 'dark'];
const CHANGE_EVENT = 'tibcase-theme-change';

function systemPrefersDark() {
  if (typeof window === 'undefined') return false;
  const tg = window.Telegram?.WebApp;
  if (tg?.initData && tg.colorScheme) return tg.colorScheme === 'dark';
  return Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
}

export function getThemePreference() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return THEMES.includes(v) ? v : 'system';
  } catch {
    return 'system';
  }
}

export function resolveTheme(pref = getThemePreference()) {
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  return systemPrefersDark() ? 'dark' : 'light';
}

export function applyTheme(pref = getThemePreference()) {
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  if (resolved === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0C1210' : '#16A34A');
  return resolved;
}

export function setThemePreference(pref) {
  const next = THEMES.includes(pref) ? pref : 'system';
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch { /* storage unavailable */ }
  applyTheme(next);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
}

export function useTheme() {
  const [pref, setPref] = useState(getThemePreference);
  const [resolved, setResolved] = useState(() => resolveTheme());

  useEffect(() => {
    const sync = () => {
      const p = getThemePreference();
      setPref(p);
      setResolved(resolveTheme(p));
    };
    window.addEventListener(CHANGE_EVENT, sync);
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onSystem = () => {
      if (getThemePreference() === 'system') {
        applyTheme('system');
        sync();
      }
    };
    mq?.addEventListener?.('change', onSystem);
    const tg = window.Telegram?.WebApp;
    tg?.onEvent?.('themeChanged', onSystem);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      mq?.removeEventListener?.('change', onSystem);
      tg?.offEvent?.('themeChanged', onSystem);
    };
  }, []);

  const setTheme = useCallback((p) => setThemePreference(p), []);
  const toggle = useCallback(() => {
    setThemePreference(resolveTheme() === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme: pref, resolved, isDark: resolved === 'dark', setTheme, toggle };
}
