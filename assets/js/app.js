/* ============================================
   PNDA-Cultura — Logique principale
   ============================================ */

'use strict';

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
  }
}

/**
 * Active un onglet et affiche son contenu.
 * @param {HTMLElement} btn - Le bouton onglet cliqué
 * @param {string} tabId    - ID du panneau à afficher
 */
function switchTab(btn, tabId) {
  const screen = btn.closest('.screen');
  screen.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  screen.querySelectorAll('[data-tab]').forEach(t => {
    t.style.display = t.dataset.tab === tabId ? '' : 'none';
  });
}


/* ──────────────────────────────────────────
   2. TÂCHES — Cocher / décocher
────────────────────────────────────────── */

function toggleTask(row) {
  const box  = row.querySelector('.task-check');
  const text = row.querySelector('.task-text');
  const done = box.classList.toggle('done');
  box.textContent  = done ? '✓' : '';
  text.classList.toggle('done', done);
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
    total.textContent = (q && p)
      ? Math.round(q * p).toLocaleString('fr-FR') + ' FC'
      : '—';
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

  const elMens   = document.getElementById('loan-monthly');
  const elTotal  = document.getElementById('loan-total');
  const elInt    = document.getElementById('loan-interest');
  const elRatio  = document.getElementById('loan-ratio');

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

  const fmt = v => Math.round(v).toLocaleString('fr-FR') + ' FC';
  if (elMens)  elMens.textContent  = fmt(mens);
  if (elTotal) elTotal.textContent = fmt(total);
  if (elInt)   elInt.textContent   = fmt(inter);
  if (elRatio) {
    elRatio.textContent = ratio.toFixed(1) + '%';
    elRatio.style.color = ratio > 33 ? 'var(--red-700)' : 'var(--green-900)';
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
  // Ouvrir le panneau IA
  const panel = document.getElementById('ai-panel');
  const output = document.getElementById('ai-output');
  if (!panel || !output) {
    // Fallback : ouvre Claude.ai dans un nouvel onglet avec le prompt
    window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, '_blank');
    return;
  }

  panel.style.display = 'flex';
  output.innerHTML = '<div class="ai-loading">⏳ Analyse en cours...</div>';

  try {
    const API_KEY = localStorage.getItem('pnda_api_key') || '';
    if (!API_KEY) {
      output.innerHTML = `
        <div class="ai-msg">
          <p>🔑 Clé API non configurée.</p>
          <p style="margin-top:8px;font-size:12px;color:var(--text-secondary)">
            Allez dans Paramètres → Clé API pour configurer votre accès à l'IA.
          </p>
          <button class="form-btn" style="margin-top:12px" onclick="goTo('s-settings')">
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

  } catch (err) {
    console.error('AI Error:', err);
    output.innerHTML = `
      <div class="ai-msg ai-error">
        ❌ Impossible de joindre l'IA.<br>
        <span style="font-size:11px;color:var(--text-secondary)">Vérifiez votre connexion et votre clé API.</span>
      </div>`;
  }
}

/**
 * Formate la réponse IA : sauts de ligne → paragraphes, **gras**, listes.
 */
function formatAIResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function closeAI() {
  const panel = document.getElementById('ai-panel');
  if (panel) panel.style.display = 'none';
}


/* ──────────────────────────────────────────
   6. PARAMÈTRES — Clé API
────────────────────────────────────────── */

function saveApiKey() {
  const key = document.getElementById('api-key-input')?.value?.trim();
  if (key) {
    localStorage.setItem('pnda_api_key', key);
    showToast('Clé API enregistrée ✓');
  }
}

function loadSettings() {
  const input = document.getElementById('api-key-input');
  if (input) {
    const saved = localStorage.getItem('pnda_api_key') || '';
    input.value = saved ? '••••••••' + saved.slice(-4) : '';
  }
}


/* ──────────────────────────────────────────
   7. TOAST — Notification légère
────────────────────────────────────────── */

function showToast(msg, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
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
  // En production : sauvegarder dans Supabase
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
  sales.unshift({ id: Date.now(), product, qty, price, total, date: new Date().toLocaleDateString('fr-FR') });
  localStorage.setItem('sales', JSON.stringify(sales));
  showToast(`Vente enregistrée : ${Math.round(total).toLocaleString('fr-FR')} FC ✓`);
  goTo('s-finances');
}


/* ──────────────────────────────────────────
   10. INITIALISATION
────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initSaleForm();
  loadSettings();

  // Délégation : boutons task-row
  document.addEventListener('click', e => {
    const taskRow = e.target.closest('.task-row');
    if (taskRow) toggleTask(taskRow);
  });

  // PWA : Service Worker (si disponible)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Pas de SW en dev local — silencieux
    });
  }
});
