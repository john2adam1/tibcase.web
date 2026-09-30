import React, { useState, useEffect } from 'react';
import { Coins, Zap, Layers, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

function Stat({ icon: Icon, value, label, onClick }) {
  return (
    <button type="button" className="ui-card ui-card-press ui-stat" onClick={onClick}>
      <Icon size={18} color="var(--accent)" strokeWidth={2} />
      <b>{value}</b>
      <span>{label}</span>
    </button>
  );
}

export default function DashboardHero({ user, categories = [], banners = [], onOpenClinics, onOpenStore, onOpenLeaderboard }) {
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);
  const count = banners?.length || 0;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setSlide((p) => (p + 1) % count), 6000);
    return () => clearInterval(timer);
  }, [count]);

  const banner = count > 0 ? banners[slide % count] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="ui-title" style={{ fontSize: 24 }}>
          {t('hero.greeting', 'Assalomu alaykum')}{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="ui-subtitle" style={{ marginTop: 4 }}>
          {t('home.welcomeSubtitle', 'Bugun yangi klinik bilimlarni mustahkamlash uchun ajoyib kun!')}
        </p>
      </div>

      <div className="ui-stats">
        <Stat icon={Zap} value={`${user?.level ?? 1}`} label={`${t('nav.level', 'Level')} · ${user?.xp ?? 0} XP`} onClick={onOpenLeaderboard} />
        <Stat icon={Coins} value={user?.coins ?? 0} label={t('nav.coins', 'Tangalar')} onClick={onOpenStore} />
        <Stat icon={Layers} value={categories?.length ?? 0} label={t('nav.category', "Bo'limlar")} onClick={onOpenClinics} />
      </div>

      {banner && (
        <div
          className="ui-card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: 150,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: 6,
            background: banner.image_url ? `linear-gradient(0deg, rgba(17,24,39,.75), rgba(17,24,39,.15)), url(${banner.image_url}) center/cover` : 'var(--text-primary)',
            color: '#fff',
            border: 'none',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>{banner.title}</h2>
          {banner.description && <p style={{ fontSize: 13, opacity: 0.85 }}>{banner.description}</p>}
          {banner.link_url && (
            <a href={banner.link_url} target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              Batafsil <ExternalLink size={13} />
            </a>
          )}
          {count > 1 && (
            <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', gap: 5 }}>
              {banners.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Banner ${i + 1}`} style={{ width: i === slide ? 16 : 6, height: 6, borderRadius: 99, border: 'none', padding: 0, cursor: 'pointer', background: i === slide ? '#fff' : 'rgba(255,255,255,.5)' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
