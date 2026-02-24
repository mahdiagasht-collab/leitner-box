/**
 * @file app.js
 * @description Application entry point — Composition Root.
 *
 * This is the ONLY place where concrete classes are instantiated
 * and wired together. Swapping any layer only requires changes here.
 *
 * DIP in practice: AppController receives all dependencies via
 * constructor injection — it never creates them itself.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const { Card, LeitnerConfig, CardRepository } = window.LeitnerApp.Models;
  const { DashboardView, ReviewView, CardsView, ModalView, ToastView } = window.LeitnerApp.Views;
  const { CardController, AppController } = window.LeitnerApp.Controllers;

  // ── Models ────────────────────────────────────────────────
  const repository     = new CardRepository('leitner_v1');
  const cardController = new CardController(repository);

  // ── Views ─────────────────────────────────────────────────
  const dashboardView  = new DashboardView();
  const reviewView     = new ReviewView();
  const cardsView      = new CardsView();
  const modalView      = new ModalView();
  const toastView      = new ToastView();

  // ── Launch ────────────────────────────────────────────────
  const app = new AppController({
    cardController,
    dashboardView,
    reviewView,
    cardsView,
    modalView,
    toastView,
  });

  app.init();
});
