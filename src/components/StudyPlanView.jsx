import React, { useState, useEffect } from 'react';
import { ChevronLeft, CalendarDays, Clock, Save, BellRing } from 'lucide-react';
import { api } from '../api';

export default function StudyPlanView({ onBack }) {
  const [plan, setPlan] = useState({
    is_enabled: false,
    remind_time: '20:00',
    remind_minutes_before: 15,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await api.getStudyPlan();
      if (res) {
        setPlan({
          is_enabled: res.is_enabled || false,
          remind_time: res.remind_time || '20:00',
          remind_minutes_before: res.remind_minutes_before || 15,
        });
      }
    } catch (err) {
      console.error('Failed to load study plan', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateStudyPlan({
        ...plan,
        user_id: '' // API might not strictly need user_id from frontend if token exists, or we leave it empty.
      });
      alert("O'quv rejasi muvaffaqiyatli saqlandi!");
    } catch (err) {
      console.error('Failed to save study plan', err);
      alert("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#F8FAFC',
      padding: '24px 20px',
      overflowY: 'auto'
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
            border: '2px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0F172A',
            boxShadow: '0 2px 0 #E2E8F0',
          }}
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <h1 style={{
          flex: 1,
          fontSize: '20px',
          fontWeight: 800,
          color: '#0F172A',
          margin: 0,
          textAlign: 'center',
          paddingRight: 40,
        }}>
          O'quv rejasi
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 40 }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16A34A',
                }}>
                  <CalendarDays size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>Eslatmalar</h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Har kuni keys yechishni eslatish</p>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <div 
                onClick={() => setPlan({ ...plan, is_enabled: !plan.is_enabled })}
                style={{
                  width: 52,
                  height: 32,
                  borderRadius: 16,
                  background: plan.is_enabled ? '#10B981' : '#E2E8F0',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
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
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>

            {plan.is_enabled && (
              <div style={{ borderTop: '2px solid #F1F5F9', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                    Eslatma vaqti
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Clock size={20} color="#94A3B8" />
                    <input 
                      type="time" 
                      value={plan.remind_time}
                      onChange={(e) => setPlan({ ...plan, remind_time: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#0F172A',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                    Qancha vaqt oldin
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <BellRing size={20} color="#94A3B8" />
                    <select 
                      value={plan.remind_minutes_before}
                      onChange={(e) => setPlan({ ...plan, remind_minutes_before: parseInt(e.target.value) })}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#0F172A',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    >
                      <option value={5}>5 daqiqa oldin</option>
                      <option value={15}>15 daqiqa oldin</option>
                      <option value={30}>30 daqiqa oldin</option>
                      <option value={60}>1 soat oldin</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '16px',
              borderRadius: 16,
              background: '#10B981',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              opacity: saving ? 0.7 : 1,
              marginTop: 10,
            }}
          >
            <Save size={20} />
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      )}
    </div>
  );
}
