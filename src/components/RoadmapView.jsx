import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Heart,
  Lock,
  Sparkles,
  Inbox
} from 'lucide-react';
import { api } from '../api';

export default function RoadmapView({
  category,
  onSelectNode,
  onBack
}) {
  const [topics, setTopics] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryId = category?.id;

  useEffect(() => {
    let isMounted = true;

    async function loadRoadmapData() {
      if (!categoryId) return;
      try {
        setLoading(true);
        const [topicsData, casesData] = await Promise.all([
          api.getTopics(categoryId),
          api.getCases({ category_id: categoryId, limit: 100 })
        ]);

        if (isMounted) {
          setTopics(topicsData || []);
          setCases(casesData || []);
        }
      } catch (err) {
        console.error('Roadmap data load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRoadmapData();

    return () => { isMounted = false; };
  }, [categoryId]);

  const categoryTitle = category?.title || (category?.name ? category.name.charAt(0).toUpperCase() + category.name.slice(1) : 'Kategoriya');
  const totalCasesCount = cases.length;
  const completedCount = cases.filter(c => c.status === 'completed' || c.status === 'passed').length;

  // Build nodes based strictly on API topics (or cases if no topics created yet)
  const roadmapNodes = topics.length > 0
    ? topics.map((top, idx) => {
        const topicCases = cases.filter(c => c.topic_id === top.id);
        const casesInTopic = topicCases.length || 1;
        return {
          id: top.id,
          title: top.name || `${idx + 1}-mavzu`,
          casesCount: casesInTopic,
          cases: topicCases,
          isUnlocked: idx === 0, // first topic unlocked
          xp: 250 + (idx * 50),
          xOffset: idx === 0 ? 0 : (idx % 2 === 1 ? 50 : -45)
        };
      })
    : (cases.length > 0 ? [{
        id: 'default-topic-1',
        title: cases[0].title || '1-mavzu',
        casesCount: cases.length,
        cases: cases,
        isUnlocked: true,
        xp: 250,
        xOffset: 0
      }] : []);

  // Helper to render SVG segmented ring based on cases count (how many parts the circle is divided into)
  const renderSegmentedRing = (count) => {
    const radius = 41;
    const circumference = 2 * Math.PI * radius; // ~257.6
    const numSegments = Math.max(1, count);
    const gap = numSegments > 1 ? 12 : 0;
    const dashLength = (circumference / numSegments) - gap;

    return (
      <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute', top: 0, left: 0 }}>
        {Array.from({ length: numSegments }).map((_, i) => (
          <circle
            key={i}
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke="#FDBA74"
            strokeWidth="3.5"
            strokeDasharray={`${dashLength} ${gap}`}
            strokeDashoffset={-i * (dashLength + gap)}
          />
        ))}
      </svg>
    );
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 100px 16px',
      background: '#FFFDF9',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Header: Back button + Category Icon & Title + Progress */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 4px 18px 4px',
          gap: 12,
        }}>
          <button
            onClick={onBack}
            title="Orqaga"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              boxShadow: '0 2px 0 #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <span style={{ fontSize: '24px' }}>{category?.emoji || '❤️'}</span>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#EA580C',
              margin: 0,
            }}>
              {categoryTitle}
            </h2>
          </div>

          {/* Progress pill: e.g. 0/1 */}
          <div style={{
            background: '#FFEDD5',
            border: '1.5px solid #FDBA74',
            borderRadius: 99,
            padding: '4px 12px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#EA580C',
          }}>
            {completedCount}/{totalCasesCount}
          </div>
        </div>

        {/* Section Card — faqat API dan ma'lumot kelgandan keyin ko'rsatiladi */}
        {!loading && topics.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            borderRadius: 28,
            boxShadow: '0 8px 0 #C2410C, 0 16px 28px rgba(234, 88, 12, 0.25)',
            padding: '22px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            color: '#FFFFFF',
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px',
                color: '#FED7AA',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {topics.length}. SECTION
              </div>
              <div style={{
                fontSize: '22px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
              }}>
                {topics[0].name?.toUpperCase()}
              </div>
            </div>

            <div style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BookOpen size={24} color="#FFFFFF" strokeWidth={2.4} />
            </div>
          </div>
        )}

        {/* Loading paytida skeleton card */}
        {loading && (
          <div style={{
            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
            borderRadius: 28,
            boxShadow: '0 8px 0 #C2410C',
            padding: '22px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            opacity: 0.5,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ width: 80, height: 12, background: 'rgba(255,255,255,0.4)', borderRadius: 6 }} />
              <div style={{ width: 140, height: 22, background: 'rgba(255,255,255,0.4)', borderRadius: 6 }} />
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Mavzular yuklanmoqda...</div>
          </div>
        )}

        {/* Empty state: No topics or cases */}
        {!loading && roadmapNodes.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '36px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <Inbox size={44} color="#94A3B8" />
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Ushbu bo'limda hali keyslar mavjud emas
            </div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              API orqali keyslar kiritilganda bu yerda Duolingo yo'lakchasi paydo bo'ladi.
            </div>
          </div>
        )}

        {/* Roadmap Path */}
        {!loading && roadmapNodes.length > 0 && (
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0 60px 0',
          }}>
            {/* SVG S-Curve Path connecting nodes */}
            {roadmapNodes.length > 1 && (
              <svg
                style={{
                  position: 'absolute',
                  top: 40,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <path
                  d="M 240,50 Q 280,110 290,170 T 200,290 T 170,410"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {roadmapNodes.map((node, index) => {
              const activeCaseItem = node.cases?.[0] || cases[0];

              if (node.isUnlocked) {
                return (
                  <div
                    key={node.id}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginBottom: 50,
                      transform: `translateX(${node.xOffset}px)`,
                    }}
                  >
                    {/* "START" pill label */}
                    <div style={{
                      background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                      color: '#FFFFFF',
                      borderRadius: 99,
                      padding: '4px 14px',
                      fontSize: '11px',
                      fontWeight: 900,
                      letterSpacing: '0.8px',
                      boxShadow: '0 3px 0 #C2410C',
                      marginBottom: 8,
                    }}>
                      START
                    </div>

                    {/* Circular Node with Segmented Ring */}
                    <div
                      id={`roadmap-node-${node.id}`}
                      onClick={() => onSelectNode(activeCaseItem)}
                      title={node.title}
                      style={{
                        position: 'relative',
                        width: 90,
                        height: 90,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      {/* Segmented Ring showing number of cases inside */}
                      {renderSegmentedRing(node.casesCount)}

                      {/* Inner Solid Orange Circle Button */}
                      <div style={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                        boxShadow: '0 6px 0 #C2410C, 0 10px 20px rgba(234, 88, 12, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Heart size={32} color="#FFFFFF" fill="#FFFFFF" />
                      </div>
                    </div>

                    {/* XP Badge */}
                    <div style={{
                      marginTop: 10,
                      background: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: 99,
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#64748B',
                      boxShadow: '0 2px 0 #E2E8F0',
                    }}>
                      ~{node.xp} XP ({node.casesCount} case)
                    </div>
                  </div>
                );
              }

              // Locked Node
              return (
                <div
                  key={node.id}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    transform: `translateX(${node.xOffset}px)`,
                    marginBottom: 50,
                  }}
                >
                  <div style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: '#E2E8F0',
                    boxShadow: '0 5px 0 #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                  }}>
                    <Lock size={26} strokeWidth={2.5} />
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
