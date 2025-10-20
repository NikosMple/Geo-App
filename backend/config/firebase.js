import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  let credential;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const json = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = admin.credential.cert(json);
      console.log("Firebase Admin: initialized from FIREBASE_SERVICE_ACCOUNT env");
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const decoded = Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
      ).toString("utf8");
      const json = JSON.parse(decoded);
      credential = admin.credential.cert(json);
      console.log("Firebase Admin: initialized from BASE64 service account env");
    } else if (
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      (process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT)
    ) {
      // Support split env vars in .env
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      // Handle escaped newlines and optional surrounding quotes
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, "\n");

      const serviceAccount = {
        type: "service_account",
        project_id: projectId,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url:
          process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
      };
      credential = admin.credential.cert(serviceAccount);
      console.log("Firebase Admin: initialized from split FIREBASE_* env vars");
    } else {
      credential = admin.credential.applicationDefault();
      console.log(
        "Firebase Admin: initialized from application default credentials"
      );
    }

    admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID || undefined,
    });
  } catch (err) {
    console.error("Failed to initialize Firebase Admin:", err?.message || err);
    throw err;
  }
}

initFirebaseAdmin();

export const db = admin.firestore();
export const auth = admin.auth();
