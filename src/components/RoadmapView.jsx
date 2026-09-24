import React from 'react';
import {
  ChevronLeft,
  BookOpen,
  Heart,
  Lock,
  Sparkles,
  Award
} from 'lucide-react';

export default function RoadmapView({
  category = {
    id: 'emergency',
    title: 'Emergency Medicine',
    emoji: '🚑',
    casesCount: 60,
    solvedCount: 0
  },
  onSelectNode,
  onBack
}) {
  // Demo nodes on the roadmap:
  // Node 1: Unlocked (Active) - 3 cases inside (segmented circle)
  // Node 2, 3, 4: Locked
  const nodes = [
    {
      id: 'node-1',
      title: 'Anaphylaxis & Shock',
      casesCount: 3,
      completedCases: 0,
      xp: 250,
      isUnlocked: true,
      icon: Heart,
      xOffset: 0, // centered
    },
    {
      id: 'node-2',
      title: 'Acute Coronary Syndrome',
      casesCount: 4,
      completedCases: 0,
      xp: 300,
      isUnlocked: false,
      xOffset: 50, // shifted right
    },
    {
      id: 'node-3',
      title: 'Polytrauma Management',
      casesCount: 3,
      completedCases: 0,
      xp: 350,
      isUnlocked: false,
      xOffset: -40, // shifted left
    },
    {
      id: 'node-4',
      title: 'Acute Respiratory Failure',
      casesCount: 4,
      completedCases: 0,
      xp: 400,
      isUnlocked: false,
      xOffset: -70,
    }
  ];

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
        {/* Header: Back button + Category Icon & Title + Progress "0/60" */}
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
            <span style={{ fontSize: '24px' }}>{category.emoji || '🚑'}</span>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#EA580C',
              margin: 0,
            }}>
              {category.title}
            </h2>
          </div>

          {/* Progress pill: e.g. 0/60 */}
          <div style={{
            background: '#FFEDD5',
            border: '1.5px solid #FDBA74',
            borderRadius: 99,
            padding: '4px 12px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#EA580C',
          }}>
            {category.solvedCount || 0}/{category.casesCount || 60}
          </div>
        </div>

        {/* Section Card (Orange claymorphic card) */}
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
              1. SECTION
            </div>
            <div style={{
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}>
              FUNDAMENTALS
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

        {/* Roadmap Path Container */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0 60px 0',
        }}>
          {/* SVG S-Curve Path connecting nodes */}
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

          {/* Node 1: Active / Start Node */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 50,
          }}>
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
              animation: 'bounce 2s infinite',
            }}>
              START
            </div>

            {/* Circular Node with Segmented Ring (User noted: segmented ring indicates cases inside) */}
            <div
              id="roadmap-node-start"
              onClick={() => onSelectNode(nodes[0])}
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
              {/* Outer Segmented Ring SVG (3 segments representing 3 cases) */}
              <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Segment 1 */}
                <circle
                  cx="45"
                  cy="45"
                  r="41"
                  fill="none"
                  stroke="#FDBA74"
                  strokeWidth="3.5"
                  strokeDasharray="75 12"
                  strokeDashoffset="0"
                />
                {/* Segment 2 */}
                <circle
                  cx="45"
                  cy="45"
                  r="41"
                  fill="none"
                  stroke="#FDBA74"
                  strokeWidth="3.5"
                  strokeDasharray="75 12"
                  strokeDashoffset="87"
                />
                {/* Segment 3 */}
                <circle
                  cx="45"
                  cy="45"
                  r="41"
                  fill="none"
                  stroke="#FDBA74"
                  strokeWidth="3.5"
                  strokeDasharray="75 12"
                  strokeDashoffset="174"
                />
              </svg>

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

            {/* ~250 XP Badge below active node */}
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
              ~250 XP
            </div>
          </div>

          {/* Node 2: Locked (shifted right) */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            transform: 'translateX(50px)',
            marginBottom: 50,
          }}>
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

          {/* Node 3: Locked (shifted left) */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            transform: 'translateX(-40px)',
            marginBottom: 50,
          }}>
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

          {/* Node 4: Locked (shifted further left) */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            transform: 'translateX(-70px)',
          }}>
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
        </div>
      </div>
    </div>
  );
}
