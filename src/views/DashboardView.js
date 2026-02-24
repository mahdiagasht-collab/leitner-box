/**
 * @file DashboardView.js
 * @description Renders the overview dashboard: stats, boxes, due-cards list.
 *
 * SRP: Only responsible for rendering. Never mutates data.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Views = window.LeitnerApp.Views || {};

window.LeitnerApp.Views.DashboardView = class DashboardView
  extends window.LeitnerApp.Views.BaseView {

  constructor() { super('view-dashboard'); }

  /** @param {Card[]} cards */
  render(cards) {
    const due = cards.filter(c => c.isDue());
    this._renderStats(cards, due);
    this._renderBoxes(cards, due);
    this._renderDueList(due.slice(0, 6));
  }

  // ── Private ──────────────────────────────────────────────

  /** @private */
  _renderStats(cards, due) {
    document.getElementById('stats-total').textContent    = cards.length;
    document.getElementById('stats-due').textContent      = due.length;
    document.getElementById('stats-mastered').textContent = cards.filter(c => c.box === 5).length;
    document.getElementById('stats-box1').textContent     = cards.filter(c => c.box === 1).length;
  }

  /** @private */
  _renderBoxes(cards, due) {
    const { boxColors, boxLabels, boxNumbers } = window.LeitnerApp.Models.LeitnerConfig;
    const container = document.getElementById('boxes-grid');

    container.innerHTML = boxNumbers.map(box => {
      const total   = cards.filter(c => c.box === box).length;
      const dueHere = due.filter(c => c.box === box).length;

      return /* html */`
        <div class="box-card ${dueHere ? 'box-card--has-due' : ''}"
             style="--box-color:${boxColors[box]}">
          <div class="box-card__number">${box}</div>
          <div class="box-card__interval">${boxLabels[box]}</div>
          <div class="box-card__count">${total} کارت</div>
          ${dueHere ? `<div class="box-card__due">↑ ${dueHere} آماده</div>` : ''}
        </div>`;
    }).join('');
  }

  /** @private */
  _renderDueList(due) {
    const container = document.getElementById('due-cards-list');

    if (!due.length) {
      container.innerHTML = /* html */`
        <div class="empty-state">
          <div class="empty-state__icon">🎉</div>
          <div class="empty-state__title">همه کارت‌ها مرور شدند!</div>
          <p class="empty-state__text">برای امروز کارتی ندارید. فردا دوباره برگردید.</p>
        </div>`;
      return;
    }

    const { boxColors } = window.LeitnerApp.Models.LeitnerConfig;
    container.innerHTML = /* html */`
      <div class="cards-list">
        ${due.map(c => /* html */`
          <div class="card-item">
            <div class="card-item__badge" style="background:${boxColors[c.box]}">${c.box}</div>
            <div class="card-item__content">
              <div class="card-item__front">${this._escape(c.front)}</div>
              <div class="card-item__back">${this._escape(c.back)}</div>
            </div>
            <span class="badge badge--due">آماده</span>
          </div>`).join('')}
      </div>`;
  }
};
