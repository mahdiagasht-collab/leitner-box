/**
 * @file ReviewController.js
 * @description Manages state of a single review session.
 *
 * SRP: Session flow only — queue, scoring, progress.
 * Stateful; a new instance is created per session.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Controllers = window.LeitnerApp.Controllers || {};

window.LeitnerApp.Controllers.ReviewController = class ReviewController {

  /** @param {Card[]} dueCards */
  constructor(dueCards) {
    this._queue     = [...dueCards];
    this._index     = 0;
    this._correct   = 0;
    this._wrong     = 0;
    this._isFlipped = false;
  }

  // ── Queries ──────────────────────────────────────────────

  get currentCard()   { return this._queue[this._index] ?? null; }
  get currentNumber() { return this._index + 1; }
  get totalCards()    { return this._queue.length; }
  get isDone()        { return this._index >= this._queue.length; }
  get isFlipped()     { return this._isFlipped; }

  get stats() {
    const total = this._correct + this._wrong;
    return {
      correct:    this._correct,
      wrong:      this._wrong,
      total,
      percentage: total ? Math.round((this._correct / total) * 100) : 0,
    };
  }

  // ── Commands ─────────────────────────────────────────────

  flip() { this._isFlipped = true; }

  answerCorrect() {
    this.currentCard.markCorrect(window.LeitnerApp.Models.LeitnerConfig.intervals);
    this._correct++;
    this._advance();
  }

  answerWrong() {
    this.currentCard.markWrong(window.LeitnerApp.Models.LeitnerConfig.intervals);
    this._wrong++;
    this._advance();
  }

  skip() { this._advance(); }

  /** @returns {Card[]} */
  getModifiedCards() { return [...this._queue]; }

  // ── Private ──────────────────────────────────────────────

  /** @private */
  _advance() { this._index++; this._isFlipped = false; }
};
