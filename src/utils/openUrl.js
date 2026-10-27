export function openExternalUrl(url) {
  if (!url) return;
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
  if (tg && typeof tg.openTelegramLink === 'function' && /t\.me\//i.test(url)) {
    tg.openTelegramLink(url);
    return;
  }
  if (tg && typeof tg.openLink === 'function') {
    tg.openLink(url);
    return;
  }
  const w = window.open(url, '_blank');
  if (!w) window.location.href = url;
}
