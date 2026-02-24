/**
 * @file CardRepository.js
 * @description Data Access Object — persists and retrieves cards via localStorage.
 *
 * SRP: Only responsible for card storage and retrieval.
 * DIP: Storage mechanism can be swapped by overriding _read() / _write().
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Models = window.LeitnerApp.Models || {};

window.LeitnerApp.Models.CardRepository = class CardRepository {

  /** @param {string} [storageKey] */
  constructor(storageKey = 'leitner_v1') {
    this._key = storageKey;
  }

  // ── Public API ───────────────────────────────────────────

  /** @returns {Card[]} */
  getAll() {
    const Card = window.LeitnerApp.Models.Card;
    try {
      const raw = this._read();
      if (!raw) return this._seed();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(Card.fromJSON) : [];
    } catch (err) {
      console.error('[CardRepository] Load error:', err);
      return [];
    }
  }

  /** @param {Card[]} cards */
  save(cards) {
    try {
      this._write(JSON.stringify(cards.map(c => c.toJSON())));
      return true;
    } catch (err) {
      console.error('[CardRepository] Save error:', err);
      return false;
    }
  }

  /** @param {Card} card */
  add(card) {
    const cards = this.getAll();
    cards.push(card);
    return this.save(cards);
  }

  /** @param {Card} updatedCard */
  update(updatedCard) {
    const cards = this.getAll().map(c => c.id === updatedCard.id ? updatedCard : c);
    return this.save(cards);
  }

  /** @param {string} id */
  delete(id) {
    return this.save(this.getAll().filter(c => c.id !== id));
  }

  // ── Private ──────────────────────────────────────────────

  /** @private */
  _read()        { return localStorage.getItem(this._key); }

  /** @private */
  _write(data)   { localStorage.setItem(this._key, data); }

  /** @private — Seed demo cards on first launch */
  _seed() {
    const Card = window.LeitnerApp.Models.Card;
    const demos = [
      { front: 'پایتخت فرانسه چیست؟',         back: 'پاریس',                         note: 'Paris — بزرگ‌ترین شهر فرانسه' },
      { front: 'فرمول شیمیایی آب چیست؟',       back: 'H₂O',                           note: 'دو اتم هیدروژن، یک اتم اکسیژن' },
      { front: '۷ × ۸ چند است؟',               back: '۵۶' },
      { front: 'نویسنده شاهنامه کیست؟',         back: 'حکیم ابوالقاسم فردوسی',        note: 'سروده‌شده قرن چهارم هجری' },
      { front: 'سرعت نور چقدر است؟',           back: '۲۹۹٬۷۹۲٬۴۵۸ متر در ثانیه',   note: '≈ ۳۰۰٬۰۰۰ کیلومتر در ثانیه' },
      { front: 'عنصر Fe در جدول تناوبی چیست؟', back: 'آهن (Iron)',                    note: 'از واژه لاتین Ferrum' },
    ];
    const cards = demos.map(d => new Card(d));
    this.save(cards);
    return cards;
  }
};
