import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  Heart,
  Lock,
  Play,
  Search,
  Sparkles,
  Stethoscope,
  UserCheck
} from 'lucide-react';

export default function CasesCatalog({
  cases = [],
  categories = [],
  onSelectCase,
  onToggleFavorite,
  onStartSimulation,
  loading = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedDiff, setSelectedDiff] = useState('all');

  const filteredCases = cases.filter(c => {
    const matchesCat = selectedCat === 'all' || c.category_id === selectedCat || c.category_name?.toLowerCase() === selectedCat.toLowerCase();
    const matchesDiff = selectedDiff === 'all' || c.difficulty === selectedDiff;
    const matchesQuery = !searchQuery.trim() ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chief_complaint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDiff && matchesQuery;
  });

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 28,
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--accent-cyan)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 6,
          }}>
            <BookOpen size={16} />
            <span>Klinik Amaliyot Kutubxonasi</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
            Klinik Keyslar Katalogi
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Haqiqiy holatlar, shoshilinch alomatlar va AI virtual bemorlar
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          padding: '8px 16px',
        }}>
          <Activity size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Mavjud keyslar: <strong style={{ color: '#fff' }}>{cases.length} ta</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{
        padding: '18px 20px',
        marginBottom: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
        }}>
          {/* Search Box */}
          <div style={{
            flex: 1,
            minWidth: 260,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(10, 16, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            padding: '10px 14px',
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Keys nomi, simptom yoki shikoyat bo'yicha qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                width: '100%',
                fontSize: '0.92rem',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
              >
                Tozalash
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(10, 16, 30, 0.6)',
            padding: 4,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'easy', label: 'Oson' },
              { id: 'medium', label: "O'rta" },
              { id: 'hard', label: 'Qiyin' },
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDiff(d.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: selectedDiff === d.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: selectedDiff === d.id ? '#38bdf8' : 'var(--text-secondary)',
                  border: selectedDiff === d.id ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          <button
            onClick={() => setSelectedCat('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: '0.82rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: selectedCat === 'all' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: selectedCat === 'all' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: selectedCat === 'all' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Barcha bo'limlar
          </button>

          {categories.map(cat => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Grid */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 24,
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel skeleton-shimmer" style={{ height: 380, borderRadius: 18 }} />
          ))}
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="glass-panel" style={{
          padding: 60,
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}>
          <Stethoscope size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: 8 }}>
            Hech qanday keys topilmadi
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: 440, margin: '0 auto' }}>
            Qidiruv so'zini yoki tanlangan filtrlarni o'zgartirib ko'ring.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 24,
        }}>
          {filteredCases.map(item => {
            const diffColor = item.difficulty === 'easy' ? '#10b981' : item.difficulty === 'medium' ? '#f59e0b' : '#ef4444';
            const diffLabel = item.difficulty === 'easy' ? 'Oson' : item.difficulty === 'medium' ? "O'rta" : 'Qiyin';

            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(56, 189, 248, 0.16)',
                }}
              >
                {/* Cover Image or Medical Gradient Fallback */}
                <div style={{
                  height: 180,
                  position: 'relative',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  overflow: 'hidden',
                }}>
                  {item.cover_image_url ? (
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg, rgba(14, 23, 42, 0.95) 0%, transparent 60%)',
                  }} />

                  {/* Top Badges */}
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    right: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    {item.category_name && (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'rgba(6, 182, 212, 0.25)',
                        backdropFilter: 'blur(8px)',
                        color: '#38bdf8',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                      }}>
                        {item.category_name}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.is_favorite ? '#f43f5e' : 'var(--text-muted)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Heart size={16} fill={item.is_favorite ? '#f43f5e' : 'none'} />
                    </button>
                  </div>

                  {/* Difficulty Tag */}
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: diffColor,
                      border: `1px solid ${diffColor}`,
                    }}>
                      {diffLabel}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: 'var(--text-secondary)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                      <Clock size={12} />
                      <span>{item.expected_duration_minutes || 5} daqiqa</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}>
                  {/* Patient Tag */}
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                    marginBottom: 6,
                  }}>
                    Bemor: {item.patient_gender === 'female' ? 'Ayol' : 'Erkak'}, {item.patient_age || 45} yosh
                  </div>

                  <h3 style={{
                    fontSize: '1.15rem',
                    lineHeight: 1.3,
                    marginBottom: 10,
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: 20,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1,
                  }}>
                    {item.chief_complaint}
                  </p>

                  {/* Actions footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <button
                      onClick={() => onSelectCase(item)}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        fontSize: '0.88rem',
                      }}
                    >
                      Batafsil
                    </button>

                    <button
                      onClick={() => onStartSimulation(item)}
                      className="btn-primary"
                      style={{
                        flex: 1.2,
                        padding: '10px 14px',
                        fontSize: '0.88rem',
                      }}
                    >
                      <Play size={16} fill="#fff" />
                      <span>Simulyatsiya</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
