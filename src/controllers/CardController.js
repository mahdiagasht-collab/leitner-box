/**
 * @file CardController.js
 * @description CRUD operations for cards.
 *
 * SRP: Card lifecycle management only.
 * DIP: Depends on CardRepository abstraction.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Controllers = window.LeitnerApp.Controllers || {};

window.LeitnerApp.Controllers.CardController = class CardController {

  /** @param {CardRepository} repository */
  constructor(repository) {
    this._repo = repository;
  }

  // ── Queries ──────────────────────────────────────────────

  /** @returns {Card[]} */
  getAll() { return this._repo.getAll(); }

  /** @returns {Card[]} */
  getDue() { return this.getAll().filter(c => c.isDue()); }

  /** @param {string} id @returns {Card|undefined} */
  getById(id) { return this.getAll().find(c => c.id === id); }

  // ── Commands ─────────────────────────────────────────────

  /**
   * @param {string} front
   * @param {string} back
   * @param {string} [note]
   * @returns {Card}
   */
  create(front, back, note = '') {
    const Card = window.LeitnerApp.Models.Card;
    const card = new Card({ front, back, note });
    this._repo.add(card);
    return card;
  }

  /**
   * @param {string} id
   * @param {string} front
   * @param {string} back
   * @param {string} [note]
   * @returns {boolean}
   */
  update(id, front, back, note = '') {
    const card = this.getById(id);
    if (!card) return false;
    card.front = front;
    card.back  = back;
    card.note  = note;
    return this._repo.update(card);
  }

  /** @param {string} id @returns {boolean} */
  delete(id) { return this._repo.delete(id); }

  /** @param {Card[]} cards @returns {boolean} */
  saveAll(cards) { return this._repo.save(cards); }
};
