import React from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  HeartPulse,
  LogIn,
  MessageSquare,
  Microscope,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  Zap
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function LandingPage({
  onOpenLogin,
  partners = []
}) {
  const { t } = useTranslation();
  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Public Landing Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '2px solid #E2E8F0',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(34, 197, 94, 0.35)',
            }}>
              <Activity className="heart-pulse" size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0F172A'
              }}>
                TibCase AI
              </span>
            </div>
          </div>

          {/* Simple Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }} className="desktop-nav">
            <a href="#features" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
              Imkoniyatlar
            </a>
            <a href="#how-it-works" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
              Qanday ishlaydi?
            </a>
            <a href="#partners" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
              Hamkorlar
            </a>
          </nav>

          {/* Login Button */}
          <div>
            <button
              onClick={onOpenLogin}
              style={{
                padding: '10px 22px',
                fontSize: '0.92rem',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <LogIn size={16} />
              <span>Kirish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '80px 24px 70px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 18px',
          borderRadius: 99,
          background: '#DCFCE7',
          border: '1.5px solid #86EFAC',
          color: '#166534',
          fontSize: '0.85rem',
          fontWeight: 800,
          marginBottom: 24,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <Sparkles size={16} />
          <span>O'zbekistondagi birinchi AI tibbiy simulyator</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
          lineHeight: 1.15,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          color: '#0F172A'
        }}>
          Shifokorlar va Talabalar uchun{' '}
          <span style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #3B82F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Virtual Klinik Simulyatsiya
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
          Haqiqiy klinik holatlar ustida virtual bemor bilan muloqot qiling, fiziologik vitallarni (EKG, puls, bosim, SpO2) kuzating va xalqaro protokollar asosida sun'iy intellektdan darhol baho oling.
        </p>

        {/* Primary CTA button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={onOpenLogin}
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>Platformaga Kirish</span>
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
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
            Nima uchun aynan TibCase AI?
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', fontWeight: 500, maxWidth: 560, margin: '0 auto' }}>
            Nazariyadan amaliyotga o'tishning xavfsiz va eng samarali usuli
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: 32,
            borderRadius: 28,
            border: '2px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.2s ease',
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Dinamik Fiziologiya</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              Bemorning EKG kardiogrammasi, qon bosimi va saturatsiyasi siz tanlagan dori va muolajalarga ko'ra real vaqtda o'zgaradi.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            padding: 32,
            borderRadius: 28,
            border: '2px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.2s ease',
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>AI Bemor bilan Muloqot</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              Gemini AI bilan integratsiya qilingan bemorga xohlagan savolingizni bering va shikoyatlarini aniqlashtiring.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            padding: 32,
            borderRadius: 28,
            border: '2px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.2s ease',
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Xalqaro Protokollar</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              AHA (American Heart Association) va ESC ko'rsatmalari asosida har bir qadamingiz baholanadi va debriefing beriladi.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            padding: 32,
            borderRadius: 28,
            border: '2px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.2s ease',
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Klinik va Birinchi Yordam</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              Ham professional shifokorlar uchun og'ir klinik holatlar, ham aholi uchun favqulodda birinchi yordam (BLS) keyslari.
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
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
            Qanday Ishlaydi?
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', fontWeight: 500 }}>
            3 ta oddiy qadam bilan virtual klinik tajribaga ega bo'ling
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
              title: "Keysni Tanlang",
              desc: "Kardiologiya, Terapiya, Shoshilinch yordam yoki Birinchi yordam bo'limlaridan o'zingizga mos keysni oching."
            },
            {
              step: '02',
              title: "Simulyatsiyani Boshqaring",
              desc: "Anamnez yig'ing, EKG va laboratoriya tahlillarini ko'ring, to'g'ri dori va muolajalarni o'z vaqtida buyuring."
            },
            {
              step: '03',
              title: "AI Debriefing Oling",
              desc: "Yakuniy tashxisdan so'ng AI xatolaringiz, to'g'ri harakatlaringiz va zaif nuqtalaringiz bo'yicha hisobot taqdim etadi."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                padding: 32,
                borderRadius: 28,
                border: '2px solid #E2E8F0',
                position: 'relative',
                boxShadow: '0 12px 36px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#22C55E',
                opacity: 0.2,
                marginBottom: 16,
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>{item.title}</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <section id="partners" style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '20px 24px 80px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: 24 }}>
            Rasmiy Ta'limiy Hamkorlarimiz
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20 }}>
            {partners.map(p => (
              <div
                key={p.id}
                style={{
                  background: '#FFFFFF',
                  padding: '16px 32px',
                  borderRadius: 20,
                  border: '2px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)',
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                }}>
                  {p.name.charAt(0)}
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>{p.name}</span>
              </div>
            ))}
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
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
          padding: '56px 40px',
          borderRadius: 36,
          textAlign: 'center',
          boxShadow: '0 16px 48px rgba(34, 197, 94, 0.3)',
          color: '#FFFFFF'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 16 }}>
            Klinik Malakangizni Bugunoq Oshiring
          </h2>
          <p style={{ fontSize: '1.05rem', fontWeight: 500, maxWidth: 560, margin: '0 auto 32px', opacity: 0.9 }}>
            Tizimga kiring va birinchi klinik keysingizni xavfsiz virtual muhitda yechib ko'ring.
          </p>
          <button
            onClick={onOpenLogin}
            style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              borderRadius: 20,
              background: '#FFFFFF',
              color: '#16A34A',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>Kirish va Boshlash</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '2px solid #E2E8F0',
        background: '#FFFFFF',
        padding: '32px 24px',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#64748B',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>{t('gen.copyright')}</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>{t('gen.standards')}</span>
            <span>Gemini AI Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
