/**
 * @file Card.js
 * @description Core entity representing a single flashcard.
 *
 * SRP: Holds card data + box-progression logic only.
 * OCP: Intervals are injected → open for extension without modification.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Models = window.LeitnerApp.Models || {};

window.LeitnerApp.Models.Card = class Card {

  /**
   * @param {Object} data
   * @param {string} [data.id]
   * @param {string} data.front
   * @param {string} data.back
   * @param {string} [data.note]
   * @param {number} [data.box]
   * @param {string} [data.nextReview]
   * @param {string} [data.createdAt]
   */
  constructor({ id, front, back, note = '', box = 1, nextReview = null, createdAt = null }) {
    this.id         = id         ?? crypto.randomUUID();
    this.front      = front;
    this.back       = back;
    this.note       = note;
    this.box        = box;
    this.nextReview = nextReview ?? new Date().toISOString();
    this.createdAt  = createdAt  ?? new Date().toISOString();
  }

  // ── Queries ─────────────────────────────────────────────

  /** @returns {boolean} */
  isDue() {
    return new Date(this.nextReview) <= new Date();
  }

  // ── Commands ────────────────────────────────────────────

  /** @param {Object.<number,number>} intervalDays */
  markCorrect(intervalDays) {
    this.box = Math.min(this.box + 1, 5);
    this._scheduleNext(intervalDays[this.box]);
  }

  /** @param {Object.<number,number>} intervalDays */
  markWrong(intervalDays) {
    this.box = 1;
    this._scheduleNext(intervalDays[1]);
  }

  // ── Serialization ────────────────────────────────────────

  /** @returns {Object} */
  toJSON() {
    return {
      id: this.id, front: this.front, back: this.back,
      note: this.note, box: this.box,
      nextReview: this.nextReview, createdAt: this.createdAt,
    };
  }

  /**
   * @param {Object} obj
   * @returns {Card}
   */
  static fromJSON(obj) {
    return new window.LeitnerApp.Models.Card(obj);
  }

  // ── Private ──────────────────────────────────────────────

  /** @private */
  _scheduleNext(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    this.nextReview = d.toISOString();
  }
};
