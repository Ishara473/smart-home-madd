const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

const app = initializeApp();
const db = getFirestore(app);
const messaging = getMessaging();

module.exports = { app, db, messaging, FieldValue };
