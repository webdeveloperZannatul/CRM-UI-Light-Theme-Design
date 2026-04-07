/**
 * CRM Lead Detail — script.js
 * Handles: tab switching · action item completion · KPI animation
 */

/* ── Tab Switching ─────────────────────────────────────────── */
const tabs    = document.querySelectorAll('.tab');
const panels  = document.querySelectorAll('.panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update active tab
    tabs.forEach(t => {
      t.classList.remove('tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('tab--active');
    tab.setAttribute('aria-selected', 'true');

    // Show matching panel
    panels.forEach(panel => {
      if (panel.id === `tab-${target}`) {
        panel.classList.remove('hidden');
        // Re-trigger animation
        panel.style.animation = 'none';
        void panel.offsetWidth; // reflow
        panel.style.animation = '';
      } else {
        panel.classList.add('hidden');
      }
    });
  });
});

/* ── Action Item Completion ────────────────────────────────── */
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.action-item');

    if (btn.classList.contains('done')) {
      // Undo
      btn.classList.remove('done');
      item.style.opacity = '';
      item.querySelector('.action-text').style.textDecoration = '';
    } else {
      // Complete with a brief animation
      btn.classList.add('done');
      item.style.opacity = '.5';
      item.querySelector('.action-text').style.textDecoration = 'line-through';
    }
  });
});

/* ── KPI Counter Animation ─────────────────────────────────── */
/**
 * Animate a numeric value from 0 to its target on page load.
 */
function animateCount(el, target, duration = 600) {
  const start     = performance.now();
  const isFloat   = String(target).includes('.');
  const decimals  = isFloat ? String(target).split('.')[1].length : 0;

  function update(now) {
    const elapsed  = Math.min(now - start, duration);
    const progress = elapsed / duration;
    // ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = eased * target;

    el.textContent = isFloat
      ? current.toFixed(decimals)
      : Math.round(current).toString();

    if (elapsed < duration) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Animate KPI chips that contain pure numbers
document.querySelectorAll('.kpi-value').forEach(el => {
  const raw = el.textContent.trim();
  // Skip values that contain letters (e.g. "8 days")
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const target = parseFloat(raw);
    el.textContent = '0';
    // Slight delay so the page paints first
    setTimeout(() => animateCount(el, target, 700), 200);
  }
});

/* ── Classify Select: visual feedback ─────────────────────── */
const classifySelect = document.getElementById('classify-select');

classifySelect.addEventListener('change', () => {
  const val = classifySelect.value;

  // Flash a subtle confirmation (could expand to toast notification)
  classifySelect.style.borderColor = '#16a34a';
  classifySelect.style.boxShadow   = '0 0 0 3px rgba(22,163,74,.15)';

  setTimeout(() => {
    classifySelect.style.borderColor = '';
    classifySelect.style.boxShadow   = '';
  }, 1200);

  console.info(`[CRM] Lead classified as: "${val}"`);
});
