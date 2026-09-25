import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Coins,
  ChevronLeft,
  ChevronRight,
  Zap,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function DashboardHero({
  user,
  categories = [],
  banners = [],
  userLimit,
  onOpenClinics,
  onOpenStore,
  onOpenLeaderboard,
}) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide rotation only if there are multiple real banners from API
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners?.length]);

  const nextSlide = () => {
    if (!banners || banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (!banners || banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const activeBanner = banners && banners.length > 0 ? banners[currentSlide] : null;

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* 1. Header Greeting from Real User Profile */}
      <div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#0F172A',
          margin: 0,
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
        }}>
          Assalomu alaykum{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p style={{
          fontSize: '15px',
          color: '#64748B',
          margin: '6px 0 0 0',
          fontWeight: 500,
        }}>
          {t('home.welcomeSubtitle', 'Bugun yangi klinik bilimlarni mustahkamlash uchun ajoyib kun!')}
        </p>
      </div>

      {/* 2. Real Banner Carousel (ONLY rendered if API returns banners) */}
      {activeBanner && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 280,
            borderRadius: 26,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
            background: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Real Background Image from API */}
          {activeBanner.image_url && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${activeBanner.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.4s ease-in-out',
              }}
            />
          )}

          {/* Soft gradient overlay for text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.65) 55%, rgba(15,23,42,0.3) 100%)',
            }}
          />

          {/* Banner Content from API */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '28px 32px 14px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            maxWidth: 600,
          }}>
            <h2 style={{
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
            }}>
              {activeBanner.title}
            </h2>

            {activeBanner.description && (
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {activeBanner.description}
              </p>
            )}

            {activeBanner.link_url && (
              <a
                href={activeBanner.link_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 8,
                  padding: '8px 16px',
                  borderRadius: 99,
                  background: '#C8102E',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  width: 'fit-content',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.4)',
                }}
              >
                <span>Batafsil</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Banner Controls & Dots (only if more than 1 banner) */}
          {banners.length > 1 && (
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '12px 32px 20px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 6,
            }}>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Banner ${idx + 1}`}
                  style={{
                    width: idx === currentSlide ? 20 : 8,
                    height: 8,
                    borderRadius: 99,
                    background: idx === currentSlide ? '#C8102E' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}

          {banners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous"
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 3,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0F172A',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next"
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 3,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0F172A',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}

      {/* 3. Real Stats Cards from API (Categories count, User Level/XP, Coins) */}
      <div
        className="dashboard-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 18,
          width: '100%',
        }}
      >
        {/* Card 1: Real Categories count from API */}
        <div
          onClick={onOpenClinics}
          style={{
            background: '#FFFFFF',
            borderRadius: 22,
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 14,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.02)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
            }}>
              <Layers size={20} strokeWidth={2.4} />
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              KLINIK BO'LIMLAR
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1,
              letterSpacing: '-1px',
            }}>
              {categories?.length ?? 0}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#64748B',
            }}>
              ta bo'lim
            </span>
          </div>
        </div>

        {/* Card 2: Real User Level & XP from API */}
        <div
          onClick={onOpenLeaderboard}
          style={{
            background: '#FFFFFF',
            borderRadius: 22,
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 14,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.02)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}>
              <Zap size={20} strokeWidth={2.4} />
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              DARAJA VA TAJRIBA
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1,
              letterSpacing: '-0.5px',
            }}>
              Level {user?.level ?? 1}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#16A34A',
            }}>
              {user?.xp ?? 0} XP
            </span>
          </div>
        </div>

        {/* Card 3: Real Coins from API */}
        <div
          onClick={onOpenStore}
          style={{
            background: '#FFFFFF',
            borderRadius: 22,
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 14,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.02)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}>
              <Coins size={20} strokeWidth={2.4} />
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              TIBBIY TANGALAR
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1,
              letterSpacing: '-0.5px',
            }}>
              {user?.coins ?? 0}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#64748B',
            }}>
              tanga mavjud
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
