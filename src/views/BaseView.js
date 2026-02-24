/**
 * @file BaseView.js
 * @description Abstract base class for all views.
 *
 * LSP: All subclasses can substitute for BaseView.
 * ISP: Minimal interface — subclasses implement only what they need.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Views = window.LeitnerApp.Views || {};

window.LeitnerApp.Views.BaseView = class BaseView {

  /** @param {string} elementId */
  constructor(elementId) {
    this._root = document.getElementById(elementId);
    if (!this._root) throw new Error(`[BaseView] #${elementId} not found.`);
  }

  // ── Lifecycle ────────────────────────────────────────────

  show() { this._root.classList.add('view--active'); }
  hide() { this._root.classList.remove('view--active'); }

  /** @returns {boolean} */
  get isVisible() { return this._root.classList.contains('view--active'); }

  /** @abstract */
  render() { throw new Error(`[${this.constructor.name}] render() must be implemented.`); }

  // ── DOM Utilities ────────────────────────────────────────

  /** @protected */
  _setHTML(html) { this._root.innerHTML = html; }

  /** @protected @returns {Element|null} */
  _find(selector) { return this._root.querySelector(selector); }

  /** @protected @returns {NodeList} */
  _findAll(selector) { return this._root.querySelectorAll(selector); }

  /**
   * Delegated event listener on root.
   * @protected
   */
  _on(event, selector, handler) {
    this._root.addEventListener(event, (e) => {
      const target = e.target.closest(selector);
      if (target) handler(e, target);
    });
  }

  /**
   * Escape HTML to prevent XSS.
   * @protected
   * @param {string} str
   * @returns {string}
   */
  _escape(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, m => map[m]);
  }
};
