import admin from "firebase-admin";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_CLIENT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_X509_CERT_URL,
} = process.env;

// —— Debugging help — log length and boundaries (remove these once it works)
console.log("KEY length:", FIREBASE_PRIVATE_KEY?.length);
console.log(
  "KEY startsWith BEGIN:",
  FIREBASE_PRIVATE_KEY?.startsWith("-----BEGIN")
);
console.log(
  "KEY endsWith END:",
  FIREBASE_PRIVATE_KEY?.endsWith("-----END PRIVATE KEY-----\\n")
);

if (!FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "🔥 FIREBASE_PRIVATE_KEY is undefined! Check your .env load path."
  );
}

const serviceAccount = {
  type: "service_account",
  project_id: FIREBASE_PROJECT_ID,
  private_key_id: FIREBASE_PRIVATE_KEY_ID,
  private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: FIREBASE_CLIENT_EMAIL,
  client_id: FIREBASE_CLIENT_ID,
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  token_uri: "https://oauth2.googleapis.com/token",
  client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
