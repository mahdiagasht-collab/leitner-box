/**
 * @file ModalView.js
 * @description Add/edit card modal dialog with accessibility features.
 *
 * SRP: Modal open/close and form data collection only.
 * Accessibility: aria, keyboard close (Escape), focus management.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Views = window.LeitnerApp.Views || {};

window.LeitnerApp.Views.ModalView = class ModalView {

  constructor() {
    this._overlay    = document.getElementById('modal-overlay');
    this._title      = document.getElementById('modal-title');
    this._inputFront = document.getElementById('input-front');
    this._inputBack  = document.getElementById('input-back');
    this._inputNote  = document.getElementById('input-note');
    this._editId     = null;
    this._callbacks  = {};
    this._bindEvents();
  }

  // ── Public API ───────────────────────────────────────────

  /** @param {{ onSave: Function }} cbs */
  bindCallbacks(cbs) { this._callbacks = cbs; }

  openNew() {
    this._editId = null;
    this._title.textContent = 'افزودن کارت جدید';
    this._clearForm();
    this._open();
  }

  /** @param {Card} card */
  openEdit(card) {
    this._editId = card.id;
    this._title.textContent  = 'ویرایش کارت';
    this._inputFront.value   = card.front;
    this._inputBack.value    = card.back;
    this._inputNote.value    = card.note;
    this._open();
  }

  close() {
    this._overlay.classList.remove('modal-overlay--open');
    this._overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /** @returns {{ id, front, back, note }} */
  getData() {
    return {
      id:    this._editId,
      front: this._inputFront.value.trim(),
      back:  this._inputBack.value.trim(),
      note:  this._inputNote.value.trim(),
    };
  }

  /** @returns {boolean} */
  get isEditing() { return this._editId !== null; }

  // ── Private ──────────────────────────────────────────────

  /** @private */
  _open() {
    this._overlay.classList.add('modal-overlay--open');
    this._overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => this._inputFront.focus());
  }

  /** @private */
  _clearForm() {
    this._inputFront.value = '';
    this._inputBack.value  = '';
    this._inputNote.value  = '';
  }

  /** @private */
  _bindEvents() {
    // Backdrop click
    this._overlay.addEventListener('click', e => {
      if (e.target === this._overlay) this.close();
    });

    document.getElementById('modal-close')  ?.addEventListener('click', () => this.close());
    document.getElementById('modal-cancel') ?.addEventListener('click', () => this.close());
    document.getElementById('modal-save')   ?.addEventListener('click', () => this._callbacks.onSave?.(this.getData()));

    // Keyboard shortcuts
    this._overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });

    this._inputFront.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); this._inputBack.focus(); }
    });

    this._inputBack.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._callbacks.onSave?.(this.getData());
      }
    });
  }
};
