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

export default function LandingPage({
  onOpenLogin,
  partners = []
}) {
  return (
    <div style={{ color: 'var(--text-primary)' }}>
      {/* Public Landing Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(6, 11, 20, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
            }}>
              <Activity className="heart-pulse" size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
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
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600 }}>
              Imkoniyatlar
            </a>
            <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600 }}>
              Qanday ishlaydi?
            </a>
            <a href="#partners" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600 }}>
              Hamkorlar
            </a>
          </nav>

          {/* Login Button */}
          <div>
            <button
              onClick={onOpenLogin}
              className="btn-primary"
              style={{
                padding: '10px 22px',
                fontSize: '0.92rem',
                borderRadius: 10,
              }}
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
          padding: '6px 16px',
          borderRadius: 99,
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: 'var(--accent-cyan)',
          fontSize: '0.85rem',
          fontWeight: 700,
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
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: 24,
        }}>
          Shifokorlar va Talabalar uchun{' '}
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Virtual Klinik Simulyatsiya
          </span>
        </h1>

        <p style={{
          fontSize: '1.18rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: 720,
          margin: '0 auto 36px',
        }}>
          Haqiqiy klinik holatlar ustida virtual bemor bilan muloqot qiling, fiziologik vitallarni (EKG, puls, bosim, SpO2) kuzating va xalqaro protokollar asosida sun'iy intellektdan darhol baho oling.
        </p>

        {/* Primary CTA button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={onOpenLogin}
            className="btn-primary"
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: 12,
            }}
          >
            <span>Platformaga Kirish</span>
            <ArrowRight size={18} />
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
          <h2 style={{ fontSize: '2.1rem', marginBottom: 12 }}>
            Nima uchun aynan TibCase AI?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, margin: '0 auto' }}>
            Nazaridan amaliyotga o'tishning xavfsiz va eng samarali usuli
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              marginBottom: 18,
            }}>
              <HeartPulse size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Dinamik Fiziologiya</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Bemorning EKG kardiogrammasi, qon bosimi va saturatsiyasi siz tanlagan dori va muolajalarga ko'ra real vaqtda o'zgaradi.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
              marginBottom: 18,
            }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>AI Bemor bilan Muloqot</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Gemini AI bilan integratsiya qilingan bemorga xohlagan savolingizni bering va shikoyatlarini aniqlashtiring.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              marginBottom: 18,
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Xalqaro Protokollar</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              AHA (American Heart Association) va ESC ko'rsatmalari asosida har bir qadamingiz baholanadi va debriefing beriladi.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              marginBottom: 18,
            }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Klinik va Birinchi Yordam</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
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
          <h2 style={{ fontSize: '2.1rem', marginBottom: 12 }}>
            Qanday Ishlaydi?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
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
              className="glass-panel"
              style={{
                padding: 32,
                position: 'relative',
              }}
            >
              <div style={{
                fontSize: '2rem',
                fontWeight: 900,
                fontFamily: 'var(--font-heading)',
                color: 'var(--accent-cyan)',
                opacity: 0.8,
                marginBottom: 12,
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
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
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
            Rasmiy Ta'limiy Hamkorlarimiz
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20 }}>
            {partners.map(p => (
              <div
                key={p.id}
                className="glass-panel"
                style={{
                  padding: '14px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}>
                  {p.name.charAt(0)}
                </div>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{p.name}</span>
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
        <div className="glass-panel" style={{
          padding: '48px 32px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>
            Klinik Malakangizni Bugunoq Oshiring
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 520, margin: '0 auto 28px' }}>
            Tizimga kiring va birinchi klinik keysingizni xavfsiz virtual muhitda yechib ko'ring.
          </p>
          <button
            onClick={onOpenLogin}
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            <span>Kirish va Boshlash</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '32px 24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>© 2026 <strong>TibCase AI</strong>. Barcha huquqlar himoyalangan.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>AHA / ESC Tibbiy Standartlari</span>
            <span>Gemini AI Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
