import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, ListChecks, X } from 'lucide-react';
import { api } from '../../api';
import { useTranslation } from '../../i18n.jsx';
import { formatTitle } from '../../views/CategoriesView.jsx';

const DIFFICULTIES = [
  { id: 'random', labelKey: 'modal.randomDifficulty', fallback: "— Istalgan qiyinlik —" },
  { id: 'easy', labelKey: 'modal.easy', fallback: 'Oson' },
  { id: 'medium', labelKey: 'modal.medium', fallback: "O'rta" },
  { id: 'hard', labelKey: 'modal.hard', fallback: 'Qiyin' },
];

export default function KeysConfigModal({
  open,
  onClose,
  categories = [],
  lockedCategory = null,
  lockedTopic = null,
  onStart,
}) {
  const { t } = useTranslation();
  const locked = Boolean(lockedCategory?.id && lockedTopic?.id);
  const [mode, setMode] = useState('case');
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [selectedTopic, setSelectedTopic] = useState('random');
  const [difficulty, setDifficulty] = useState('random');
  const [count, setCount] = useState(10);
  const [topics, setTopics] = useState([]);

  const categoryValue = lockedCategory?.id ? String(lockedCategory.id) : selectedCategory;
  const topicValue = lockedTopic?.id ? String(lockedTopic.id) : selectedTopic;

  useEffect(() => {
    if (!open) return;
    setMode('case');
    setDifficulty('random');
    setCount(10);
    if (!lockedCategory?.id) setSelectedCategory('random');
    if (!lockedTopic?.id) setSelectedTopic('random');
  }, [open, lockedCategory?.id, lockedTopic?.id]);

  useEffect(() => {
    if (!open || locked || !categoryValue || categoryValue === 'random') {
      setTopics([]);
      return undefined;
    }
    let live = true;
    api.getTopics(categoryValue)
      .then((list) => {
        if (live) setTopics(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (live) setTopics([]);
      });
    return () => { live = false; };
  }, [open, locked, categoryValue]);

  if (!open) return null;

  const showTopic = locked || categoryValue !== 'random';
  const difficultyStep = showTopic ? 4 : 3;
  const countStep = difficultyStep + 1;
  const lockedCategoryName = formatTitle(lockedCategory?.name || lockedCategory?.title || '');
  const lockedTopicName = formatTitle(lockedTopic?.title || lockedTopic?.name || '');

  const handleLaunch = () => {
    onStart?.({
      mode,
      categoryId: categoryValue === 'random' ? null : categoryValue,
      topicId: topicValue === 'random' ? null : topicValue,
      difficulty: difficulty === 'random' ? null : difficulty,
      count: mode === 'test' ? Math.min(50, Math.max(1, Number(count) || 10)) : undefined,
    });
  };

  const modeBtn = (id) => ({
    flex: 1,
    background: mode === id ? 'var(--accent)' : '#F1F5F9',
    color: mode === id ? '#fff' : '#334155',
    border: 'none',
  });

  return createPortal(
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className="ui-card ui-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>
            {mode === 'test'
              ? t('modal.configTitleTest', 'Test sozlamalari')
              : t('modal.configTitle')}
          </h3>
          <button className="ui-icon-btn" onClick={onClose} aria-label="Close" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="ui-label">{t('modal.stepMode', '1. MASHQ TURINI TANLANG')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="ui-btn" style={modeBtn('case')} onClick={() => setMode('case')}>
              <BookOpen size={16} />
              {t('home.startCase', 'Keys yechish')}
            </button>
            <button type="button" className="ui-btn" style={modeBtn('test')} onClick={() => setMode('test')}>
              <ListChecks size={16} />
              {t('home.startTest', 'Test yechish')}
            </button>
          </div>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="ui-label">
            {t('modal.step1', "{n}. BO'LIMNI TANLANG").replace('{n}', '2')}
          </span>
          <select
            className="ui-select"
            value={categoryValue}
            disabled={locked}
            onChange={(e) => {
              if (locked) return;
              setSelectedCategory(e.target.value);
              setSelectedTopic('random');
            }}
          >
            {!locked && <option value="random">{t('modal.randomOption')}</option>}
            {locked && lockedCategory?.id && (
              <option value={String(lockedCategory.id)}>{lockedCategoryName}</option>
            )}
            {!locked && categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{formatTitle(cat.name || cat.title)}</option>
            ))}
          </select>
        </label>

        {showTopic && (
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="ui-label">
              {t('modal.stepTopic', '{n}. MAVZUNI TANLANG').replace('{n}', '3')}
            </span>
            <select
              className="ui-select"
              value={topicValue}
              disabled={locked}
              onChange={(e) => {
                if (locked) return;
                setSelectedTopic(e.target.value);
              }}
            >
              {!locked && <option value="random">{t('modal.randomTopic')}</option>}
              {locked && lockedTopic?.id && (
                <option value={String(lockedTopic.id)}>{lockedTopicName}</option>
              )}
              {!locked && topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {formatTitle(topic.title || topic.name)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="ui-label">
            {t('modal.step2', '{n}. QIYINCHILIK DARAJASINI TANLANG').replace('{n}', String(difficultyStep))}
          </span>
          <select
            className="ui-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {DIFFICULTIES.map((item) => (
              <option key={item.id} value={item.id}>
                {t(item.labelKey, item.fallback)}
              </option>
            ))}
          </select>
        </label>

        {mode === 'test' && (
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="ui-label">
              {t('modal.stepCount', '{n}. SAVOLLAR SONI').replace('{n}', String(countStep))}
            </span>
            <input
              className="ui-select"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </label>
        )}

        <button id="btn-start-case-modal" className="ui-btn ui-btn-primary ui-btn-block" onClick={handleLaunch}>
          {t('modal.startBtn')}
        </button>
      </div>
    </div>,
    document.body,
  );
}
