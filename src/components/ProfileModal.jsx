import React, { useState } from 'react';
import {
  Award,
  Bell,
  Check,
  Coins,
  Copy,
  ExternalLink,
  Flame,
  HelpCircle,
  LogOut,
  Mail,
  Phone,
  Share2,
  Shield,
  Sparkles,
  User,
  X,
  Zap
} from 'lucide-react';

export default function ProfileModal({
  user,
  onClose,
  onLogout,
  onOpenStore,
  faqs = [],
  contacts = [],
  abouts = []
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'referral' | 'faq' | 'support'
  const [copied, setCopied] = useState(false);

  const referralCode = `TIB-${user?.name ? user.name.slice(0, 3).toUpperCase() : 'DOC'}77`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          position: 'relative',
          background: 'linear-gradient(180deg, #0e172a 0%, #070d18 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <X size={18} />
        </button>

        {/* User Card Top */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: 800,
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
          }}>
            {user?.name ? user.name[0] : 'D'}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 2 }}>
              {user?.name || "Dr. Akmal Karimov"}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: 4 }}>
              {user?.specialization || "Shifokor-ordinant • Kardiologiya"}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user?.email || "akmal.doc@tibcase.uz"}
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(15, 23, 42, 0.6)',
          padding: 4,
          borderRadius: 10,
          marginBottom: 24,
        }}>
          {[
            { id: 'profile', label: 'Statistika' },
            { id: 'referral', label: 'Taklif & Tangalar' },
            { id: 'faq', label: 'FAQ & Yordam' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 600,
                background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                color: activeTab === tab.id ? '#38bdf8' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PROFILE STATS */}
        {activeTab === 'profile' && (
          <div>
            {/* Stats Metric Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 24,
            }}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: 16,
                textAlign: 'center',
              }}>
                <Coins size={20} color="#fbbf24" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                  {user?.coins ?? 15}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mavjud Tangalar</div>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: 16,
                textAlign: 'center',
              }}>
                <Flame size={20} color="#f97316" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f97316' }}>
                  {user?.streak_count ?? 5} kun
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Faol Olov (Streak)</div>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: 16,
                textAlign: 'center',
              }}>
                <Zap size={20} color="#34d399" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                  Lvl {user?.level ?? 1}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.xp ?? 100} XP</div>
              </div>
            </div>

            {/* Level Progress */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: 18,
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>Daraja Ko'rsatkichi</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{user?.xp ?? 100} / 500 XP</span>
              </div>
              <div style={{
                height: 8,
                borderRadius: 99,
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min(100, ((user?.xp ?? 100) / 500) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                }} />
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  onClose();
                  onOpenStore();
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                <Coins size={16} />
                <span>Tangalar Xarid Qilish</span>
              </button>

              <button
                onClick={onLogout}
                className="btn-secondary"
                style={{ padding: '12px 18px', color: '#f87171' }}
              >
                <LogOut size={16} />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REFERRAL (TZ 4.3 B 4) */}
        {activeTab === 'referral' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <Share2 size={24} />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: 4 }}>Do'stlaringizni Taklif Qiling</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto' }}>
                Har bir taklif qilingan shifokor yoki talaba do'stingiz uchun sizga ham, do'stingizga ham <strong>+2 ta bepul Tanga</strong> beriladi!
              </p>
            </div>

            {/* Referral Code Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px dashed rgba(245, 158, 11, 0.4)',
              borderRadius: 14,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sizning taklif kodingiz:</div>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: '#fbbf24',
                  letterSpacing: '0.08em',
                }}>
                  {referralCode}
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="btn-primary"
                style={{
                  background: copied ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Nusxalandi!" : "Nusxa olish"}</span>
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              * Tangalar do'stingiz birinchi marta ilovada ro'yxatdan o'tgach darhol hisobingizga tushadi.
            </div>
          </div>
        )}

        {/* TAB 3: FAQ & SUPPORT */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: 4 }}>Ko'p So'raladigan Savollar</h4>
            {(faqs.length > 0 ? faqs : [
              { question: "TibCase simulyatori qanday ishlaydi?", answer: "Simulyatsiya Gemini AI va real fiziologik qon aylanish modellari asosida ishlaydi. Har bir qabul qilgan qaroringiz bemorning yurak urishi, qon bosimi va saturatsiyasini o'zgartiradi." },
              { question: "Tangalar qanday ishlatiladi?", answer: "1 ta tanga = 1 ta to'liq klinik keys yechish va AI debriefing olish imkoniyati. Premium obuna bilan barcha keyslar cheksiz bo'ladi." },
              { question: "Sertifikat beriladimi?", answer: "Klinik keyslarni 85% dan yuqori aniqlikda yakunlagan shifokor va talabalarga elektron verifikatsiyalangan sertifikat taqdim etiladi." }
            ]).map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: 4 }}>
                  {faq.question}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
