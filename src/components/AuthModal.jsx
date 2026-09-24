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
import { api, setStoredUser, setToken, setRefreshToken } from '../api';
import { useTranslation } from '../i18n.jsx';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [identifier, setIdentifier] = useState('');
  const [referralCode, setReferralCode] = useState('');
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
      // First check if user exists
      await api.checkUser(identifier.trim());
      // Then send OTP
      await api.sendOtp(identifier.trim(), identifier.includes('@') ? 'email' : 'phone');
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message || t('auth.sendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const type = identifier.includes('@') ? 'email' : 'phone';
      const res = await api.confirmOtp(identifier.trim(), code.trim(), referralCode.trim(), type);

      // Store tokens
      if (res?.access_token) {
        setToken(res.access_token);
      }
      if (res?.refresh_token) {
        setRefreshToken(res.refresh_token);
      }

      // Fetch real user profile
      try {
        const profile = await api.getUserProfile();
        setStoredUser(profile);
        onLoginSuccess(profile);
      } catch {
        // If profile fetch fails, use basic info from the response
        const basicUser = {
          id: res?.id || '',
          name: '',
          phone_number: identifier,
          role: res?.role || 'user',
        };
        setStoredUser(basicUser);
        onLoginSuccess(basicUser);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || t('auth.confirmError'));
    } finally {
      setLoading(false);
    }
  };

  // White claymorphic card style
  const cardStyle = {
    width: '100%',
    maxWidth: 440,
    padding: 32,
    position: 'relative',
    background: '#FFFFFF',
    borderRadius: 28,
    border: '2px solid #E2E8F0',
    boxShadow: '0 4px 0 #E2E8F0, 0 20px 50px rgba(15, 23, 42, 0.08)',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 16,
    background: '#F8FAFC',
    border: '2px solid #E2E8F0',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#0F172A',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const btnPrimaryStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: 18,
    border: 'none',
    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.2s ease',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: 16,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={cardStyle}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: 12,
            background: '#F1F5F9',
            border: '1.5px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 6px 20px rgba(34, 197, 94, 0.35)',
          }}>
            <Activity size={28} color="#fff" />
          </div>

          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: 4,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {t('auth.title')}
          </h3>
          <p style={{
            color: '#64748B',
            fontSize: '0.88rem',
            fontWeight: 500,
            margin: 0,
          }}>
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 14,
            background: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            color: '#DC2626',
            fontSize: '0.85rem',
            fontWeight: 600,
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
                color: '#64748B',
                marginBottom: 8,
                fontWeight: 700,
              }}>
                {t('auth.phoneLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="+998 90 123 45 67"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 42 }}
                  onFocus={(e) => { e.target.style.borderColor = '#22C55E'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
                />
              </div>
            </div>

            {/* Referral code (optional) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                color: '#64748B',
                marginBottom: 8,
                fontWeight: 700,
              }}>
                {t('auth.referralLabel')}
              </label>
              <input
                type="text"
                placeholder={t('auth.referralPlaceholder')}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#22C55E'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              style={btnPrimaryStyle}
            >
              <span>{loading ? t('auth.sending') : t('auth.sendCode')}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                color: '#64748B',
                marginBottom: 8,
                fontWeight: 700,
              }}>
                {t('auth.otpLabel')}
              </label>
              <input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                style={{
                  ...inputStyle,
                  fontSize: '1.3rem',
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  fontWeight: 800,
                }}
                onFocus={(e) => { e.target.style.borderColor = '#22C55E'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
              />
              <p style={{
                fontSize: '0.78rem',
                color: '#94A3B8',
                marginTop: 8,
                fontWeight: 500,
                textAlign: 'center',
              }}>
                {t('auth.otpSentTo')} <strong style={{ color: '#0F172A' }}>{identifier}</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              style={btnPrimaryStyle}
            >
              <span>{loading ? t('auth.verifying') : t('auth.confirm')}</span>
              <CheckCircle2 size={16} />
            </button>

            {/* Resend / Change number */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setCode('');
                  setErrorMsg('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {t('auth.changeNumber')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
