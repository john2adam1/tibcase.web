import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Sparkles,
  ChevronLeft,
  Calendar,
  Zap,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Stethoscope,
  Inbox
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function AiReportsView({ onBack, onViewDebrief }) {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'high' | 'review'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getCompletedSimulations()
      .then((res) => {
        if (!isMounted) return;
        const apiSessions = res?.sessions || (Array.isArray(res) ? res : []);
        if (Array.isArray(apiSessions)) {
          setReports(apiSessions);
        } else {
          setReports([]);
        }
      })
      .catch((err) => {
        console.warn('Completed simulations fetch handled:', err.message);
        if (isMounted) setReports([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Filter & Search Logic
  const filteredReports = reports.filter((rep) => {
    const matchesQuery = !searchQuery.trim() ||
      rep.case_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.case_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const score = rep.final_score ?? 0;
    if (filterType === 'high') return matchesQuery && score >= 85;
    if (filterType === 'review') return matchesQuery && score < 75;
    return matchesQuery;
  });

  const getScoreBadge = (score) => {
    if (score >= 85) {
      return {
        bg: '#DCFCE7',
        border: '#86EFAC',
        text: '#16A34A',
        label: 'Aʼlo (Klinik protokolga mos)'
      };
    }
    if (score >= 70) {
      return {
        bg: '#FEF9C3',
        border: '#FDE047',
        text: '#CA8A04',
        label: 'Qoniqarli'
      };
    }
    return {
      bg: '#FEE2E2',
      border: '#FCA5A5',
      text: '#DC2626',
      label: 'Qayta koʻrib chiqish zarur'
    };
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 100px 16px',
      background: '#F8FAFC',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 820,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {/* Header: Back Button + Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '8px 4px',
        }}>
          {onBack && (
            <button
              onClick={onBack}
              title="Orqaga"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#FFFFFF',
                border: '2px solid #E2E8F0',
                boxShadow: '0 2px 0 #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
                transition: 'all 0.15s ease',
              }}
            >
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
          )}

          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              AI Klinik Debriefing Hisobotlari
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              margin: '4px 0 0 0',
              fontWeight: 500,
            }}>
              Yakunlangan simulyatsiyalar tahlili va klinik xulosalar
            </p>
          </div>
        </div>

        {/* Toolbar: Search + Filter Tabs */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 22,
          border: '1.5px solid #E2E8F0',
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1 1 240px',
            minWidth: 200,
          }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Keys nomi boʻyicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                borderRadius: 14,
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                color: '#0F172A',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{
            display: 'inline-flex',
            background: '#F1F5F9',
            borderRadius: 14,
            padding: 4,
            gap: 4,
          }}>
            {[
              { id: 'all', label: `Barchasi (${reports.length})` },
              { id: 'high', label: 'Yuqori (85%+)' },
              { id: 'review', label: 'Tahlil talab' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: filterType === tab.id ? '#FFFFFF' : 'transparent',
                  color: filterType === tab.id ? '#0F172A' : '#64748B',
                  fontWeight: filterType === tab.id ? 800 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: filterType === tab.id ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748B',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <RefreshCw size={28} className="spin" color="#16A34A" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Hisobotlar yuklanmoqda...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredReports.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 26,
            border: '2px solid #E2E8F0',
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
            }}>
              <Inbox size={32} />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
            }}>
              Hozircha debriefing hisobotlari yoʻq
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              margin: 0,
              maxWidth: 380,
              lineHeight: 1.5,
            }}>
              Klinik keys simulyatsiyasini yakunlaganingizdan soʻng, bu yerda batafsil tahlil va xulosalar paydo boʻladi.
            </p>
          </div>
        )}

        {/* Reports Cards List */}
        {!loading && filteredReports.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {filteredReports.map((rep) => {
              const score = rep.final_score ?? 0;
              const badge = getScoreBadge(score);

              return (
                <div
                  key={rep.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 24,
                    border: '1.5px solid #E2E8F0',
                    padding: '22px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  {/* Top: Title + Score Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 220 }}>
                      <h3 style={{
                        fontSize: '17px',
                        fontWeight: 900,
                        color: '#0F172A',
                        margin: 0,
                        lineHeight: 1.3,
                      }}>
                        {rep.case_title || `Klinik keys #${rep.case_id || rep.id}`}
                      </h3>
                      {rep.ended_at && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '12px',
                          color: '#64748B',
                          fontWeight: 600,
                        }}>
                          <Calendar size={13} />
                          <span>{new Date(rep.ended_at).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Final Score Pill */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: badge.bg,
                      border: `1.5px solid ${badge.border}`,
                      color: badge.text,
                      padding: '6px 14px',
                      borderRadius: 14,
                      fontWeight: 900,
                      fontSize: '15px',
                    }}>
                      <Award size={18} />
                      <span>{score}%</span>
                    </div>
                  </div>

                  {/* Rewards summary bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '10px 14px',
                    background: '#F8FAFC',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}>
                    {rep.xp_earned !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16A34A' }}>
                        <Zap size={15} color="#16A34A" />
                        <span>+{rep.xp_earned} XP</span>
                      </div>
                    )}
                    {rep.coins_earned !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#D97706' }}>
                        <Coins size={15} color="#D97706" />
                        <span>+{rep.coins_earned} tanga</span>
                      </div>
                    )}
                    {rep.health_percent !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#DC2626' }}>
                        <Stethoscope size={15} color="#DC2626" />
                        <span>Bemor holati: {rep.health_percent}%</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button: Open Detailed Debrief */}
                  {onViewDebrief && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <button
                        onClick={() => onViewDebrief(rep.id || rep.session_id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 16px',
                          borderRadius: 12,
                          background: '#F1F5F9',
                          border: '1.5px solid #E2E8F0',
                          color: '#0F172A',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#E2E8F0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F1F5F9';
                        }}
                      >
                        <span>Debriefingni koʻrish</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
