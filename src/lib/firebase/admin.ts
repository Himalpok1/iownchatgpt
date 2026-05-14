import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    firebasePrivateKey
);

const app = isFirebaseAdminConfigured
  ? getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: firebasePrivateKey,
      }),
    })
  : null;

export const firebaseAdminApp = app;
export const firebaseAdminAuth = app ? getAuth(app) : null;
