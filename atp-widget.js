/**
 * AI Transparency Protocol — Client Widget v2.0
 * 
 * Inline contextual disclosure badge (NOT a pop-up or overlay).
 * Designed as a "chamäleon" that inherits the host site's typography
 * and adapts via CSS custom properties for white-label deployment.
 * 
 * Fulfills Art. 50 Abs. 5: "clear and distinguishable" + accessible.
 * 
 * Usage:
 *   <script src="atp-widget.js" defer></script>
 * 
 * Theming (optional — override in your own CSS):
 *   :root {
 *     --atp-bg: #f3f4f6;
 *     --atp-text: #374151;
 *     --atp-accent: #6d28d9;
 *     --atp-radius: 4px;
 *     --atp-font-size: 0.85em;
 *   }
 * 
 * Anchor (optional — specify where to inject):
 *   <script src="atp-widget.js" data-atp-anchor="h1" defer></script>
 *   <script src="atp-widget.js" data-atp-anchor="#article-meta" defer></script>
 *   <script src="atp-widget.js" data-atp-position="footer" defer></script>
 */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────
  const MANIFEST_PATH = '/.well-known/ai-transparency.json';

  const ATS_LABELS = {
    'ATS-0': { emoji: '✍️', label: 'Fully Human', short: 'Human' },
    'ATS-1': { emoji: '✍️', label: 'Human with AI Tools', short: 'AI-assisted' },
    'ATS-1T': { emoji: '✍️', label: 'AI-translated', short: 'AI-translated' },
    'ATS-2': { emoji: '✨', label: 'Co-Creative', short: 'AI co-created' },
    'ATS-3': { emoji: '✨', label: 'AI-Drafted', short: 'AI-drafted' },
    'ATS-4': { emoji: '🤖', label: 'AI-Generated', short: 'AI-generated' },
    'ATS-5': { emoji: '🤖', label: 'Autonomous AI', short: 'Autonomous AI' }
  };

  // ── Styles (injected into Shadow DOM) ───────────────────
  const STYLES = `
    :host {
      display: inline;
      font-family: inherit;
      line-height: inherit;
    }

    .atp-badge {
      /* Chamäleon: inherit site typography, use CSS vars for colors */
      font-family: inherit;
      font-size: var(--atp-font-size, 0.85em);
      color: var(--atp-text, #374151);
      background: var(--atp-bg, #f3f4f6);
      border: 1px solid var(--atp-border, rgba(0,0,0,0.08));
      border-radius: var(--atp-radius, 4px);
      padding: 3px 8px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s ease, box-shadow 0.15s ease;
      position: relative;
      vertical-align: baseline;
      white-space: nowrap;
      user-select: none;
      -webkit-user-select: none;
    }

    .atp-badge:hover {
      background: var(--atp-bg-hover, #e5e7eb);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .atp-badge:focus-visible {
      outline: 2px solid var(--atp-accent, #6d28d9);
      outline-offset: 2px;
    }

    .atp-sparkle {
      font-style: normal;
      font-size: 1em;
      line-height: 1;
    }

    .atp-label {
      font-weight: 500;
    }

    .atp-tier {
      font-size: 0.8em;
      opacity: 0.7;
      font-weight: 400;
    }

    /* ── Tooltip / Progressive Disclosure Panel ── */
    .atp-panel {
      display: none;
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--atp-panel-bg, #1f2937);
      color: var(--atp-panel-text, #f9fafb);
      border-radius: 8px;
      padding: 14px 16px;
      min-width: 260px;
      max-width: 320px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      font-size: 0.82em;
      line-height: 1.5;
      z-index: 10000;
      white-space: normal;
      text-align: left;
    }

    .atp-panel::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: var(--atp-panel-bg, #1f2937);
    }

    :host([data-position="footer"]) .atp-panel,
    .atp-panel--above {
      bottom: calc(100% + 8px);
      top: auto;
    }

    .atp-badge[aria-expanded="true"] + .atp-panel,
    .atp-panel.atp-panel--open {
      display: block;
      animation: atp-fade-in 0.15s ease;
    }

    @keyframes atp-fade-in {
      from { opacity: 0; transform: translateX(-50%) translateY(4px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    .atp-panel-title {
      font-weight: 600;
      font-size: 1em;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .atp-panel-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .atp-panel-row:last-of-type {
      border-bottom: none;
    }

    .atp-panel-key {
      opacity: 0.65;
      font-size: 0.9em;
    }

    .atp-panel-val {
      font-weight: 500;
      font-size: 0.9em;
    }

    .atp-compliant {
      color: #4ade80;
    }

    .atp-panel-link {
      display: block;
      margin-top: 10px;
      color: var(--atp-accent, #a78bfa);
      text-decoration: none;
      font-size: 0.85em;
      opacity: 0.85;
    }

    .atp-panel-link:hover {
      opacity: 1;
      text-decoration: underline;
    }

    /* ── Footer mode: centered block ── */
    :host([data-position="footer"]) {
      display: block;
      text-align: center;
      margin-top: 1.5em;
      padding-top: 1em;
      border-top: 1px solid var(--atp-border, rgba(0,0,0,0.06));
    }

    :host([data-position="footer"]) .atp-badge {
      font-size: var(--atp-font-size, 0.8em);
      opacity: 0.7;
    }

    :host([data-position="footer"]) .atp-badge:hover {
      opacity: 1;
    }

    /* ── Reduced Motion ── */
    @media (prefers-reduced-motion: reduce) {
      .atp-badge, .atp-panel { transition: none; animation: none; }
    }

    /* ── Print: show as static text ── */
    @media print {
      .atp-panel { display: none !important; }
      .atp-badge { background: none; border: none; padding: 0; cursor: default; }
      .atp-badge::after { content: ' (ai-transparency.json)'; font-size: 0.8em; opacity: 0.5; }
    }
  `;

  // ── Scope Matching ──────────────────────────────────────
  function globToRegex(pattern) {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    return new RegExp('^' + escaped + '$');
  }

  function matchPolicy(policies, pathname) {
    if (!policies || !policies.length) return null;

    let bestMatch = null;
    let bestSpecificity = -1;

    for (const policy of policies) {
      const scopes = Array.isArray(policy.scope) ? policy.scope : [policy.scope];
      for (const scope of scopes) {
        const regex = globToRegex(scope);
        if (regex.test(pathname)) {
          // More specific = fewer wildcards = higher priority
          const specificity = scope.replace(/\*/g, '').length;
          if (specificity > bestSpecificity) {
            bestSpecificity = specificity;
            bestMatch = policy;
          }
        }
      }
    }
    return bestMatch;
  }

  // ── Widget Creation ─────────────────────────────────────
  function createWidget(manifest, policy) {
    const tier = policy.ats_tier || 'ATS-0';
    const info = ATS_LABELS[tier] || ATS_LABELS['ATS-0'];
    const extent = policy.ats_extent || '';
    const hasOversight = policy.human_oversight !== false;
    const policyUrl = manifest.transparency_policy_url || '';
    const isDeepfake = policy.deepfake_disclosure === true;
    const editorial = policy.editorial_responsibility || '';

    // ── Host element ──
    const host = document.createElement('span');
    host.id = 'atp-widget';

    // Determine position mode
    const scriptTag = document.currentScript || document.querySelector('script[src*="atp-widget"]');
    const positionMode = scriptTag?.getAttribute('data-atp-position') || 'inline';
    if (positionMode === 'footer') {
      host.setAttribute('data-position', 'footer');
    }

    const shadow = host.attachShadow({ mode: 'open' });

    // ── Inject styles ──
    const style = document.createElement('style');
    style.textContent = STYLES;
    shadow.appendChild(style);

    // ── Badge (the tiny inline pill) ──
    const badge = document.createElement('button');
    badge.className = 'atp-badge';
    badge.setAttribute('role', 'button');
    badge.setAttribute('aria-expanded', 'false');
    badge.setAttribute('aria-label', `AI Transparency: ${info.label} (${tier})`);
    badge.setAttribute('tabindex', '0');

    badge.innerHTML = `
      <span class="atp-sparkle">${info.emoji}</span>
      <span class="atp-label">${info.short}</span>
      <span class="atp-tier">${tier}</span>
    `;

    // ── Panel (progressive disclosure on click) ──
    const panel = document.createElement('div');
    panel.className = 'atp-panel';
    panel.setAttribute('role', 'tooltip');
    panel.id = 'atp-details';

    let panelHTML = `
      <div class="atp-panel-title">${info.emoji} ${info.label}</div>
      <div class="atp-panel-row">
        <span class="atp-panel-key">Tier</span>
        <span class="atp-panel-val">${tier}${extent ? ' · ' + extent : ''}</span>
      </div>
      <div class="atp-panel-row">
        <span class="atp-panel-key">Scope</span>
        <span class="atp-panel-val">${Array.isArray(policy.scope) ? policy.scope.join(', ') : policy.scope}</span>
      </div>
      <div class="atp-panel-row">
        <span class="atp-panel-key">Human Oversight</span>
        <span class="atp-panel-val">${hasOversight ? '✓ Yes' : '✗ No'}</span>
      </div>
    `;

    if (isDeepfake) {
      panelHTML += `
        <div class="atp-panel-row">
          <span class="atp-panel-key">Deepfake</span>
          <span class="atp-panel-val" style="color:#fbbf24">⚠ Disclosed</span>
        </div>
      `;
    }

    if (editorial) {
      panelHTML += `
        <div class="atp-panel-row">
          <span class="atp-panel-key">Editorial</span>
          <span class="atp-panel-val">${editorial}</span>
        </div>
      `;
    }

    if (policy.description) {
      panelHTML += `
        <div class="atp-panel-row">
          <span class="atp-panel-key">Info</span>
          <span class="atp-panel-val">${policy.description}</span>
        </div>
      `;
    }

    // EU AI Act status
    if (manifest.eu_ai_act?.article_50_compliant) {
      panelHTML += `
        <div class="atp-panel-row">
          <span class="atp-panel-key">EU AI Act Art. 50</span>
          <span class="atp-panel-val atp-compliant">✓ Compliant</span>
        </div>
      `;
    }

    if (policyUrl) {
      panelHTML += `<a class="atp-panel-link" href="${policyUrl}" target="_blank" rel="noopener">View Transparency Policy →</a>`;
    }

    panel.innerHTML = panelHTML;

    // ── Interactivity ──
    let isOpen = false;

    function toggle() {
      isOpen = !isOpen;
      badge.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        panel.classList.add('atp-panel--open');
      } else {
        panel.classList.remove('atp-panel--open');
      }
    }

    function close() {
      if (isOpen) {
        isOpen = false;
        badge.setAttribute('aria-expanded', 'false');
        panel.classList.remove('atp-panel--open');
      }
    }

    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    badge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape') {
        close();
      }
    });

    // Close on outside click
    document.addEventListener('click', close);

    // ── Assemble ──
    shadow.appendChild(badge);
    shadow.appendChild(panel);

    return host;
  }

  // ── Injection Logic ─────────────────────────────────────
  function injectWidget(widget) {
    const scriptTag = document.currentScript || document.querySelector('script[src*="atp-widget"]');
    const anchorSelector = scriptTag?.getAttribute('data-atp-anchor');
    const positionMode = scriptTag?.getAttribute('data-atp-position') || 'inline';

    // Mode 1: Explicit anchor — inject after the specified element
    if (anchorSelector) {
      const anchor = document.querySelector(anchorSelector);
      if (anchor) {
        anchor.insertAdjacentElement('afterend', widget);
        console.log(`[ATP Widget] Injected after "${anchorSelector}"`);
        return;
      }
    }

    // Mode 2: Footer — append to body as a discrete footnote
    if (positionMode === 'footer') {
      const footer = document.querySelector('footer') || document.body;
      footer.appendChild(widget);
      console.log('[ATP Widget] Injected as footer');
      return;
    }

    // Mode 3: Auto-detect — find the best anchor point
    const anchors = [
      'article header',      // Blog/news article header
      '.post-meta',          // WordPress-style post metadata
      '.article-meta',       // Generic article meta
      '.byline',             // Author byline
      'main h1',             // Main heading
      '.hero h1',            // Hero heading
      'h1',                  // Any h1
    ];

    for (const sel of anchors) {
      const el = document.querySelector(sel);
      if (el) {
        el.insertAdjacentElement('afterend', widget);
        console.log(`[ATP Widget] Auto-injected after "${sel}"`);
        return;
      }
    }

    // Fallback: discrete footer-style at bottom
    widget.setAttribute('data-position', 'footer');
    document.body.appendChild(widget);
    console.log('[ATP Widget] Fallback: injected at body end');
  }

  // ── Init ────────────────────────────────────────────────
  function init() {
    fetch(MANIFEST_PATH)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(manifest => {
        const pathname = window.location.pathname;
        const policy = matchPolicy(manifest.policies, pathname);

        if (!policy) {
          console.log(`[ATP Widget] No policy matched for ${pathname}`);
          return;
        }

        const widget = createWidget(manifest, policy);
        injectWidget(widget);
        console.log(`[ATP Widget] ${pathname} → ${policy.ats_tier}`);
      })
      .catch(err => {
        console.warn('[ATP Widget] Could not load manifest:', err.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
