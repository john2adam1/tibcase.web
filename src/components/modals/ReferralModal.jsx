import React, { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Gift, RefreshCw, Share2, X } from 'lucide-react';
import { api, formatApiError } from '../../api';
import { useTranslation } from '../../i18n.jsx';
import Skeleton from '../common/Skeleton.jsx';

const MONO = "var(--font-mono, 'JetBrains Mono', monospace)";

function formatDate(value, lang) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ';
  return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ReferralModal({ isOpen, onClose, onToast }) {
  const { t, lang } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await api.getReferral());
    } catch (err) {
      setError(formatApiError(err, t));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!isOpen) return;
    setCopied(false);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const code = data?.referral_code || '';
  const invited = Array.isArray(data?.invited) ? data.invited : [];
  const shareText = `${t('referral.shareText', 'TibStation AI da klinik keys va testlar bilan mashq qiling. Ro‘yxatdan o‘tishda taklif kodini kiriting:')} ${code}`;

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onToast?.(t('referral.copied', 'Kod nusxalandi'));
      setTimeout(() => setCopied(false), 1800);
    } catch {
      onToast?.(code);
    }
  };

  const share = async () => {
    if (!code) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TibStation AI', text: shareText, url: window.location.origin });
      } catch { /* foydalanuvchi bekor qildi */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.origin}`);
      onToast?.(t('referral.copied', 'Kod nusxalandi'));
    } catch { /* clipboard yo'q */ }
  };

  return (
    <div
      id="referral-backdrop"
      onClick={(e) => { if (e.target.id === 'referral-backdrop') onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        animation: 'fadeIn 0.18s ease-out',
      }}
    >
      <div
        className="responsive-modal-card"
        style={{
          width: '100%', maxWidth: 460, maxHeight: '92dvh', overflowY: 'auto', boxSizing: 'border-box',
          background: 'var(--surface)', borderRadius: 18, padding: '24px 22px 22px', position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--line)',
          animation: 'modalScale 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          id="btn-close-referral"
          onClick={onClose}
          aria-label={t('common.close', 'Yopish')}
          style={{
            position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, paddingRight: 40 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: 'var(--tint-green)', color: '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Gift size={22} strokeWidth={2.2} />
          </div>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
            {t('settings.referral', 'Do‘stlarni taklif qilish')}
          </h3>
        </div>

        {loading && !data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            <Skeleton height={64} radius={14} />
            <Skeleton height={44} radius={12} />
            <Skeleton height={44} radius={12} />
          </div>
        )}

        {error && !data && (
          <div style={{ marginTop: 14 }}>
            <div role="alert" style={{
              padding: '10px 12px', borderRadius: 12, background: 'var(--tint-red-soft)',
              border: '1px solid var(--tint-red-border)', color: 'var(--on-red)', fontSize: 13, fontWeight: 600,
            }}>
              {error}
            </div>
            <button
              type="button"
              className="ui-btn"
              onClick={load}
              style={{ marginTop: 10, width: '100%' }}
            >
              <RefreshCw size={15} />
              {t('common.retry', 'Qayta urinish')}
            </button>
          </div>
        )}

        {data && (
          <>
            <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              {t('referral.desc', 'Do‘stingiz ro‘yxatdan o‘tayotganda «Taklif kodi» maydoniga sizning kodingizni kiritsa, ikkalangiz ham tanga olasiz.')}
            </p>

            <div style={{
              border: '1px solid var(--line)', background: 'var(--surface-2)', borderRadius: 14,
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--ink-3)',
                }}>
                  {t('referral.yourCode', 'Sizning kodingiz')}
                </div>
                <div id="referral-code" style={{
                  fontFamily: MONO, fontSize: 22, fontWeight: 600, letterSpacing: '0.06em',
                  color: 'var(--ink)', marginTop: 2, wordBreak: 'break-all',
                }}>
                  {code || '—'}
                </div>
              </div>
              <button
                id="btn-referral-copy"
                type="button"
                className="ui-icon-btn"
                onClick={copyCode}
                disabled={!code}
                aria-label={t('referral.copy', 'Nusxalash')}
              >
                {copied ? <Check size={18} color="#16A34A" strokeWidth={3} /> : <Copy size={18} />}
              </button>
              <button
                id="btn-referral-share"
                type="button"
                className="ui-icon-btn"
                onClick={share}
                disabled={!code}
                aria-label={t('referral.share', 'Ulashish')}
              >
                <Share2 size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              {[
                { label: t('referral.rewardYou', 'Har bir do‘st uchun siz'), value: `+${data.referrer_reward ?? 0}` },
                { label: t('referral.rewardFriend', 'Do‘stingiz oladi'), value: `+${data.referred_reward ?? 0}` },
              ].map((item) => (
                <div key={item.label} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)' }}>{item.label}</div>
                  <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
                    {item.value} <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'inherit', fontWeight: 600 }}>{t('referral.coinUnit', 'tanga')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--line)',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
                {t('referral.invited', 'Taklif qilinganlar')}: <span style={{ fontFamily: MONO }}>{data.invited_count ?? invited.length}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>
                {t('referral.earned', 'Olingan')}: <span style={{ fontFamily: MONO, color: 'var(--ink)' }}>{data.total_coins_earned ?? 0}</span>
              </div>
            </div>

            {invited.length === 0 ? (
              <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--ink-3)' }}>
                {t('referral.empty', 'Hali hech kim kodingiz bilan qo‘shilmagan.')}
              </p>
            ) : (
              <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column' }}>
                {invited.map((item, i) => (
                  <li
                    key={`${item.name}-${item.joined_at}-${i}`}
                    style={{
                      display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0',
                      borderTop: i === 0 ? 'none' : '1px solid var(--line)', fontSize: 13.5,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--ink)', wordBreak: 'break-word' }}>{item.name || '—'}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{formatDate(item.joined_at, lang)}</div>
                    </div>
                    <div style={{ fontFamily: MONO, fontWeight: 600, color: 'var(--on-green)', whiteSpace: 'nowrap' }}>
                      +{item.coins_given ?? 0}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
