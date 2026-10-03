import React, { useState, useEffect } from 'react';
import { ChevronLeft, CalendarDays, Clock, Save, BellRing, Power, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

export default function StudyPlanView({ onBack }) {
  const { t } = useTranslation();
  const [plan, setPlan] = useState({
    is_enabled: false,
    remind_time: '20:00',
    remind_minutes_before: 15,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPlan, setOriginalPlan] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await api.getStudyPlan();
      if (res) {
        const data = {
          is_enabled: res.is_enabled || false,
          remind_time: String(res.remind_time || '20:00').slice(0, 5),
          remind_minutes_before: res.remind_minutes_before ?? 15,
        };
        setPlan(data);
        setOriginalPlan(data);
      }
    } catch (err) {
      console.error('Failed to load study plan', err);
      showToast(err?.message || t('common.error', 'Xatolik yuz berdi'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = (field, value) => {
    const newPlan = { ...plan, [field]: value };
    setPlan(newPlan);
    setHasChanges(
      JSON.stringify(newPlan) !== JSON.stringify(originalPlan)
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Backend identifies the user by the token; never send an empty user_id.
      const payload = {
        is_enabled: !!plan.is_enabled,
        remind_time: String(plan.remind_time || '20:00').slice(0, 5),
        remind_minutes_before: Number(plan.remind_minutes_before) || 0,
      };
      await api.updateStudyPlan(payload);
      setOriginalPlan({ ...plan });
      setHasChanges(false);
      showToast(t('studyPlan.savedSuccess', "O'quv rejasi muvaffaqiyatli saqlandi! ✓"), 'success');
    } catch (err) {
      console.error('Failed to save study plan', err);
      showToast(err?.message || t('studyPlan.savedError', "Xatolik yuz berdi. Qaytadan urinib ko'ring."), 'error');
    } finally {
      setSaving(false);
    }
  };

  const minuteOptions = [
    { value: 0, label: t('studyPlan.atTime', "Belgilangan vaqtda") },
    { value: 5, label: t('studyPlan.5min', "5 daqiqa oldin") },
    { value: 10, label: t('studyPlan.10min', "10 daqiqa oldin") },
    { value: 15, label: t('studyPlan.15min', "15 daqiqa oldin") },
    { value: 30, label: t('studyPlan.30min', "30 daqiqa oldin") },
    { value: 60, label: t('studyPlan.1hour', "1 soat oldin") },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#F8FAFC',
      padding: '24px 20px',
      overflowY: 'auto',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 24,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0F172A',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <h1 style={{
          flex: 1,
          fontSize: '20px',
          fontWeight: 700,
          color: '#0F172A',
          margin: 0,
          textAlign: 'center',
          paddingRight: 40,
        }}>
          {t('settings.studyPlan', "O'quv rejasi")}
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 60 }}>
          <div style={{
            width: 40, height: 40, border: '4px solid #E2E8F0', borderTopColor: '#3B82F6',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px auto',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          {t('studyPlan.loading', 'Yuklanmoqda...')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Info Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: 16,
            border: '1px solid #93C5FD',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: 'var(--shadow-sm)',
            }}>
              <AlertCircle size={20} color="#2563EB" strokeWidth={2.2} />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#1E40AF', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
                {t('studyPlan.infoBanner', "Har kuni belgilangan vaqtda klinik keyslar yechishni eslatib turuvchi bildirishnoma olasiz. Bu sizga muntazam mashq qilishga yordam beradi.")}
              </p>
            </div>
          </div>

          {/* Main Settings Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 18,
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)',
            padding: '20px',
            overflow: 'hidden',
          }}>
            {/* Enable/Disable Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: plan.is_enabled ? 20 : 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: plan.is_enabled ? '#F0FDF4' : '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease',
                }}>
                  {plan.is_enabled ? (
                    <CalendarDays size={24} color="#16A34A" strokeWidth={2} />
                  ) : (
                    <Power size={24} color="#94A3B8" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>
                    {t('studyPlan.reminderTitle', 'Kunlik eslatma')}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    {plan.is_enabled
                      ? t('studyPlan.reminderActiveDesc', 'Eslatmalar faol')
                      : t('studyPlan.reminderInactiveDesc', "Eslatmalar o'chirilgan")}
                  </p>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <div
                onClick={() => updatePlan('is_enabled', !plan.is_enabled)}
                style={{
                  width: 52,
                  height: 32,
                  borderRadius: 16,
                  background: plan.is_enabled ? '#10B981' : '#CBD5E1',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                  boxShadow: plan.is_enabled
                    ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                    : '0 2px 4px rgba(0,0,0,0.08)',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  position: 'absolute',
                  top: 4,
                  left: plan.is_enabled ? 24 : 4,
                  transition: 'left 0.3s ease',
                  boxShadow: 'var(--shadow-sm)',
                }} />
              </div>
            </div>

            {/* Time & Minutes Before Settings (visible when enabled) */}
            {plan.is_enabled && (
              <div style={{
                borderTop: '1px solid #F1F5F9',
                paddingTop: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                animation: 'fadeIn 0.3s ease',
              }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); }}`}</style>

                {/* Remind Time */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: 10,
                  }}>
                    <Clock size={18} color="#3B82F6" strokeWidth={2.2} />
                    {t('studyPlan.remindTimeLabel', 'Eslatma vaqti')}
                  </label>
                  <input
                    type="time"
                    value={plan.remind_time}
                    onChange={(e) => updatePlan('remind_time', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 14,
                      border: '1px solid #E2E8F0',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#0F172A',
                      outline: 'none',
                      background: '#F8FAFC',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>

                {/* Remind Minutes Before */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: 10,
                  }}>
                    <BellRing size={18} color="#D97706" strokeWidth={2.2} />
                    {t('studyPlan.remindBeforeLabel', 'Qancha vaqt oldin eslatilsin')}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {minuteOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updatePlan('remind_minutes_before', opt.value)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 12,
                          border: '2px solid',
                          borderColor: plan.remind_minutes_before === opt.value ? '#3B82F6' : '#E2E8F0',
                          background: plan.remind_minutes_before === opt.value ? '#EFF6FF' : '#FFFFFF',
                          color: plan.remind_minutes_before === opt.value ? '#2563EB' : '#475569',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: plan.remind_minutes_before === opt.value
                            ? '0 2px 0 #93C5FD'
                            : '0 2px 0 #E2E8F0',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Schedule Summary */}
                <div style={{
                  background: '#F0FDF4',
                  borderRadius: 14,
                  border: '1px solid #BBF7D0',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <CalendarDays size={18} color="#16A34A" strokeWidth={2.2} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803D', lineHeight: 1.4 }}>
                    {t('studyPlan.scheduleSummary', 'Har kuni soat')} {plan.remind_time}
                    {plan.remind_minutes_before > 0 && ` (${plan.remind_minutes_before} ${t('studyPlan.minBefore', 'daqiqa oldin')})`}
                    {' '}{t('studyPlan.willRemind', 'eslatma keladi')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            style={{
              padding: '16px',
              borderRadius: 18,
              background: (saving || !hasChanges)
                ? '#CBD5E1'
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: (saving || !hasChanges) ? '1px solid #E2E8F0' : '1px solid #059669',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 700,
              cursor: (saving || !hasChanges) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: (saving || !hasChanges)
                ? 'none'
                : '0 4px 0 #059669, 0 8px 20px rgba(16, 185, 129, 0.3)',
              opacity: (saving || !hasChanges) ? 0.6 : 1,
              marginTop: 6,
              transition: 'all 0.2s ease',
            }}
          >
            <Save size={20} />
            {saving
              ? t('studyPlan.saving', 'Saqlanmoqda...')
              : (hasChanges
                ? t('studyPlan.save', 'Saqlash')
                : t('studyPlan.saved', 'Saqlangan ✓')
              )}
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#DC2626' : '#0F172A',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: 16,
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: 'var(--shadow-sm)',
          zIndex: 9999,
          animation: 'toastIn 0.3s ease',
          maxWidth: '90vw',
          textAlign: 'center',
        }}>
          {toast.msg}
          <style>{`@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); }}`}</style>
        </div>
      )}
    </div>
  );
}
