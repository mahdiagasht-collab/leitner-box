/**
 * @file ToastView.js
 * @description Non-blocking toast notification service.
 *
 * SRP: Only responsible for transient UI notifications.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Views = window.LeitnerApp.Views || {};

window.LeitnerApp.Views.ToastView = class ToastView {

  constructor() {
    this._container = document.getElementById('toast-container');
    this._duration  = 2800;
  }

  /**
   * @param {string} message
   * @param {'default'|'success'|'error'} [type]
   */
  show(message, type = 'default') {
    const el = document.createElement('div');
    el.className = `toast${type !== 'default' ? ` toast--${type}` : ''}`;
    el.setAttribute('role', 'status');
    el.textContent = message;
    this._container.appendChild(el);

    setTimeout(() => {
      el.style.opacity    = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, this._duration);
  }

  /** @param {string} message */
  success(message) { this.show(message, 'success'); }

  /** @param {string} message */
  error(message)   { this.show(message, 'error'); }
};
