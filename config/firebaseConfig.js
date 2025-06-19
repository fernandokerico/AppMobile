// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Seus dados de configuração do Firebase (devem vir do .env via app.json)
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebaseApiKey,
  authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
  projectId: Constants.expoConfig.extra.firebaseProjectId,
  storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId,
  appId: Constants.expoConfig.extra.firebaseAppId,
  measurementId: Constants.expoConfig.extra.firebaseMeasurementId // Mantenha se quiser Analytics
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que vamos usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Corrigido: deve ser getStorage(app)

// Exporta os serviços para serem usados em outros arquivos
export { auth, db, storage };