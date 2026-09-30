import { createContext } from 'react';

// Kept in its own module so hot reloads of i18n.jsx never recreate the context
// (a recreated context leaves consumers reading the default value -> raw keys on screen).
export const LanguageContext = createContext({
  lang: 'uz',
  setLang: () => {},
  t: (key, fallback = '') => fallback || key,
});
