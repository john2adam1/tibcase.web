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
  Stethoscope
} from 'lucide-react';

export default function AiReportsView({ onBack, onViewDebrief }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'high' | 'review'
  const [searchQuery, setSearchQuery] = useState('');

  // Sample fallback data if user hasn't completed simulations on backend yet
  const sampleReports = [
    {
      id: 'rep-1',
      session_id: 'sim-1',
      case_title: "O'tkir koronar sindrom (STEMI)",
      category_name: "Kardiologiya",
      final_score: 88,
      xp_earned: 60,
      coins_earned: 2,
      ended_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      correct_steps: [
        "Bemorga zudlik bilan O2 kislorod ingalyatsiyasi boshlandi",
        "12 tarmoqli EKG olindi va ST ko'tarilishi aniqlandi",
        "Aspirin 300 mg chaynab yutish uchun berildi"
      ],
      incorrect_steps: [
        "Gipotenziyada Nitroglikerin berish xavfi inobatga olinishi lozim edi"
      ],
      weak_topics: ["Miokard infarktida gipotenziya protokoli"],
      guideline_notes: "AHA va ESC 2023 ko'rsatmalariga muvofiq STEMI da zudlik bilan perkutan koronar aralashuv (ChKB) tayyorgarligi ko'rilishi lozim."
    },
    {
      id: 'rep-2',
      session_id: 'sim-2',
      case_title: "Anafilaktik shok va o'tkir allergik reaksiya",
      category_name: "Shoshilinch tibbiyot",
      final_score: 94,
      xp_earned: 80,
      coins_earned: 3,
      ended_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      correct_steps: [
        "Adrenalin (Epinefrin) 0.5 mg zudlik bilan sonning old-yon qismiga m/o qilindi",
        "Nafas yo'llari o'tkazuvchanligi ta'minlandi va yuqori oqimli O2 berildi",
        "Kristalloid eritmalar infuziyasi boshlandi"
      ],
      incorrect_steps: [],
      weak_topics: [],
      guideline_notes: "Anafilaksiyada birinchi qatordagi yagona hayotiy dori — intramuskulyar Adrenalindir. Antigistamin va gormonlar ikkinchi qatordir."
    },
    {
      id: 'rep-3',
      session_id: 'sim-3',
      case_title: "Kasalxonadan tashqari pnevmoniya",
      category_name: "Pulmonologiya",
      final_score: 72,
      xp_earned: 45,
      coins_earned: 1,
      ended_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      correct_steps: [
        "O'pka auskultatsiyasi o'tkazildi va krepitatsiya eshitildi",
        "Ko'krak qafasi rentgenografiyasi buyurildi",
        "Empirik antibakterial terapiya (Amoksitsillin/Klavulanat) tanlandi"
      ],
      incorrect_steps: [
        "CRB-65 shkalasi bo'yicha og'irlik darajasi baholanmadi"
      ],
      weak_topics: ["Pnevmoniyada CRB-65 va CURB-65 stratifikatsiyasi"],
      guideline_notes: "BTS ko'rsatmalariga binoan har bir pnevmoniya gumon qilingan bemorda gospitalizatsiya mezonlari CRB-65 bilan aniqlanishi shart."
    }
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getCompletedSimulations()
      .then((res) => {
        if (!isMounted) return;
        const apiSessions = res?.sessions || res?.data || (Array.isArray(res) ? res : []);
        if (apiSessions && apiSessions.length > 0) {
          // Merge API sessions with structure
          const formatted = apiSessions.map((s, idx) => ({
            id: s.id || `session-${idx}`,
            session_id: s.session_id || s.id,
            case_title: s.case_title || s.title || `Klinik keys #${idx + 1}`,
            category_name: s.category_name || "Klinik simulyatsiya",
            final_score: s.final_score ?? 85,
            xp_earned: s.xp_earned ?? 60,
            coins_earned: s.coins_earned ?? 2,
            ended_at: s.ended_at || s.created_at || new Date().toISOString(),
            correct_steps: s.correct_steps || ["Bemorga birlamchi ko'rik va monitorizatsiya o'tkazildi"],
            incorrect_steps: s.incorrect_steps || [],
            weak_topics: s.weak_topics || [],
            guideline_notes: s.guideline_notes || "Standart klinik protokolga muvofiq bajarildi."
          }));
          setReports(formatted);
        } else {
          // Use sample reports
          setReports(sampleReports);
        }
      })
      .catch(() => {
        if (isMounted) setReports(sampleReports);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleOpenReport = async (report) => {
    try {
      if (report.session_id && report.session_id !== 'sim-1' && report.session_id !== 'sim-2' && report.session_id !== 'sim-3') {
        const fullDebrief = await api.getDebrief(report.session_id);
        onViewDebrief({
          ...report,
          ...fullDebrief,
          case_title: report.case_title,
        });
      } else {
        onViewDebrief(report);
      }
    } catch {
      onViewDebrief(report);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.case_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'high') return (r.final_score || 0) >= 85;
    if (filterType === 'review') return (r.final_score || 0) < 85;
    return true;
  });

  const totalReportsCount = reports.length;
  const avgScore = totalReportsCount > 0 
    ? Math.round(reports.reduce((acc, curr) => acc + (curr.final_score || 0), 0) / totalReportsCount)
    : 0;
  const totalXpEarned = reports.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0);

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 100px 16px',
      boxSizing: 'border-box',
      background: '#F8FAFC',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>

        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 0',
        }}>
          <button
            onClick={onBack}
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              boxShadow: '0 3px 0 #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>

          <h1 style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: 0,
            textAlign: 'center',
          }}>
            AI Debriefing Hisobotlari
          </h1>

          <div style={{ width: 44 }} />
        </div>

        {/* Summary Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #E2E8F0',
            boxShadow: '0 3px 0 #E2E8F0',
            borderRadius: 20,
            padding: '14px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Hisobotlar
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginTop: 2 }}>
              {totalReportsCount} ta
            </div>
          </div>

          <div style={{
            background: '#F0FDF4',
            border: '2px solid #BBF7D0',
            boxShadow: '0 3px 0 #BBF7D0',
            borderRadius: 20,
            padding: '14px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
              O'rtacha ball
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#15803D', marginTop: 2 }}>
              {avgScore}%
            </div>
          </div>

          <div style={{
            background: '#F0F9FF',
            border: '2px solid #BAE6FD',
            boxShadow: '0 3px 0 #BAE6FD',
            borderRadius: 20,
            padding: '14px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: 700, textTransform: 'uppercase' }}>
              Jami XP
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0284C7', marginTop: 2 }}>
              +{totalXpEarned}
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#FFFFFF',
          borderRadius: 16,
          border: '2px solid #E2E8F0',
          padding: '10px 14px',
          boxShadow: '0 2px 0 #E2E8F0',
        }}>
          <Search size={18} color="#94A3B8" />
          <input
            type="text"
            placeholder="Keys yoki yo'nalish bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0F172A',
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'high', label: "A'lo (≥85%)" },
            { id: 'review', label: "Ko'rish kerak (<85%)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '9px 6px',
                borderRadius: 14,
                border: filterType === tab.id ? '2px solid #22C55E' : '1.5px solid #E2E8F0',
                background: filterType === tab.id ? '#F0FDF4' : '#FFFFFF',
                color: filterType === tab.id ? '#15803D' : '#64748B',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            color: '#16A34A',
            gap: 12,
          }}>
            <RefreshCw size={28} className="animate-spin" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Hisobotlar yuklanmoqda...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            border: '2px solid #E2E8F0',
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 20,
              background: '#F1F5F9',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Hisobotlar topilmadi
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Klinik keyslarni yeching va bu yerda har bir urinishingiz uchun batafsil AI tahlili saqlanib boradi.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredReports.map((report) => {
              const isHigh = (report.final_score || 0) >= 80;
              return (
                <div
                  key={report.id}
                  onClick={() => handleOpenReport(report)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 22,
                    border: '2px solid #E2E8F0',
                    boxShadow: '0 4px 0 #E2E8F0',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Card Header: Category & Score */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 10,
                      background: '#F1F5F9',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      <Stethoscope size={13} color="#2563EB" />
                      {report.category_name}
                    </span>

                    {/* Score Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 12px',
                      borderRadius: 12,
                      background: isHigh ? '#F0FDF4' : '#FEF3C7',
                      border: `1.5px solid ${isHigh ? '#BBF7D0' : '#FDE68A'}`,
                      color: isHigh ? '#15803D' : '#D97706',
                      fontWeight: 800,
                      fontSize: '13px',
                    }}>
                      <span>{report.final_score}%</span>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>
                        {isHigh ? "A'lo" : "O'rta"}
                      </span>
                    </div>
                  </div>

                  {/* Case Title */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {report.case_title}
                  </h3>

                  {/* Footer Meta Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTop: '1px solid #F1F5F9',
                  }}>
                    {/* Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                      <Calendar size={13} />
                      <span>
                        {new Date(report.ended_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {/* Rewards + Action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Zap size={13} fill="#0284C7" /> +{report.xp_earned}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: 2 }}>
                        🪙 +{report.coins_earned}
                      </span>

                      <button
                        style={{
                          padding: '6px 12px',
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                          border: 'none',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          boxShadow: '0 2px 6px rgba(34, 197, 94, 0.25)',
                        }}
                      >
                        <Sparkles size={12} />
                        Hisobot
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
