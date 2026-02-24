/**
 * @file LeitnerConfig.js
 * @description Value object — Leitner system configuration constants.
 *
 * SRP: Only provides configuration.
 * OCP: Extend by subclassing; existing consumers stay unchanged.
 */

'use strict';

window.LeitnerApp = window.LeitnerApp || {};
window.LeitnerApp.Models = window.LeitnerApp.Models || {};

window.LeitnerApp.Models.LeitnerConfig = class LeitnerConfig {

  /** @returns {Object.<number,number>} box → days */
  static get intervals() {
    return { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };
  }

  /** @returns {Object.<number,string>} */
  static get boxLabels() {
    return { 1: 'روزانه', 2: 'دو روز', 3: 'چهار روز', 4: 'هفتگی', 5: 'دو هفته' };
  }

  /** @returns {Object.<number,string>} */
  static get boxColors() {
    return { 1: '#f87171', 2: '#fb923c', 3: '#fbbf24', 4: '#34d399', 5: '#60a5fa' };
  }

  /** @returns {number[]} */
  static get boxNumbers() {
    return [1, 2, 3, 4, 5];
  }

  /** @returns {number} */
  static get totalBoxes() {
    return 5;
  }
};
