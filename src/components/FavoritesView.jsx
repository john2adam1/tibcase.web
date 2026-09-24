import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function FavoritesView({ onBack, onSelectCase }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.getFavorites(50, 1);
        setCases(res.cases || []);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

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
          Saqlangan keyslar
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 40 }}>Loading...</div>
      ) : cases.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 60,
          textAlign: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: '#DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Bookmark size={32} color="#3B82F6" strokeWidth={2} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
            Hozircha bo'sh
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Siz saqlagan keyslar shu yerda paydo bo'ladi
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase && onSelectCase(c)}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '2px solid #E2E8F0',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                boxShadow: '0 4px 0 #E2E8F0',
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Image Thumbnail */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                background: '#F1F5F9',
                backgroundImage: c.cover_image_url ? `url(${c.cover_image_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #E2E8F0',
              }} />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  {c.title || 'Noma\'lum keys'}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    {c.expected_duration_minutes || 0} daq
                  </span>
                  <span style={{
                    color: c.difficulty === 'hard' ? '#EF4444' : c.difficulty === 'medium' ? '#F59E0B' : '#10B981',
                    textTransform: 'capitalize'
                  }}>
                    {c.difficulty}
                  </span>
                </div>
              </div>

              <div style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B'
              }}>
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
