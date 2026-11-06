import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme.js';
import { useTranslation } from '../../i18n.jsx';

// Round icon button that flips between light and dark.
export default function ThemeToggle({ className = 'ui-icon-btn', id = 'btn-theme-toggle', size = 20 }) {
  const { isDark, toggle } = useTheme();
  const { t } = useTranslation();
  const label = isDark ? t('theme.toLight', "Yorug' mavzu") : t('theme.toDark', "Qorong'i mavzu");

  return (
    <button
      type="button"
      id={id}
      className={className}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun size={size} strokeWidth={2.4} /> : <Moon size={size} strokeWidth={2.4} />}
    </button>
  );
}
