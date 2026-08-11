/**
 * Smart Home Monitoring & Control System — Cloud Functions Entry Point
 *
 * Exports all server-side Cloud Functions:
 *   1. safetyCutoffListener  — Firestore onDocumentUpdated trigger for safety-critical devices
 *   2. safetyCutoffExecutor  — Scheduled (1-min) executor that forces OFF on expired cutoffs
 *   3. scheduleExecutor      — Scheduled (1-min) executor for time-based device toggling
 */

const { safetyCutoffListener, safetyCutoffExecutor } = require("./safetyCutoff");
const { scheduleExecutor } = require("./scheduleExecutor");

module.exports = {
  safetyCutoffListener,
  safetyCutoffExecutor,
  scheduleExecutor,
};
