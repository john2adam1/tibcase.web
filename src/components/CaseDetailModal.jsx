import React from 'react';
import {
  Activity,
  ArrowRight,
  Clock,
  Heart,
  Play,
  Shield,
  Stethoscope,
  User,
  X,
  Zap
} from 'lucide-react';

export default function CaseDetailModal({
  caseItem,
  onClose,
  onStartSimulation,
  onToggleFavorite,
}) {
  if (!caseItem) return null;

  const diffColor = caseItem.difficulty === 'easy' ? '#10b981' : caseItem.difficulty === 'medium' ? '#f59e0b' : '#ef4444';
  const diffLabel = caseItem.difficulty === 'easy' ? 'Oson' : caseItem.difficulty === 'medium' ? "O'rta" : 'Qiyin';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 32,
          position: 'relative',
          background: 'linear-gradient(180deg, #0e172a 0%, #070d18 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <X size={18} />
        </button>

        {/* Category & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          {caseItem.category_name && (
            <span className="badge badge-cyan">
              {caseItem.category_name}
            </span>
          )}
          <span style={{
            fontSize: '0.75rem',
            padding: '3px 10px',
            borderRadius: 6,
            fontWeight: 700,
            background: 'rgba(15, 23, 42, 0.8)',
            color: diffColor,
            border: `1px solid ${diffColor}`,
          }}>
            {diffLabel}
          </span>
          <button
            onClick={() => onToggleFavorite(caseItem.id)}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              color: caseItem.is_favorite ? '#f43f5e' : 'var(--text-muted)',
            }}
          >
            <Heart size={16} fill={caseItem.is_favorite ? '#f43f5e' : 'none'} />
            <span>{caseItem.is_favorite ? "Sevimlilarda" : "Sevimlilarga qo'shish"}</span>
          </button>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.6rem', marginBottom: 12, lineHeight: 1.3 }}>
          {caseItem.title}
        </h2>

        {/* Demographic & Meta info bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          padding: '12px 18px',
          borderRadius: 12,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
            <User size={16} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--text-secondary)' }}>Bemor:</span>
            <strong style={{ color: '#fff' }}>
              {caseItem.patient_gender === 'female' ? 'Ayol' : 'Erkak'}, {caseItem.patient_age || 45} yosh
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
            <Clock size={16} color="var(--accent-amber)" />
            <span style={{ color: 'var(--text-secondary)' }}>Kutilayotgan vaqt:</span>
            <strong style={{ color: '#fff' }}>{caseItem.expected_duration_minutes || 5} daqiqa</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
            <Zap size={16} color="#34d399" />
            <span style={{ color: 'var(--text-secondary)' }}>Mukofot:</span>
            <strong style={{ color: '#34d399' }}>+60 XP • +2 Tanga</strong>
          </div>
        </div>

        {/* Chief Complaint Description */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Dastlabki Shikoyat va Klinik Manzara
          </h4>
          <div style={{
            padding: 18,
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#e2e8f0',
            whiteSpace: 'pre-line',
          }}>
            {caseItem.chief_complaint}
          </div>
        </div>

        {/* Expected clinical goals */}
        <div style={{
          padding: 16,
          borderRadius: 12,
          background: 'rgba(6, 182, 212, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          marginBottom: 28,
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: 6 }}>
            Klinik Vazifangiz:
          </div>
          <ul style={{ paddingLeft: 20, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>Bemor shikoyatlarini aniqlashtirish va anamnez yig'ish;</li>
            <li>Fizik ko'rik va zarur instrumental diagnostika (EKG, Troponin) o'tkazish;</li>
            <li>Shoshilinch muolajalar va xalqaro protokollar bo'yicha to'g'ri dori dozasini belgilash;</li>
            <li>Aniq yakuniy klinik tashxis qo'yish va reanimatsiya taktikasini tanlash.</li>
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '12px 20px' }}
          >
            Bekor qilish
          </button>

          <button
            onClick={() => {
              onClose();
              onStartSimulation(caseItem);
            }}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem' }}
          >
            <Play size={18} fill="#fff" />
            <span>Simulyatsiyani Boshlash</span>
          </button>
        </div>
      </div>
    </div>
  );
}
