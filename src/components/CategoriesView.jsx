import React from 'react';
import {
  ChevronLeft,
  Heart,
  Stethoscope,
  Truck,
  Brain,
  Scissors,
  Users,
  Bone,
  Layers,
  Star,
  Sparkles
} from 'lucide-react';

export const CLINIC_CATEGORIES = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    waiting: '20 Cases Waiting',
    starColor: '#EF4444',
    iconBg: '#FEE2E2',
    iconBorder: '#FCA5A5',
    emoji: '❤️',
    icon: Heart,
    casesCount: 20
  },
  {
    id: 'internal',
    title: 'Internal Medicine',
    waiting: '20 Cases Waiting',
    starColor: '#10B981',
    iconBg: '#E0F2FE',
    iconBorder: '#7DD3FC',
    emoji: '🩺',
    icon: Stethoscope,
    casesCount: 20
  },
  {
    id: 'emergency',
    title: 'Emergency Medicine',
    waiting: '20 Cases Waiting',
    starColor: '#F97316',
    iconBg: '#FFEDD5',
    iconBorder: '#FDBA74',
    emoji: '🚑',
    icon: Truck,
    casesCount: 20
  },
  {
    id: 'neurology',
    title: 'Neurology',
    waiting: '20 Cases Waiting',
    starColor: '#3B82F6',
    iconBg: '#FCE7F3',
    iconBorder: '#F472B6',
    emoji: '🧠',
    icon: Brain,
    casesCount: 20
  },
  {
    id: 'surgery',
    title: 'General Surgery',
    waiting: '20 Cases Waiting',
    starColor: '#10B981',
    iconBg: '#CCFBF1',
    iconBorder: '#5EEAD4',
    emoji: '🔬',
    icon: Scissors,
    casesCount: 20
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics',
    waiting: '20 Cases Waiting',
    starColor: '#EAB308',
    iconBg: '#FEF9C3',
    iconBorder: '#FDE047',
    emoji: '👨‍👩‍👧',
    icon: Users,
    casesCount: 20
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics',
    waiting: '20 Cases Waiting',
    starColor: '#F59E0B',
    iconBg: '#FFEDD5',
    iconBorder: '#FDBA74',
    emoji: '🦴',
    icon: Bone,
    casesCount: 20
  },
  {
    id: 'dermatology',
    title: 'Dermatology',
    waiting: '20 Cases Waiting',
    starColor: '#8B5CF6',
    iconBg: '#EDE9FE',
    iconBorder: '#C4B5FD',
    emoji: '🩹',
    icon: Layers,
    casesCount: 20
  }
];

export default function CategoriesView({
  onSelectCategory,
  onBack
}) {
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
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '8px 4px 12px 4px',
        }}>
          {onBack && (
            <button
              onClick={onBack}
              title="Orqaga"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 0 #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
              }}
            >
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
          )}

          <h1 style={{
            flex: 1,
            fontSize: '24px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: 0,
            textAlign: 'center',
            paddingRight: onBack ? 40 : 0,
          }}>
            All Categories
          </h1>
        </div>

        {/* Categories 2-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
          width: '100%',
        }}>
          {CLINIC_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => onSelectCategory(cat)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 24,
                  border: '2px solid #E2E8F0',
                  boxShadow: '0 4px 0 #E2E8F0, 0 8px 16px rgba(0, 0, 0, 0.02)',
                  padding: '18px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 0 #E2E8F0, 0 12px 24px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 0 #E2E8F0, 0 8px 16px rgba(0, 0, 0, 0.02)';
                }}
              >
                {/* Icon Container with subtle tinted rounded border */}
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: cat.iconBg,
                  border: `2px solid ${cat.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}>
                  <span>{cat.emoji}</span>
                </div>

                {/* Details */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 6px 0',
                    lineHeight: 1.25,
                  }}>
                    {cat.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748B',
                  }}>
                    <Star size={13} fill={cat.starColor} color={cat.starColor} />
                    <span>{cat.waiting}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
