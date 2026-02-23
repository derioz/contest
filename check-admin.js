import fs from 'fs';
import admin from 'firebase-admin';

const envFile = fs.readFileSync('.env', 'utf-8');
const keyLine = envFile.split('\n').find(line => line.startsWith('FIREBASE_SERVICE_ACCOUNT_KEY='));
const jsonStr = keyLine.replace('FIREBASE_SERVICE_ACCOUNT_KEY=', '').trim();

const serviceAccount = JSON.parse(jsonStr);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkAdmins() {
  const snapshot = await db.collection('admins').get();
  console.log('Total admins found:', snapshot.size);
  snapshot.forEach(doc => {
    console.log('Admin ID:', doc.id, 'Data:', doc.data());
  });
  process.exit(0);
}

checkAdmins().catch(console.error);