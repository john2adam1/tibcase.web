import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ExternalLink,
  Globe,
  HeartPulse,
  LogIn,
  MessageSquare,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

const LANGUAGES = [
  { code: 'uz', flag: '🇺🇿', label: 'Oʻzbekcha', short: 'OʻZ' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский', short: 'RU' },
  { code: 'en', flag: '🇺🇸', label: 'English', short: 'EN' },
];

export default function LandingPage({
  onOpenLogin,
  isAuthenticated = false,
  partners = [],
  onLangChange,
  lang: propLang,
}) {
  const { lang: ctxLang, setLang, t } = useTranslation();
  const currentLang = propLang || ctxLang || 'uz';
  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const displayPartners = partners && partners.length > 0 ? partners : [
    { id: 'imed', name: 'iMed', logo_url: '/imedteamlogo.png', link_url: 'https://imedteam.uz' }
  ];

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLang = (newCode) => {
    if (onLangChange) {
      onLangChange(newCode);
    } else {
      setLang(newCode);
    }
    setLangMenuOpen(false);
  };

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Public Landing Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo-full.svg" alt="TibStation" style={{ height: 40, width: 'auto', display: 'block' }} />
          </div>

          {/* Simple Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }} className="desktop-nav">
            <a href="#features" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
              {t('landing.nav.features', 'Imkoniyatlar')}
            </a>
            <a href="#how-it-works" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
              {t('landing.nav.howItWorks', 'Qanday ishlaydi?')}
            </a>
            {displayPartners.length > 0 && (
              <a href="#partners" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
                {t('landing.nav.partners', 'Hamkorlar')}
              </a>
            )}
          </nav>

          {/* Right side: Language Switcher + Login/Kabinet Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Language Selector Dropdown */}
            <div style={{ position: 'relative' }} ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                aria-label="Tilni o'zgartirish"
                style={{
                  height: 42,
                  padding: '0 12px',
                  borderRadius: 14,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.background = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <Globe size={16} color="#16A34A" />
                <span style={{ fontSize: '15px', lineHeight: 1 }}>{activeLangObj.flag}</span>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: '0.82rem' }}>{activeLangObj.short}</span>
                <ChevronDown
                  size={14}
                  style={{
                    color: '#64748B',
                    transform: langMenuOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {langMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                  padding: 6,
                  minWidth: 160,
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}>
                  {LANGUAGES.map((item) => {
                    const isSelected = currentLang === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSelectLang(item.code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: 'none',
                          background: isSelected ? '#F0FDF4' : 'transparent',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: '0.9rem',
                          color: isSelected ? '#16A34A' : '#1E293B',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '16px' }}>{item.flag}</span>
                          <span>{item.label}</span>
                        </span>
                        {isSelected && <Check size={16} strokeWidth={2.8} color="#16A34A" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Login / Kabinet Button */}
            <button
              onClick={onOpenLogin}
              style={{
                height: 42,
                padding: '0 20px',
                fontSize: '0.92rem',
                borderRadius: 14,
                background: '#16A34A',
                color: '#FFFFFF',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <LogIn size={16} />
              <span>{isAuthenticated ? t('landing.nav.cabinet', 'Kabinet') : t('landing.nav.login', 'Kirish')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="landing-hero-section"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '80px 24px 70px',
          textAlign: 'center',
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 18px',
          borderRadius: 99,
          background: '#DCFCE7',
          border: '1px solid #86EFAC',
          color: '#166534',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: 24,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <Sparkles size={16} />
          <span>{t('landing.hero.badge', "O'zbekistondagi birinchi AI tibbiy simulyator")}</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.85rem, 5vw, 3.4rem)',
          lineHeight: 1.15,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          color: '#0F172A'
        }}>
          {t('landing.hero.titlePrefix', 'Shifokorlar va Talabalar uchun')}{' '}
          <span style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #3B82F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t('landing.hero.titleHighlight', 'Virtual Klinik Simulyatsiya')}
          </span>
        </h1>

        <p style={{
          fontSize: '1.18rem',
          color: '#475569',
          lineHeight: 1.6,
          fontWeight: 500,
          maxWidth: 720,
          margin: '0 auto 36px',
        }}>
          {t('landing.hero.desc', "Haqiqiy klinik holatlar ustida virtual bemor bilan muloqot qiling, fiziologik vitallarni (EKG, puls, bosim, SpO2) kuzating va xalqaro protokollar asosida sun'iy intellektdan darhol baho oling.")}
        </p>

        {/* Primary CTA button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={onOpenLogin}
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: 18,
              background: '#16A34A',
              color: '#FFFFFF',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>{isAuthenticated ? t('landing.hero.ctaCabinet', 'Kabinetga kirish') : t('landing.hero.cta', 'Platformaga Kirish')}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Highlights Cards (4 Features) */}
      <section id="features" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
            {t('landing.features.title', "Nima uchun aynan TibStation AI?")}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', fontWeight: 500, maxWidth: 560, margin: '0 auto' }}>
            {t('landing.features.subtitle', "Nazariyadan amaliyotga o'tishning xavfsiz va eng samarali usuli")}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          <div
            className="landing-feature-card"
            style={{
              background: '#FFFFFF',
              padding: 32,
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              marginBottom: 20,
            }}>
              <HeartPulse size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
              {t('landing.features.f1Title', 'Dinamik Fiziologiya')}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              {t('landing.features.f1Desc', "Bemorning EKG kardiogrammasi, qon bosimi va saturatsiyasi siz tanlagan dori va muolajalarga ko'ra real vaqtda o'zgaradi.")}
            </p>
          </div>

          <div
            className="landing-feature-card"
            style={{
              background: '#FFFFFF',
              padding: 32,
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6',
              marginBottom: 20,
            }}>
              <MessageSquare size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
              {t('landing.features.f2Title', 'AI Bemor bilan Muloqot')}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              {t('landing.features.f2Desc', "Gemini AI bilan integratsiya qilingan bemorga xohlagan savolingizni bering va shikoyatlarini aniqlashtiring.")}
            </p>
          </div>

          <div
            className="landing-feature-card"
            style={{
              background: '#FFFFFF',
              padding: 32,
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22C55E',
              marginBottom: 20,
            }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
              {t('landing.features.f3Title', 'Xalqaro Protokollar')}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              {t('landing.features.f3Desc', "AHA (American Heart Association) va ESC ko'rsatmalari asosida har bir qadamingiz baholanadi va debriefing beriladi.")}
            </p>
          </div>

          <div
            className="landing-feature-card"
            style={{
              background: '#FFFFFF',
              padding: 32,
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F59E0B',
              marginBottom: 20,
            }}>
              <Shield size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
              {t('landing.features.f4Title', 'Klinik va Birinchi Yordam')}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              {t('landing.features.f4Desc', "Ham professional shifokorlar uchun og'ir klinik holatlar, ham aholi uchun favqulodda birinchi yordam (BLS) keyslari.")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
            {t('landing.steps.title', "Qanday Ishlaydi?")}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', fontWeight: 500 }}>
            {t('landing.steps.subtitle', "3 ta oddiy qadam bilan virtual klinik tajribaga ega bo'ling")}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {[
            {
              step: '01',
              title: t('landing.steps.step1Title', "Keysni Tanlang"),
              desc: t('landing.steps.step1Desc', "Kardiologiya, Terapiya, Shoshilinch yordam yoki Birinchi yordam bo'limlaridan o'zingizga mos keysni oching."),
            },
            {
              step: '02',
              title: t('landing.steps.step2Title', "Simulyatsiyani Boshqaring"),
              desc: t('landing.steps.step2Desc', "Anamnez yig'ing, EKG va laboratoriya tahlillarini ko'ring, to'g'ri dori va muolajalarni o'z vaqtida buyuring."),
            },
            {
              step: '03',
              title: t('landing.steps.step3Title', "AI Debriefing Oling"),
              desc: t('landing.steps.step3Desc', "Yakuniy tashxisdan so'ng AI xatolaringiz, to'g'ri harakatlaringiz va zaif nuqtalaringiz bo'yicha hisobot taqdim etadi."),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                padding: 32,
                borderRadius: 18,
                border: '1px solid #E2E8F0',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#22C55E',
                opacity: 0.2,
                marginBottom: 16,
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>{item.title}</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      {displayPartners.length > 0 && (
        <section id="partners" style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '20px 24px 80px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>
            {t('landing.partners.title', "Rasmiy Ta'limiy Hamkorlarimiz")}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20 }}>
            {displayPartners.map((p) => {
              const isImed = p.name?.toLowerCase().includes('imed');
              const rawLink = p.link_url || (isImed ? 'https://imedteam.uz' : 'https://imedteam.uz');
              const targetUrl = rawLink.startsWith('http://') || rawLink.startsWith('https://') ? rawLink : `https://${rawLink}`;
              const logoSrc = p.logo_url || (isImed ? '/imedteamlogo.png' : null);

              return (
                <a
                  key={p.id || p.name}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#FFFFFF',
                    padding: '14px 28px',
                    borderRadius: 18,
                    border: '1px solid #E2E8F0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: 'var(--shadow-sm)',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(22, 163, 74, 0.16), 0 4px 6px -2px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#86EFAC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                  title={`${p.name} — ${targetUrl}`}
                >
                  {logoSrc ? (
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}>
                      <img
                        src={logoSrc}
                        alt={p.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: '#DCFCE7',
                      color: '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      flexShrink: 0,
                    }}>
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>{p.name}</span>
                    <ExternalLink size={16} color="#94A3B8" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        <div style={{
          background: '#16A34A',
          padding: '56px 40px',
          borderRadius: 36,
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
          color: '#FFFFFF',
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 16 }}>
            {t('landing.cta.title', "Klinik Malakangizni Bugunoq Oshiring")}
          </h2>
          <p style={{ fontSize: '1.05rem', fontWeight: 500, maxWidth: 560, margin: '0 auto 32px', opacity: 0.9 }}>
            {t('landing.cta.subtitle', "Tizimga kiring va birinchi klinik keysingizni xavfsiz virtual muhitda yechib ko'ring.")}
          </p>
          <button
            onClick={onOpenLogin}
            style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              borderRadius: 16,
              background: '#FFFFFF',
              color: '#16A34A',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>{isAuthenticated ? t('landing.hero.ctaCabinet', 'Kabinetga kirish') : t('landing.cta.btn', 'Kirish va Boshlash')}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #E2E8F0',
        background: '#FFFFFF',
        padding: '32px 24px',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#64748B',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>{t('gen.copyright')}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Quick language switch in footer */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#F1F5F9',
              padding: '4px 8px',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
            }}>
              <Globe size={14} color="#64748B" />
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectLang(item.code)}
                  style={{
                    border: 'none',
                    background: currentLang === item.code ? '#FFFFFF' : 'transparent',
                    color: currentLang === item.code ? '#16A34A' : '#64748B',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    padding: '4px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    boxShadow: currentLang === item.code ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.short}
                </button>
              ))}
            </div>

            <span>{t('gen.standards')}</span>
            <span>Gemini AI Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
