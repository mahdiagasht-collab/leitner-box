/**
 * @file ReviewView.js
 * @description Renders the interactive flashcard review session.
 *
 * SRP: Only responsible for review UI states.
 * Callbacks injected by controller — this view never mutates data.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Views = window.LeitnerApp.Views || {};

window.LeitnerApp.Views.ReviewView = class ReviewView
  extends window.LeitnerApp.Views.BaseView {

  constructor() {
    super('view-review');
    this._callbacks = {};
  }

  /**
   * @param {{ onFlip, onCorrect, onWrong, onSkip, onDone }} cbs
   */
  bindCallbacks(cbs) { this._callbacks = cbs; }

  // ── Render States ─────────────────────────────────────────

  renderEmpty() {
    this._setHTML(/* html */`
      <div class="empty-state">
        <div class="empty-state__icon">✅</div>
        <div class="empty-state__title">همه کارت‌های امروز مرور شدند!</div>
        <p class="empty-state__text">کارت‌های بعدی بر اساس الگوریتم لایتنر برنامه‌ریزی شده‌اند.</p>
        <button class="btn btn--primary" id="btn-back-empty">← بازگشت به داشبورد</button>
      </div>`);
    document.getElementById('btn-back-empty')
      ?.addEventListener('click', () => this._callbacks.onDone?.());
  }

  /**
   * @param {Card}    card
   * @param {number}  currentNum
   * @param {number}  total
   * @param {boolean} isFlipped
   */
  renderCard(card, currentNum, total, isFlipped) {
    const { boxColors, boxNumbers } = window.LeitnerApp.Models.LeitnerConfig;
    const pct  = Math.round(((currentNum - 1) / total) * 100);
    const dots = boxNumbers.map(b => {
      const active = b === card.box;
      return /* html */`
        <div class="box-dot ${active ? 'box-dot--active' : ''}"
             style="${active ? `background:${boxColors[b]};border-color:${boxColors[b]}` : ''}">
        </div>`;
    }).join('');

    this._setHTML(/* html */`
      <div class="review-header">
        <span style="font-size:var(--font-size-sm);color:var(--color-text-muted);white-space:nowrap">
          کارت ${currentNum} از ${total}
        </span>
        <div class="review-progress">
          <div class="progress-bar">
            <div class="progress-bar__fill" style="width:${pct}%"></div>
          </div>
          <div class="progress-bar__text">${total - currentNum} کارت باقیمانده</div>
        </div>
        <button class="btn btn--ghost btn--sm" id="btn-skip">رد کردن ›</button>
      </div>

      <div class="box-dots">${dots}</div>

      <div class="flashcard-area">
        <div class="flashcard-wrap" id="flashcard-wrap"
             role="button" aria-label="کارت را برگردان" tabindex="0">
          <div class="flashcard ${isFlipped ? 'flashcard--flipped' : ''}" id="flashcard">
            <div class="flashcard__face flashcard__face--front">
              <span class="flashcard__label">سوال</span>
              <p  class="flashcard__text">${this._escape(card.front)}</p>
              <span class="flashcard__hint">👆 برای دیدن جواب کلیک کنید</span>
            </div>
            <div class="flashcard__face flashcard__face--back">
              <span class="flashcard__label">جواب</span>
              <p  class="flashcard__text">${this._escape(card.back)}</p>
              ${card.note ? `<p class="flashcard__note">${this._escape(card.note)}</p>` : ''}
            </div>
          </div>
        </div>
      </div>

      <div class="review-actions">
        <button class="btn btn--danger"  id="btn-wrong"   ${!isFlipped ? 'disabled' : ''}>
          ✗ اشتباه — برگشت به جعبه ۱
        </button>
        <button class="btn btn--success" id="btn-correct" ${!isFlipped ? 'disabled' : ''}>
          ✓ صحیح — جعبه بعدی
        </button>
      </div>`);

    this._bindCardEvents();
  }

  renderResult(correct, wrong) {
    const total = correct + wrong;
    const pct   = total ? Math.round((correct / total) * 100) : 0;
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪';

    this._setHTML(/* html */`
      <div class="result-screen">
        <span class="result-screen__emoji">${emoji}</span>
        <h2 class="result-screen__title">جلسه مرور به پایان رسید!</h2>
        <p class="result-screen__subtitle">نتایج مرور امروز شما</p>
        <div class="result-stats">
          <div class="result-stat">
            <div class="result-stat__value" style="color:var(--color-success)">${correct}</div>
            <div class="result-stat__label">صحیح ✓</div>
          </div>
          <div class="result-stat">
            <div class="result-stat__value" style="color:var(--color-danger)">${wrong}</div>
            <div class="result-stat__label">اشتباه ✗</div>
          </div>
          <div class="result-stat">
            <div class="result-stat__value" style="color:var(--color-accent)">${pct}٪</div>
            <div class="result-stat__label">درصد موفقیت</div>
          </div>
        </div>
        <button class="btn btn--primary" id="btn-review-done">← بازگشت به داشبورد</button>
      </div>`);

    document.getElementById('btn-review-done')
      ?.addEventListener('click', () => this._callbacks.onDone?.());
  }

  // ── Private ──────────────────────────────────────────────

  /** @private */
  _bindCardEvents() {
    const wrap = document.getElementById('flashcard-wrap');
    if (wrap) {
      wrap.addEventListener('click', () => this._handleFlip());
      wrap.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._handleFlip(); }
      });
    }
    document.getElementById('btn-correct')?.addEventListener('click', () => this._callbacks.onCorrect?.());
    document.getElementById('btn-wrong')  ?.addEventListener('click', () => this._callbacks.onWrong?.());
    document.getElementById('btn-skip')   ?.addEventListener('click', () => this._callbacks.onSkip?.());
  }

  /** @private */
  _handleFlip() {
    const card = document.getElementById('flashcard');
    if (!card || card.classList.contains('flashcard--flipped')) return;
    card.classList.add('flashcard--flipped');
    document.getElementById('btn-correct').disabled = false;
    document.getElementById('btn-wrong').disabled   = false;
    this._callbacks.onFlip?.();
  }
};
