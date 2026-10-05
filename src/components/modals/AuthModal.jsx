import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Send,
  X,
  ExternalLink,
  RefreshCw,
  Phone,
  ArrowUp,
  MessageSquare,
  ClipboardPaste
} from 'lucide-react';
import { api, setStoredUser, setToken, setRefreshToken } from '../../api';
import { useTranslation } from '../../i18n.jsx';

const TELEGRAM_BOT_URL = 'https://t.me/tibstation_aibot?start=login';

// Memoized Google Login component to prevent redundant GSI initializations on parent state updates
const MemoizedGoogleLogin = React.memo(function MemoizedGoogleLogin({
  onSuccess,
  onError,
}) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', minHeight: 44 }}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        size="large"
        shape="pill"
        width="280"
        text="signin_with"
      />
    </div>
  );
});

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [authMethod, setAuthMethod] = useState('telegram'); // 'telegram' | 'email' (default to Telegram/phone)
  const [identifier, setIdentifier] = useState('+998');
  const [referralCode, setReferralCode] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  const referralCodeRef = useRef(referralCode);
  useEffect(() => {
    referralCodeRef.current = referralCode;
  }, [referralCode]);

  // Clean close handler that resets local states and triggers onClose callback
  const handleClose = useCallback(() => {
    setErrorMsg('');
    setInfoMsg('');
    setCode('');
    setStep('input');
    try {
      sessionStorage.removeItem('tibcase_auth_pending');
      localStorage.removeItem('tibcase_auth_pending');
    } catch {
      // ignore
    }
    if (onClose) onClose();
  }, [onClose]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Check pending auth from sessionStorage on modal open or restore step
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem('tibcase_auth_pending') || sessionStorage.getItem('tibcase_auth_pending');
        if (raw) {
          const parsed = JSON.parse(raw);
          const isExpired = parsed?.timestamp && (Date.now() - parsed.timestamp > 10 * 60 * 1000);
          if (!isExpired && parsed?.step === 'otp' && parsed?.identifier) {
            setIdentifier(parsed.identifier);
            if (parsed.authMethod) setAuthMethod(parsed.authMethod);
            if (parsed.referralCode) setReferralCode(parsed.referralCode);
            setStep('otp');
            return;
          } else if (isExpired) {
            localStorage.removeItem('tibcase_auth_pending');
            sessionStorage.removeItem('tibcase_auth_pending');
          }
        }
      } catch {
        // ignore
      }
      setErrorMsg('');
      setInfoMsg('');
      setCode('');
      setStep('input');
    }
  }, [isOpen]);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Resolve type: strictly 'email' or 'telegram'
  const resolveAuthType = () => {
    const raw = identifier.trim();
    if (authMethod === 'email' || (raw.includes('@') && raw.includes('.'))) {
      return 'email';
    }
    return 'telegram';
  };

  // Normalize phone number or email for backend strict requirements (+998XXXXXXXXX, no spaces)
  const normalizeIdentifier = (val, method) => {
    const raw = (val || '').trim();
    if (method === 'email') {
      return raw.toLowerCase();
    }
    if (raw.startsWith('@')) {
      return raw.replace(/\s+/g, '');
    }
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('998')) {
      return `+${digits}`;
    }
    if (digits.length === 9) {
      return `+998${digits}`;
    }
    return `+${digits}`;
  };

  // Format identifier when typing
  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    if (authMethod === 'telegram') {
      if (val === '' || val === '+') {
        setIdentifier('+');
      } else if (val.startsWith('@') || /^[a-zA-Z]/.test(val)) {
        setIdentifier(val);
      } else {
        const cleanVal = val.startsWith('+') ? '+' + val.slice(1).replace(/\D/g, '') : '+' + val.replace(/\D/g, '');
        setIdentifier(cleanVal);
      }
    } else {
      setIdentifier(val);
    }
  };

  // Handle tab switch
  const handleMethodSwitch = (method) => {
    setAuthMethod(method);
    setErrorMsg('');
    setInfoMsg('');
    if (method === 'telegram') {
      if (!identifier || identifier.includes('@')) {
        setIdentifier('+998');
      }
    } else {
      if (identifier === '+998' || identifier === '+') {
        setIdentifier('');
      }
    }
  };

  // Google Login response handler (stable reference via useCallback)
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) return;

    setGoogleLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      // POST /mobile/auth/google
      const res = await api.loginWithGoogle(idToken, referralCodeRef.current.trim());

      if (res?.access_token) {
        setToken(res.access_token);
      }
      if (res?.refresh_token) {
        setRefreshToken(res.refresh_token);
      }

      // Fetch user profile from API
      const profile = await api.getUserProfile();
      setStoredUser(profile);
      onLoginSuccess(profile);

      handleClose();
    } catch (err) {
      setErrorMsg(err.message || t('auth.googleError'));
    } finally {
      setGoogleLoading(false);
    }
  }, [onLoginSuccess, handleClose, t]);

  const handleGoogleError = useCallback(() => {
    setErrorMsg(t('auth.googleError'));
  }, [t]);

  // Send OTP (transitions immediately to OTP step & opens Telegram bot)
  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    const type = resolveAuthType();
    const cleanId = normalizeIdentifier(identifier, type);

    if (!cleanId) return;

    if (type === 'telegram' && !cleanId.startsWith('@')) {
      const digits = cleanId.replace(/\D/g, '');
      if (digits.length < 9) {
        setErrorMsg("Iltimos, telefon raqamingizni to'g'ri formatda kiriting (+998...)");
        return;
      }
    }

    setIdentifier(cleanId);
    setErrorMsg('');
    setInfoMsg('');
    setCode('');
    setResendTimer(60);

    // Save pending state in localStorage & sessionStorage in case mobile WebApp reloads or is minimized
    try {
      const pendingData = {
        step: 'otp',
        identifier: cleanId,
        authMethod: type,
        referralCode: referralCode.trim(),
        timestamp: Date.now()
      };
      sessionStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
      localStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
    } catch {
      // ignore
    }

    // 1. Immediately switch to OTP code input step on the website
    setStep('otp');

    // 3. Request OTP from backend
    setLoading(true);
    try {
      await api.sendOtp(cleanId, type);
      setInfoMsg(t('auth.resendSuccess') || 'Tasdiqlash kodi yuborildi ✓');
    } catch (err) {
      setErrorMsg(err.message || t('auth.sendError'));
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    if (resendTimer > 0 || resending || loading) return;
    const type = resolveAuthType();
    const cleanId = normalizeIdentifier(identifier, type);
    if (!cleanId) return;

    setResending(true);
    setErrorMsg('');
    setInfoMsg('');
    setResendTimer(60);

    try {
      await api.sendOtp(cleanId, type);
      setInfoMsg(t('auth.resendSuccess') || 'Yangi tasdiqlash kodi yuborildi ✓');
    } catch (err) {
      setErrorMsg(err.message || t('auth.sendError'));
    } finally {
      setResending(false);
    }
  };

  // Confirm OTP
  const handleConfirmCode = async (e, directCode = null) => {
    if (e) e.preventDefault();
    const type = resolveAuthType();
    const cleanId = normalizeIdentifier(identifier, type);
    const cleanCode = (directCode || code).trim();
    if (!cleanCode) return;

    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await api.confirmOtp(cleanId, cleanCode, referralCodeRef.current.trim(), type);

      const token = res?.access_token || res?.token || (typeof res === 'string' ? res : null);
      if (token) {
        setToken(token);
      }
      if (res?.refresh_token) {
        setRefreshToken(res.refresh_token);
      }

      const profile = await api.getUserProfile();
      setStoredUser(profile);
      onLoginSuccess(profile);

      try {
        sessionStorage.removeItem('tibcase_auth_pending');
        localStorage.removeItem('tibcase_auth_pending');
      } catch {
        // ignore
      }

      handleClose();
    } catch (err) {
      setErrorMsg(err.message || t('auth.confirmError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    if (val.length === 6) {
      handleConfirmCode(null, val);
    }
  };

  const handleChangeNumber = () => {
    try {
      sessionStorage.removeItem('tibcase_auth_pending');
      localStorage.removeItem('tibcase_auth_pending');
    } catch {
      // ignore
    }
    setStep('input');
    setCode('');
    setErrorMsg('');
    setInfoMsg('');
  };

  // Open Telegram Bot or close WebApp when inside Telegram
  const handleOpenTelegramBot = (e) => {
    if (e) e.preventDefault();
    const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
    const type = resolveAuthType();
    const cleanId = normalizeIdentifier(identifier, type);

    // Save pending state so it is restored on re-opening WebApp
    try {
      const pendingData = {
        step: 'otp',
        identifier: cleanId,
        authMethod: type,
        referralCode: referralCodeRef.current.trim(),
        timestamp: Date.now()
      };
      sessionStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
      localStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
    } catch {
      // ignore
    }

    // Inside Telegram WebApp:
    if (tg?.initData) {
      if (typeof tg.openTelegramLink === 'function') {
        try {
          tg.openTelegramLink(TELEGRAM_BOT_URL);
        } catch {}
      }
      if (typeof tg.disableClosingConfirmation === 'function') {
        try {
          tg.disableClosingConfirmation();
        } catch {}
      }
      if (typeof tg.close === 'function') {
        tg.close();
      }
    } else {
      window.open(TELEGRAM_BOT_URL, '_blank', 'noopener,noreferrer');
    }
  };

  // Clipboard paste helper for OTP
  const handlePasteCode = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        const digits = (text || '').replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          setCode(digits);
          handleConfirmCode(null, digits);
        } else if (digits.length > 0) {
          setCode(digits);
        }
      }
    } catch (err) {
      console.warn('Clipboard paste error:', err);
    }
  };

  const isInsideTelegram = Boolean(typeof window !== 'undefined' && window.Telegram?.WebApp?.initData);

  // Card & styles
  const cardStyle = {
    width: '100%',
    maxWidth: 440,
    padding: 'clamp(18px, 5vw, 30px)',
    maxHeight: '92dvh',
    overflowY: 'auto',
    boxSizing: 'border-box',
    position: 'relative',
    background: '#FFFFFF',
    borderRadius: 18,
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 0 #E2E8F0, 0 20px 50px rgba(15, 23, 42, 0.08)',
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 16,
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
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
    background: '#16A34A',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: 'var(--shadow-sm)',
    opacity: (loading || googleLoading) ? 0.7 : 1,
    transition: 'all 0.2s ease',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const activeTabStyle = {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 12,
    background: '#FFFFFF',
    border: 'none',
    color: '#0F172A',
    fontWeight: 700,
    fontSize: '0.84rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s ease',
  };

  const inactiveTabStyle = {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 12,
    background: 'transparent',
    border: 'none',
    color: '#64748B',
    fontWeight: 600,
    fontSize: '0.84rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s ease',
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
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
          type="button"
          aria-label={t('common.close') || 'Yopish'}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 38,
            height: 38,
            borderRadius: 12,
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E2E8F0';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <X size={18} style={{ pointerEvents: 'none' }} />
        </button>

        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <img src="/logo.svg" alt="TibStation AI" width={56} height={56} style={{ borderRadius: 16, display: 'block', margin: '0 auto 12px' }} />

          <h3 style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#0F172A',
            marginBottom: 4,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {t('auth.title')}
          </h3>
          <p style={{
            color: '#64748B',
            fontSize: '0.85rem',
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
            border: '1px solid #FCA5A5',
            color: '#DC2626',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {errorMsg}
          </div>
        )}

        {step === 'input' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Referral code (optional) — applies to both Google and phone/email login */}
            <div>
              <label htmlFor="auth-referral-code" style={{
                display: 'block',
                fontSize: '0.8rem',
                color: '#64748B',
                marginBottom: 6,
                fontWeight: 700,
              }}>
                {t('auth.referralLabel')}
              </label>
              <input
                id="auth-referral-code"
                type="text"
                autoCapitalize="characters"
                autoComplete="off"
                placeholder={t('auth.referralPlaceholder')}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.trim())}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#22C55E'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
              />
            </div>

            {/* 1. Official Google Sign-In via @react-oauth/google */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <MemoizedGoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              {googleLoading && (
                <div style={{ fontSize: '13px', color: '#16A34A', fontWeight: 700, marginTop: 6 }}>
                  {t('auth.googleSigningIn')}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '2px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                {t('auth.orDivider')}
              </span>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            </div>

            {/* Method Toggle: Telegram vs Email */}
            <div style={{
              background: '#F1F5F9',
              borderRadius: 14,
              padding: 4,
              display: 'flex',
              gap: 4,
            }}>
              <button
                type="button"
                onClick={() => handleMethodSwitch('telegram')}
                style={authMethod === 'telegram' ? activeTabStyle : inactiveTabStyle}
              >
                <Send size={15} color={authMethod === 'telegram' ? '#0088cc' : '#64748B'} />
                <span>{t('auth.methodTelegram')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleMethodSwitch('email')}
                style={authMethod === 'email' ? activeTabStyle : inactiveTabStyle}
              >
                <Mail size={15} color={authMethod === 'email' ? '#16A34A' : '#64748B'} />
                <span>{t('auth.methodEmail')}</span>
              </button>
            </div>

            {/* 2. Identifier Form */}
            <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#64748B',
                  marginBottom: 6,
                  fontWeight: 700,
                }}>
                  {authMethod === 'email' ? t('auth.emailLabel') : t('auth.telegramLabel')}
                </label>
                <div style={{ position: 'relative' }}>
                  {authMethod === 'email' ? (
                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  ) : (
                    <Phone size={18} color="#0088cc" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  )}
                  <input
                    type={authMethod === 'email' ? 'email' : 'text'}
                    placeholder={authMethod === 'email' ? t('auth.emailPlaceholder') : '+998 90 123 45 67'}
                    value={identifier}
                    onChange={handleIdentifierChange}
                    style={{ ...inputStyle, paddingLeft: 42 }}
                    onFocus={(e) => { e.target.style.borderColor = authMethod === 'telegram' ? '#0088cc' : '#22C55E'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
                  />
                </div>
              </div>

              {authMethod === 'telegram' ? (
                <button
                  type="submit"
                  disabled={loading || googleLoading || !identifier.trim() || identifier === '+'}
                  style={{
                    ...btnPrimaryStyle,
                    background: 'linear-gradient(135deg, #0088cc 0%, #0284c7 100%)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Send size={16} />
                  <span>{loading ? t('auth.sending') : t('auth.sendTelegramBtn')}</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || googleLoading || !identifier.trim()}
                  style={btnPrimaryStyle}
                >
                  <span>{loading ? t('auth.sending') : t('auth.sendCode')}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </form>
          </div>
        ) : (
          <form onSubmit={handleConfirmCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Telegram bot guidance & button (phone login) */}
            {resolveAuthType() === 'telegram' && (
              isInsideTelegram ? (
                /* Inside Telegram Mini App: Visual 3-step guide + [ ∨ ] pointer + close to bot button */
                <div style={{
                  background: 'linear-gradient(135deg, rgba(0, 136, 204, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%)',
                  borderRadius: 18,
                  border: '1.5px solid rgba(0, 136, 204, 0.3)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  position: 'relative',
                }}>
                  {/* Top animated badge pointing to Telegram header [ ∨ ] */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: '#0088cc',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.01em',
                    alignSelf: 'center',
                    boxShadow: '0 2px 8px rgba(0, 136, 204, 0.35)',
                    animation: 'pulse 2.2s infinite',
                  }}>
                    <ArrowUp size={14} style={{ animation: 'bounceUp 1.2s infinite' }} />
                    <span>{t('auth.tgHeaderHint')}</span>
                  </div>

                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800, fontSize: '0.9rem' }}>
                      <MessageSquare size={17} color="#0088cc" />
                      <span>{t('auth.tgStepTitle')}</span>
                    </div>
                    <ol style={{
                      margin: 0,
                      paddingLeft: 20,
                      fontSize: '0.83rem',
                      color: '#334155',
                      lineHeight: 1.45,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}>
                      <li>
                        <strong>{t('auth.tgStep1')}</strong> {t('auth.tgStep1Sub')}
                      </li>
                      <li>
                        <strong>{t('auth.tgStep2')}</strong>
                      </li>
                      <li>
                        <strong>{t('auth.tgStep3')}</strong>
                      </li>
                    </ol>
                  </div>

                  {/* Direct action button to close webapp and switch to bot */}
                  <button
                    type="button"
                    onClick={handleOpenTelegramBot}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      minHeight: 46,
                      padding: '10px 16px',
                      borderRadius: 14,
                      background: '#0088cc',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Send size={15} />
                    <span>{t('auth.tgCloseToBotBtn')}</span>
                  </button>
                </div>
              ) : (
                /* Regular browser (Chrome / Safari): direct link to Telegram */
                <div style={{
                  background: 'rgba(0, 136, 204, 0.06)',
                  borderRadius: 18,
                  border: '1px solid rgba(0, 136, 204, 0.25)',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  textAlign: 'center',
                  gap: 12,
                }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#0F172A', fontWeight: 600, lineHeight: 1.45 }}>
                    {t('auth.botOtpHint')}
                  </p>
                  <a
                    href={TELEGRAM_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOpenTelegramBot}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      minHeight: 48,
                      padding: '12px 18px',
                      borderRadius: 14,
                      background: '#0088cc',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Send size={16} />
                    <span>{t('auth.openBotBtn')}</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              )
            )}

            {/* Info Message (e.g. resend success) */}
            {infoMsg && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 14,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#059669',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {infoMsg}
              </div>
            )}

            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <label style={{
                  fontSize: '0.8rem',
                  color: '#64748B',
                  fontWeight: 700,
                }}>
                  {t('auth.otpLabel')}
                </label>
                {typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText) && (
                  <button
                    type="button"
                    onClick={handlePasteCode}
                    style={{
                      background: 'rgba(0, 136, 204, 0.08)',
                      border: '1px solid rgba(0, 136, 204, 0.2)',
                      borderRadius: 8,
                      color: '#0088cc',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 8px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ClipboardPaste size={13} />
                    <span>{t('auth.pasteCode')}</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="123456"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                style={{
                  ...inputStyle,
                  fontSize: '1.4rem',
                  letterSpacing: '0.35em',
                  textAlign: 'center',
                  fontWeight: 700,
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

            {/* Resend OTP & Change Number */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending || loading || resendTimer > 0}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: resendTimer > 0 ? '#94A3B8' : '#0284C7',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: (resending || loading || resendTimer > 0) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                <span>
                  {resending
                    ? t('auth.sending')
                    : resendTimer > 0
                    ? `${t('auth.resendCode')} (${String(Math.floor(resendTimer / 60)).padStart(2, '0')}:${String(resendTimer % 60).padStart(2, '0')})`
                    : t('auth.resendCode')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleChangeNumber}
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
