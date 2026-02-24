/**
 * @file CardsView.js
 * @description Renders the card library list with edit/delete actions.
 *
 * SRP: Only renders. Event callbacks are injected by the controller.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Views = window.LeitnerApp.Views || {};

window.LeitnerApp.Views.CardsView = class CardsView
  extends window.LeitnerApp.Views.BaseView {

  constructor() {
    super('view-cards');
    this._callbacks = {};
  }

  /** @param {{ onEdit: Function, onDelete: Function }} cbs */
  bindCallbacks(cbs) { this._callbacks = cbs; }

  /** @param {Card[]} cards */
  render(cards) {
    const list = document.getElementById('all-cards-list');

    if (!cards.length) {
      list.innerHTML = /* html */`
        <div class="empty-state">
          <div class="empty-state__icon">📭</div>
          <div class="empty-state__title">هنوز کارتی وجود ندارد</div>
          <p class="empty-state__text">با افزودن اولین کارت یادگیری را شروع کنید!</p>
        </div>`;
      return;
    }

    const { boxColors } = window.LeitnerApp.Models.LeitnerConfig;

    list.innerHTML = /* html */`
      <div class="cards-list">
        ${cards.map(c => /* html */`
          <div class="card-item" data-id="${c.id}">
            <div class="card-item__badge" style="background:${boxColors[c.box]}">${c.box}</div>
            <div class="card-item__content">
              <div class="card-item__front">${this._escape(c.front)}</div>
              <div class="card-item__back">${this._escape(c.back)}</div>
            </div>
            <div class="card-item__actions">
              <button class="btn btn--ghost btn--icon"
                      data-action="edit"   data-id="${c.id}"
                      aria-label="ویرایش" title="ویرایش">✏️</button>
              <button class="btn btn--danger btn--icon"
                      data-action="delete" data-id="${c.id}"
                      aria-label="حذف"    title="حذف">🗑️</button>
            </div>
          </div>`).join('')}
      </div>`;

    this._bindListEvents();
  }

  // ── Private ──────────────────────────────────────────────

  /** @private */
  _bindListEvents() {
    document.getElementById('all-cards-list').addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      e.stopPropagation();
      const { action, id } = btn.dataset;
      if (action === 'edit')   this._callbacks.onEdit?.(id);
      if (action === 'delete') this._callbacks.onDelete?.(id);
    });
  }
};
