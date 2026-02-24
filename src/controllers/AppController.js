/**
 * @file AppController.js
 * @description Root orchestrator — the Composition Root.
 *
 * SRP: Wires sub-controllers + views, handles navigation.
 * DIP: All dependencies injected via constructor.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Controllers = window.LeitnerApp.Controllers || {};

window.LeitnerApp.Controllers.AppController = class AppController {

  /**
   * @param {Object} deps
   * @param {CardController}   deps.cardController
   * @param {DashboardView}    deps.dashboardView
   * @param {ReviewView}       deps.reviewView
   * @param {CardsView}        deps.cardsView
   * @param {ModalView}        deps.modalView
   * @param {ToastView}        deps.toastView
   */
  constructor({ cardController, dashboardView, reviewView, cardsView, modalView, toastView }) {
    this._cards   = cardController;
    this._dash    = dashboardView;
    this._rev     = reviewView;
    this._cardsV  = cardsView;
    this._modal   = modalView;
    this._toast   = toastView;
    this._session = null;
    this._activeTab = 'dashboard';
  }

  // ── Bootstrap ─────────────────────────────────────────────

  init() {
    this._bindNavigation();
    this._bindHeaderActions();
    this._bindModalCallbacks();
    this._bindReviewCallbacks();
    this._bindCardsCallbacks();
    this._bindFilterSelect();
    this._renderDashboard();
  }

  // ── Navigation ────────────────────────────────────────────

  /** @private */
  _bindNavigation() {
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => this._navigateTo(btn.dataset.tab));
    });
    document.getElementById('btn-start-review')
      ?.addEventListener('click', () => this._navigateTo('review'));
  }

  /**
   * @private
   * @param {'dashboard'|'review'|'cards'} tab
   */
  _navigateTo(tab) {
    document.querySelectorAll('[data-tab]').forEach(btn =>
      btn.classList.toggle('tabs__item--active', btn.dataset.tab === tab)
    );
    document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
    document.getElementById(`view-${tab}`)?.classList.add('view--active');
    this._activeTab = tab;

    const actions = {
      dashboard: () => this._renderDashboard(),
      review:    () => this._startReview(),
      cards:     () => this._renderCards(),
    };
    actions[tab]?.();
  }

  // ── Dashboard ─────────────────────────────────────────────

  /** @private */
  _renderDashboard() {
    this._dash.render(this._cards.getAll());
  }

  // ── Review ────────────────────────────────────────────────

  /** @private */
  _bindReviewCallbacks() {
    this._rev.bindCallbacks({
      onFlip:    () => {},
      onCorrect: () => this._handleAnswer('correct'),
      onWrong:   () => this._handleAnswer('wrong'),
      onSkip:    () => { this._session?.skip(); this._renderCurrentCard(); },
      onDone:    () => this._navigateTo('dashboard'),
    });
  }

  /** @private */
  _startReview() {
    const due = this._cards.getDue();
    if (!due.length) { this._rev.renderEmpty(); return; }
    const ReviewController = window.LeitnerApp.Controllers.ReviewController;
    this._session = new ReviewController(due);
    this._renderCurrentCard();
  }

  /** @private */
  _renderCurrentCard() {
    if (!this._session || this._session.isDone) {
      this._endSession(); return;
    }
    const { currentCard, currentNumber, totalCards, isFlipped } = this._session;
    this._rev.renderCard(currentCard, currentNumber, totalCards, isFlipped);
  }

  /**
   * @private
   * @param {'correct'|'wrong'} type
   */
  _handleAnswer(type) {
    if (!this._session) return;
    type === 'correct' ? this._session.answerCorrect() : this._session.answerWrong();
    this._renderCurrentCard();
  }

  /** @private */
  _endSession() {
    if (!this._session) return;

    // Persist changes from session
    const allCards    = this._cards.getAll();
    const modified    = this._session.getModifiedCards();
    const modifiedMap = new Map(modified.map(c => [c.id, c]));
    const merged      = allCards.map(c => modifiedMap.get(c.id) ?? c);
    this._cards.saveAll(merged);

    const { correct, wrong } = this._session.stats;
    this._rev.renderResult(correct, wrong);
    this._session = null;
  }

  // ── Cards View ────────────────────────────────────────────

  /** @private */
  _bindCardsCallbacks() {
    this._cardsV.bindCallbacks({
      onEdit:   id => this._editCard(id),
      onDelete: id => this._deleteCard(id),
    });
  }

  /** @private */
  _renderCards() {
    const filterVal = document.getElementById('filter-box')?.value ?? '';
    const all       = this._cards.getAll();
    const filtered  = filterVal ? all.filter(c => c.box === Number(filterVal)) : all;
    this._cardsV.render(filtered);
  }

  /** @private */
  _bindFilterSelect() {
    document.getElementById('filter-box')
      ?.addEventListener('change', () => this._renderCards());
  }

  // ── Card CRUD ─────────────────────────────────────────────

  /** @private */
  _bindHeaderActions() {
    const open = () => this._modal.openNew();
    document.getElementById('btn-new-card')  ?.addEventListener('click', open);
    document.getElementById('btn-new-card-2')?.addEventListener('click', open);
  }

  /** @private @param {string} id */
  _editCard(id) {
    const card = this._cards.getById(id);
    if (card) this._modal.openEdit(card);
  }

  /** @private @param {string} id */
  _deleteCard(id) {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این کارت را حذف کنید؟')) return;
    this._cards.delete(id);
    this._toast.success('کارت با موفقیت حذف شد 🗑️');
    this._refresh();
  }

  // ── Modal ─────────────────────────────────────────────────

  /** @private */
  _bindModalCallbacks() {
    this._modal.bindCallbacks({
      onSave: data => this._handleModalSave(data),
    });
  }

  /**
   * @private
   * @param {{ id, front, back, note }} data
   */
  _handleModalSave(data) {
    const { id, front, back, note } = data;

    if (!front || !back) {
      this._toast.error('لطفاً سوال و جواب را وارد کنید');
      return;
    }

    if (this._modal.isEditing && id) {
      this._cards.update(id, front, back, note);
      this._toast.success('کارت با موفقیت ویرایش شد ✓');
    } else {
      this._cards.create(front, back, note);
      this._toast.success('کارت جدید اضافه شد ✓');
    }

    this._modal.close();
    this._refresh();
  }

  // ── Helpers ───────────────────────────────────────────────

  /** @private */
  _refresh() {
    this._renderDashboard();
    if (this._activeTab === 'cards') this._renderCards();
  }
};
