import React from 'react';
import { Bell, Home } from 'lucide-react';
import ProfileChip from '../common/ProfileChip.jsx';
import { useTranslation } from '../../i18n.jsx';
import { BrandLockup } from '../../brand.jsx';

export default function TabletHeader({
  currentView = 'cases',
  user,
  onGoHome,
  onOpenProfile,
  onOpenNotifications,
  unreadCount = 0,
}) {
  const { t } = useTranslation();
  const onProfile = currentView === 'profile';

  return (
    <header className="tablet-mobile-header">
      <div className="tm-header-menu" style={{ minWidth: 0 }}>
        {onProfile ? (
          <button
            type="button"
            id="btn-header-home"
            className="tm-header-home"
            onClick={onGoHome}
          >
            <Home size={18} strokeWidth={2.4} />
            <span>{t('nav.homePage', 'Asosiy sahifa')}</span>
          </button>
        ) : (
          <ProfileChip user={user} onClick={onOpenProfile} />
        )}
      </div>

      <button
        type="button"
        className="tm-header-logo"
        onClick={onGoHome}
        aria-label={t('nav.home', 'Asosiy')}
      >
        <BrandLockup />
      </button>

      <button id="btn-open-notifications" className="ui-icon-btn" onClick={onOpenNotifications} aria-label="Notifications">
        <Bell size={22} strokeWidth={2.6} />
        {unreadCount > 0 && <span className="tm-header-unread" />}
      </button>
    </header>
  );
}
