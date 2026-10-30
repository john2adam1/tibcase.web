import React, { useState, useCallback, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Send,
  X,
  ExternalLink,
  RefreshCw,
  ClipboardPaste
} from 'lucide-react';
import { api, formatApiError, setStoredUser, setToken, setRefreshToken } from '../../api';
import { useTranslation } from '../../i18n.jsx';
import { BrandLockup } from '../../brand.jsx';
import { getCaptchaTokenSafe } from '../../utils/captcha';
import { openExternalUrl } from '../../utils/openUrl';

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
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'tg_wait'
  const [tgLogin, setTgLogin] = useState(null);
  const [authMethod, setAuthMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  // Clean close handler that resets local states and triggers onClose callback
  const handleClose = useCallback(() => {
    setErrorMsg('');
    setInfoMsg('');
    setCode('');
    setStep('input');
    setTgLogin(null);
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
          if (!isExpired && parsed?.step === 'tg_wait' && parsed?.token) {
            setTgLogin({ token: parsed.token, bot_url: parsed.bot_url, expiresAt: parsed.expiresAt });
            setStep('tg_wait');
            return;
          }
          if (!isExpired && parsed?.step === 'otp' && parsed?.identifier && parsed?.authMethod === 'email') {
            setIdentifier(parsed.identifier);
            setAuthMethod('email');
            setStep('otp');
            api.sendOtp(parsed.identifier, 'email').catch(() => {});
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

  // Google Login response handler (stable reference via useCallback)
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) return;

    setGoogleLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      // POST /mobile/auth/google
      const res = await api.loginWithGoogle(idToken);

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
      const details = err?.data?.error?.details;
      console.error('[GoogleAuth] /mobile/auth/google failed', {
        origin: window.location.origin,
        status: err?.status,
        code: err?.code,
        details,
        message: err?.message,
      });
      setErrorMsg(`${err.message || t('auth.googleError')}${details ? ` (${details})` : ''}`);
    } finally {
      setGoogleLoading(false);
    }
  }, [onLoginSuccess, handleClose, t]);

  const handleGoogleError = useCallback(() => {
    // GIS gives no reason here; origin mismatch / blocked script / FedCM are the usual causes.
    console.error('[GoogleAuth] Google Sign-In failed on GIS side. Origin:', window.location.origin);
    setErrorMsg(`${t('auth.googleError')} (${window.location.origin})`);
  }, [t]);

  // Send OTP, then open Telegram bot (bot requires OTP to already exist)
  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    setAuthMethod('email');
    const type = 'email';
    const cleanId = normalizeIdentifier(identifier, type);

    if (!cleanId) return;

    if (type === 'telegram' && !cleanId.startsWith('@')) {
      const digits = cleanId.replace(/\D/g, '');
      if (!digits.startsWith('998') || digits.length !== 12) {
        setErrorMsg("Iltimos, telefon raqamingizni to'g'ri formatda kiriting (+998XXXXXXXXX)");
        return;
      }
    }

    setIdentifier(cleanId);
    setErrorMsg('');
    setInfoMsg('');
    setCode('');
    setResendTimer(60);
    setLoading(true);

    try {
      const captcha = await getCaptchaTokenSafe();
      await api.sendOtp(cleanId, type, captcha || undefined);
      try {
        const pendingData = {
          step: 'otp',
          identifier: cleanId,
          authMethod: type,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
        localStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
      } catch {
        // ignore
      }
      setStep('otp');
      setInfoMsg(t('auth.resendSuccess') || 'Tasdiqlash kodi yuborildi ✓');
      if (type === 'telegram') {
        openTelegramBot(cleanId);
      }
    } catch (err) {
      setErrorMsg(formatApiError(err, t) || t('auth.sendError'));
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
      const captcha = await getCaptchaTokenSafe();
      await api.sendOtp(cleanId, type, captcha || undefined);
      setInfoMsg(t('auth.resendSuccess') || 'Yangi tasdiqlash kodi yuborildi ✓');
    } catch (err) {
      setErrorMsg(formatApiError(err, t) || t('auth.sendError'));
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
      const res = await api.confirmOtp(cleanId, cleanCode, type);

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
      setErrorMsg(formatApiError(err, t) || t('auth.confirmError'));
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

  const finishWithAuth = async (auth) => {
    if (auth?.access_token) setToken(auth.access_token);
    if (auth?.refresh_token) setRefreshToken(auth.refresh_token);
    const profile = await api.getUserProfile();
    setStoredUser(profile);
    onLoginSuccess(profile);
    handleClose();
  };

  const handleTelegramBotLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const captcha = await getCaptchaTokenSafe();
      const res = await api.startTelegramLogin(captcha || undefined);
      const expiresAt = Date.now() + (Number(res?.expires_in) || 300) * 1000;
      const next = { token: res.token, bot_url: res.bot_url, expiresAt };
      setTgLogin(next);
      try {
        sessionStorage.setItem('tibcase_auth_pending', JSON.stringify({
          step: 'tg_wait',
          token: res.token,
          bot_url: res.bot_url,
          expiresAt,
          timestamp: Date.now(),
        }));
      } catch { /* ignore */ }
      setStep('tg_wait');
      openExternalUrl(res.bot_url);
    } catch (err) {
      setErrorMsg(formatApiError(err, t));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step !== 'tg_wait' || !tgLogin?.token) return undefined;
    let cancelled = false;
    const tick = async () => {
      if (Date.now() > (tgLogin.expiresAt || 0)) {
        setErrorMsg(t('auth.tgBotExpired', "Token muddati o'tdi. Qayta boshlang."));
        setStep('input');
        return;
      }
      try {
        const res = await api.checkTelegramLogin(tgLogin.token);
        if (cancelled) return;
        if (res?.status === 'confirmed' && (res.auth || res.access_token)) {
          await finishWithAuth(res.auth || res);
        }
      } catch (err) {
        if (cancelled) return;
        if (err?.code === 'otp_expired') {
          setErrorMsg(formatApiError(err, t));
          setStep('input');
        }
      }
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [step, tgLogin]);

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
  const openTelegramBot = (idOverride) => {
    const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
    const type = resolveAuthType();
    const cleanId = normalizeIdentifier(idOverride || identifier, type);

    try {
      const pendingData = {
        step: 'otp',
        identifier: cleanId,
        authMethod: type,
        timestamp: Date.now(),
      };
      sessionStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
      localStorage.setItem('tibcase_auth_pending', JSON.stringify(pendingData));
    } catch {
      // ignore
    }

    if (tg?.initData) {
      if (typeof tg.openTelegramLink === 'function') {
        try {
          tg.openTelegramLink(TELEGRAM_BOT_URL);
        } catch { /* ignore */ }
      }
      if (typeof tg.disableClosingConfirmation === 'function') {
        try {
          tg.disableClosingConfirmation();
        } catch { /* ignore */ }
      }
      if (typeof tg.close === 'function') {
        tg.close();
      }
    } else {
      window.open(TELEGRAM_BOT_URL, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenTelegramBot = (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    openTelegramBot();
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
          <BrandLockup className="auth-brand" imgClassName="auth-brand-mark" />

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

        {step === 'tg_wait' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
              {t('auth.tgBotWaiting', 'Telegram botida tasdiqlang. Shu yerga avtomatik qaytamiz.')}
            </p>
            <button
              type="button"
              onClick={() => openExternalUrl(tgLogin?.bot_url)}
              style={{
                ...btnPrimaryStyle,
                background: 'linear-gradient(135deg, #0088cc 0%, #0284c7 100%)',
              }}
            >
              <Send size={16} />
              {t('auth.tgBotOpen', 'Botni ochish')}
              <ExternalLink size={15} />
            </button>
            <button
              type="button"
              onClick={() => { setStep('input'); setTgLogin(null); }}
              style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, cursor: 'pointer' }}
            >
              {t('auth.changeNumber')}
            </button>
          </div>
        ) : step === 'input' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button
              type="button"
              onClick={handleTelegramBotLogin}
              disabled={loading || googleLoading}
              style={{
                ...btnPrimaryStyle,
                background: 'linear-gradient(135deg, #0088cc 0%, #0284c7 100%)',
              }}
            >
              <Send size={16} />
              {loading ? t('auth.sending') : t('auth.tgBotLogin', 'Telegram orqali kirish')}
            </button>

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

            <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#64748B',
                  marginBottom: 6,
                  fontWeight: 700,
                }}>
                  {t('auth.emailLabel')}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 42 }}
                    onFocus={(e) => { e.target.style.borderColor = '#22C55E'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading || !identifier.trim()}
                style={btnPrimaryStyle}
              >
                <span>{loading ? t('auth.sending') : t('auth.sendCode')}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleConfirmCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Telegram bot button (phone login) */}
            {resolveAuthType() === 'telegram' && (
              <button
                type="button"
                onClick={handleOpenTelegramBot}
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 48,
                  padding: '12px 18px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #0088cc 0%, #0284c7 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  width: '100%',
                }}
              >
                <Send size={16} />
                <span>{t('auth.openBotBtn')}</span>
                <ExternalLink size={15} />
              </button>
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
