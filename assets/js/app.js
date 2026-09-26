/* ============================================
   PNDA-Cultura — Logique principale (M3)
   Version complète avec icônes Material
   ============================================ */

'use strict';

/* ──────────────────────────────────────────
   0. UTILITAIRES — Icônes Material & helpers
────────────────────────────────────────── */

/**
 * Génère le HTML d'une icône Material Symbol.
 * @param {string} name       - Nom de l'icône (ex: 'home', 'eco', 'smart_toy')
 * @param {Object} [opts]     - Options
 * @param {boolean} [opts.filled=false] - Icône remplie (FILL 1)
 * @param {string}  [opts.size='']      - Taille inline (ex: '24px')
 * @param {string}  [opts.className=''] - Classes CSS additionnelles
 * @param {string}  [opts.color='']     - Couleur inline
 * @returns {string} HTML de l'icône
 */
function icon(name, opts = {}) {
  const { filled = false, size = '', className = '', color = '' } = opts;
  const styles = [];
  if (size)  styles.push(`font-size:${size}`);
  if (color) styles.push(`color:${color}`);
  const styleAttr = styles.length ? ` style="${styles.join(';')}"` : '';
  const classes = ['material-symbols-rounded', filled ? 'filled' : '', className]
    .filter(Boolean).join(' ');
  return `<span class="${classes}"${styleAttr}>${name}</span>`;
}

/**
 * Formate un nombre en FC avec séparateurs français.
 * @param {number} value
 * @returns {string} ex: "142 300 FC"
 */
function formatFC(value) {
  return Math.round(value).toLocaleString('fr-FR') + ' FC';
}

/**
 * Formate un nombre avec séparateurs français.
 * @param {number} value
 * @returns {string} ex: "142 300"
 */
function formatNumber(value) {
  return Math.round(value).toLocaleString('fr-FR');
}

/**
 * Récupère la date du jour formatée en français.
 * @returns {string} ex: "mardi 5 mai 2026"
 */
function todayFR() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

/**
 * Échappe le HTML pour éviter les injections.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/* ──────────────────────────────────────────
   1. NAVIGATION
────────────────────────────────────────── */

/**
 * Affiche un écran par son ID, masque les autres.
 * @param {string} id - ID de l'élément .screen cible
 */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.scrollTop = 0;
    window.scrollTo(0, 0);
    // Reset scroll interne si présent
    const scrollArea = el.querySelector('.scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;
  }
}

/**
 * Active un onglet et affiche son contenu.
 * @param {HTMLElement} btn - Le bouton onglet cliqué
 * @param {string} tabId    - ID du panneau à afficher
 */
function switchTab(btn, tabId) {
  const screen = btn.closest('.screen');
  if (!screen) return;
  screen.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  screen.querySelectorAll('[data-tab]').forEach(t => {
    t.style.display = t.dataset.tab === tabId ? '' : 'none';
  });
}


/* ──────────────────────────────────────────
   2. TÂCHES — Cocher / décocher
────────────────────────────────────────── */

/**
 * Bascule l'état d'une tâche (cochée / non cochée).
 * @param {HTMLElement} row - La ligne .task-row
 */
function toggleTask(row) {
  const box  = row.querySelector('.task-check');
  const text = row.querySelector('.task-text');
  if (!box || !text) return;
  const done = box.classList.toggle('done');
  box.innerHTML = done ? icon('check', { size: '16px' }) : '';
  text.classList.toggle('done', done);

  // Feedback haptique léger si supporté
  if (navigator.vibrate) navigator.vibrate(10);
}


/* ──────────────────────────────────────────
   3. FORMULAIRE VENTE — Calcul automatique
────────────────────────────────────────── */

function initSaleForm() {
  const qty   = document.getElementById('sale-qty');
  const price = document.getElementById('sale-price');
  const total = document.getElementById('sale-total');
  if (!qty || !price || !total) return;

  function update() {
    const q = parseFloat(qty.value)   || 0;
    const p = parseFloat(price.value) || 0;
    total.textContent = (q && p) ? formatFC(q * p) : '—';
  }
  qty.addEventListener('input', update);
  price.addEventListener('input', update);
}


/* ──────────────────────────────────────────
   4. CALCULATEUR DE CRÉDIT
────────────────────────────────────────── */

function calcLoan() {
  const M   = parseFloat(document.getElementById('loan-amount')?.value)   || 0;
  const r   = parseFloat(document.getElementById('loan-rate')?.value)     || 0;
  const n   = parseInt  (document.getElementById('loan-months')?.value)   || 0;
  const rev = parseFloat(document.getElementById('loan-income')?.value)   || 0;

  const elMens  = document.getElementById('loan-monthly');
  const elTotal = document.getElementById('loan-total');
  const elInt   = document.getElementById('loan-interest');
  const elRatio = document.getElementById('loan-ratio');

  if (!M || !r || !n) {
    [elMens, elTotal, elInt, elRatio].forEach(el => { if (el) el.textContent = '—'; });
    return;
  }

  const rm    = r / 100 / 12;
  const mens  = rm
    ? M * rm * Math.pow(1 + rm, n) / (Math.pow(1 + rm, n) - 1)
    : M / n;
  const total = mens * n;
  const inter = total - M;
  const ratio = rev > 0 ? (mens / rev * 100) : 0;

  const fmt = v => formatNumber(v) + ' FC';
  if (elMens)  elMens.textContent  = fmt(mens);
  if (elTotal) elTotal.textContent = fmt(total);
  if (elInt)   elInt.textContent   = fmt(inter);
  if (elRatio) {
    elRatio.textContent = ratio.toFixed(1) + '%';
    elRatio.style.color = ratio > 33 ? 'var(--error)' : 'var(--primary-dark)';
  }
}


/* ──────────────────────────────────────────
   5. INTÉGRATION API CLAUDE (IA)
────────────────────────────────────────── */

/**
 * Ouvre le panneau IA et envoie un prompt à Claude.
 * En production : remplacer l'appel direct par un proxy backend.
 * @param {string} prompt - La question à poser
 */
async function askAI(prompt) {
  const panel  = document.getElementById('ai-panel');
  const output = document.getElementById('ai-output');

  if (!panel || !output) {
    // Fallback : ouvre Claude.ai dans un nouvel onglet avec le prompt
    window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, '_blank');
    return;
  }

  panel.style.display = 'flex';
  output.innerHTML = `
    <div class="ai-loading">
      <span>Analyse IA en cours…</span>
    </div>`;
  output.scrollTop = 0;

  try {
    const API_KEY = localStorage.getItem('pnda_api_key') || '';

    if (!API_KEY) {
      output.innerHTML = `
        <div class="ai-msg">
          <p><strong>Clé API non configurée</strong></p>
          <p style="margin-top:8px;font-size:12.5px;color:var(--on-surface-var)">
            Allez dans Paramètres → Clé API pour configurer votre accès à l'IA.
          </p>
          <button class="form-btn" style="margin-top:16px" onclick="closeAI();goTo('s-settings')">
            ${icon('key', { size: '20px' })}
            Configurer
          </button>
        </div>`;
      return;
    }

    // ⚠️ NE PAS exposer la clé API côté client en production.
    // Utiliser un proxy : Supabase Edge Function, Cloudflare Worker, etc.
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: `Tu es un conseiller agricole expert pour l'Afrique centrale (RDC, Kasaï).
Tu donnes des conseils pratiques, concis et adaptés au contexte local.
Réponds en français, de façon structurée et actionnable.
Évite le jargon inutile — l'utilisateur est un agriculteur de terrain.`,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    const data = await res.json();
    const text = data.content?.[0]?.text || 'Aucune réponse reçue.';

    output.innerHTML = `<div class="ai-msg">${formatAIResponse(text)}</div>`;
    output.scrollTop = 0;

  } catch (err) {
    console.error('AI Error:', err);
    output.innerHTML = `
      <div class="ai-msg ai-error">
        <p><strong>Impossible de joindre l'IA</strong></p>
        <p style="font-size:12px;color:var(--on-surface-var);margin-top:6px">
          Vérifiez votre connexion et votre clé API.
        </p>
      </div>`;
  }
}

/**
 * Formate la réponse IA : sauts de ligne → paragraphes, **gras**, listes.
 * @param {string} text - Texte brut renvoyé par l'API
 * @returns {string} HTML formaté
 */
function formatAIResponse(text) {
  // Échapper le HTML basique pour éviter les injections
  let safe = escapeHTML(text);

  // Gras **texte**
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Listes à puces simples
  safe = safe.replace(/^[\-\*]\s+(.+)$/gm, '• $1');

  // Titres ## Titre
  safe = safe.replace(
    /^#{1,3}\s+(.+)$/gm,
    '<strong style="display:block;margin-top:8px">$1</strong>'
  );

  // Paragraphes
  safe = safe
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');

  return safe;
}

/**
 * Ferme le panneau IA.
 */
function closeAI() {
  const panel = document.getElementById('ai-panel');
  if (panel) panel.style.display = 'none';
}

// Fermer le panneau avec la touche Échap
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAI();
});


/* ──────────────────────────────────────────
   6. PARAMÈTRES — Clé API
────────────────────────────────────────── */

function saveApiKey() {
  const key = document.getElementById('api-key-input')?.value?.trim();
  if (!key || key.startsWith('••')) {
    showToast('Entrez une nouvelle clé API', 'error');
    return;
  }
  localStorage.setItem('pnda_api_key', key);
  showToast('Clé API enregistrée ✓');
}

function loadSettings() {
  const input = document.getElementById('api-key-input');
  if (!input) return;
  const saved = localStorage.getItem('pnda_api_key') || '';
  input.value = saved ? '••••••••' + saved.slice(-4) : '';
  input.placeholder = saved ? 'Clé enregistrée' : 'Collez votre clé API ici';
}


/* ──────────────────────────────────────────
   7. TOAST — Notification légère
────────────────────────────────────────── */

let toastTimer = null;

/**
 * Affiche un toast en bas de l'écran.
 * @param {string} msg  - Message à afficher
 * @param {'success'|'error'} [type='success']
 */
function showToast(msg, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  clearTimeout(toastTimer);

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-show'));

  toastTimer = setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}


/* ──────────────────────────────────────────
   8. JOURNAL — Enregistrer une entrée
────────────────────────────────────────── */

function saveJournalEntry() {
  const title = document.getElementById('journal-title')?.value?.trim();
  const body  = document.getElementById('journal-body')?.value?.trim();

  if (!title || !body) {
    showToast('Remplissez le titre et la description', 'error');
    return;
  }

  const entries = JSON.parse(localStorage.getItem('journal') || '[]');
  entries.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('fr-FR'),
    title,
    body
  });
  localStorage.setItem('journal', JSON.stringify(entries));
  showToast('Entrée enregistrée ✓');
  goTo('s-journal');
}


/* ──────────────────────────────────────────
   9. VENTE — Enregistrer
────────────────────────────────────────── */

function saveSale() {
  const product = document.getElementById('sale-product')?.value;
  const qty     = parseFloat(document.getElementById('sale-qty')?.value)   || 0;
  const price   = parseFloat(document.getElementById('sale-price')?.value) || 0;

  if (!product || !qty || !price) {
    showToast('Remplissez tous les champs', 'error');
    return;
  }

  const total = qty * price;
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  sales.unshift({
    id: Date.now(),
    product, qty, price, total,
    date: new Date().toLocaleDateString('fr-FR')
  });
  localStorage.setItem('sales', JSON.stringify(sales));
  showToast(`Vente enregistrée : ${formatFC(total)} ✓`);
  goTo('s-finances');
}


/* ──────────────────────────────────────────
   10. RACCOURCIS CLAVIER & GESTES
────────────────────────────────────────── */

// Navigation rapide avec Alt + 1..5
document.addEventListener('keydown', e => {
  if (!e.altKey) return;
  const map = {
    '1': 's-home',
    '2': 's-parcelles',
    '3': 's-finances',
    '4': 's-marche',
    '5': 's-comm'
  };
  const target = map[e.key];
  if (target) {
    e.preventDefault();
    goTo(target);
  }
});


/* ──────────────────────────────────────────
   11. ANIMATIONS — Cartes en cascade
────────────────────────────────────────── */

/**
 * Ajoute un léger stagger aux cartes à l'affichage.
 */
function animateCards() {
  const cards = document.querySelectorAll(
    '.screen.active .card, .screen.active .module-card, .screen.active .journal-entry'
  );
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';
    card.style.transition = `opacity 0.3s cubic-bezier(0.2,0,0,1) ${i * 30}ms, transform 0.3s cubic-bezier(0.2,0,0,1) ${i * 30}ms`;
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  });
}


/* ──────────────────────────────────────────
   12. INITIALISATION
────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initSaleForm();
  loadSettings();

  // Délégation : cocher les tâches (hors clic sur un lien/bouton)
  document.addEventListener('click', e => {
    const taskRow = e.target.closest('.task-row');
    if (!taskRow) return;
    if (e.target.closest('button, a, [role="button"]')) return;
    toggleTask(taskRow);
  });

  // Petite animation d'entrée pour les cartes visibles
  animateCards();

  // PWA : Service Worker (si disponible)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Pas de SW en dev local — silencieux
    });
  }
});

/* ──────────────────────────────────────────
   14. ALERTES — Popover du header
────────────────────────────────────────── */

function toggleAlerts() {
  const popover = document.getElementById('alerts-popover');
  if (popover) popover.classList.toggle('show');
}

// Fermer le popover si on clique ailleurs
document.addEventListener('click', e => {
  const popover = document.getElementById('alerts-popover');
  if (!popover || !popover.classList.contains('show')) return;
  if (e.target.closest('.alert-btn') || e.target.closest('.alerts-popover')) return;
  popover.classList.remove('show');
});


/* ──────────────────────────────────────────
   15. TÂCHES — Créer une nouvelle tâche
────────────────────────────────────────── */

function saveTask() {
  const title = document.getElementById('task-title')?.value?.trim();
  if (!title) {
    showToast('Entrez un intitulé de tâche', 'error');
    return;
  }
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.unshift({ id: Date.now(), title, done: false, date: new Date().toLocaleDateString('fr-FR') });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  showToast('Tâche créée ✓');
  goTo('s-taches');
}


/* ──────────────────────────────────────────
   16. PARAMÈTRES — Export & suppression
────────────────────────────────────────── */

function exportData() {
  const data = {
    journal: JSON.parse(localStorage.getItem('journal') || '[]'),
    sales:   JSON.parse(localStorage.getItem('sales')   || '[]'),
    tasks:   JSON.parse(localStorage.getItem('tasks')   || '[]'),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pnda-cultura-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export téléchargé ✓');
}

function clearData() {
  if (!confirm('Effacer toutes les données locales ? Cette action est irréversible.')) return;
  ['journal','sales','tasks'].forEach(k => localStorage.removeItem(k));
  showToast('Données effacées');
}

window.PNDA = {
  icon, formatFC, formatNumber, todayFR, escapeHTML,
  goTo, switchTab, toggleTask,
  calcLoan,
  askAI, closeAI, formatAIResponse,
  saveApiKey, loadSettings,
  saveJournalEntry, saveSale, saveTask,
  showToast, animateCards,
  toggleAlerts, exportData, clearData
};

/* ──────────────────────────────────────────
   13. EXPORTS (pour tests éventuels)
────────────────────────────────────────── */

if (typeof window !== 'undefined') {
  window.PNDA = {
    icon,
    formatFC,
    formatNumber,
    todayFR,
    escapeHTML,
    goTo,
    switchTab,
    toggleTask,
    calcLoan,
    askAI,
    closeAI,
    saveApiKey,
    loadSettings,
    saveJournalEntry,
    saveSale,
    showToast,
    animateCards
  };
}