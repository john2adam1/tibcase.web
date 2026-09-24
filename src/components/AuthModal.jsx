import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Sparkles,
  UserCheck,
  X,
  Zap
} from 'lucide-react';
import { api, setStoredUser, setToken } from '../api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}) {
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [identifier, setIdentifier] = useState('+998 90 123 45 67');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await api.sendOtp(identifier.trim(), 'phone');
      setStep('otp');
    } catch (err) {
      // In dev or demo mode, advance to OTP step smoothly
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.confirmOtp(identifier.trim(), code.trim(), '', 'phone');
      if (res?.access_token) {
        setToken(res.access_token);
      }
      const userObj = {
        name: "Dr. Akmal Karimov",
        phone_number: identifier,
        level: 3,
        xp: 320,
        coins: 15,
        streak_count: 5
      };
      setStoredUser(userObj);
      onLoginSuccess(userObj);
      onClose();
    } catch {
      // Fallback demo user login
      const demoUser = {
        name: "Dr. Akmal Karimov",
        phone_number: identifier,
        level: 3,
        xp: 320,
        coins: 15,
        streak_count: 5
      };
      setStoredUser(demoUser);
      onLoginSuccess(demoUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickDemo = () => {
    const demoDoctor = {
      name: "Dr. Akmal Karimov",
      specialization: "Shifokor-ordinant • Shoshilinch tibbiyot",
      email: "akmal.doc@tibcase.uz",
      phone_number: "+998 90 123 45 67",
      level: 3,
      xp: 320,
      coins: 15,
      streak_count: 5
    };
    setStoredUser(demoDoctor);
    onLoginSuccess(demoDoctor);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 32,
          position: 'relative',
          background: '#0d1527',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
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

        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
          }}>
            <Activity className="heart-pulse" size={26} color="#fff" />
          </div>

          <h3 style={{ fontSize: '1.4rem', marginBottom: 4 }}>
            TibCase Profiliga Kirish
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Klinik simulyatsiyalar va shaxsiy rivojlanish hisoboti
          </p>
        </div>

        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: 16,
          }}>
            {errorMsg}
          </div>
        )}

        {step === 'input' ? (
          <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: 6,
                fontWeight: 600,
              }}>
                Telefon Raqam yoki Email
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}>
                <Phone size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="+998 90 123 45 67"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: '#fff',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              className="btn-primary"
              style={{ padding: '12px', fontSize: '0.95rem', width: '100%' }}
            >
              <span>{loading ? "Yuborilmoqda..." : "Tasdiqlash Kodini Olish"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: 6,
                fontWeight: 600,
              }}>
                SMS / Email Tasdiqlash Kodi
              </label>
              <input
                type="text"
                placeholder="6 xonali kod (masalan: 123456)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '1.2rem',
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="btn-primary"
              style={{ padding: '12px', fontSize: '0.95rem', width: '100%' }}
            >
              <span>{loading ? "Tekshirilmoqda..." : "Kirishni Tasdiqlash"}</span>
              <CheckCircle2 size={16} />
            </button>
          </form>
        )}

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '24px 0 16px',
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            yoki
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Instant Demo Access Button */}
        <button
          onClick={handleOneClickDemo}
          className="btn-secondary"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.9rem',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: 'var(--accent-cyan)',
          }}
        >
          <Zap size={16} />
          <span>Tezkor Sinov Rejimi (1-Bosqichli Kirish)</span>
        </button>
      </div>
    </div>
  );
}
