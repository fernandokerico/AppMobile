// services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export const registerUser = async (email, password, name, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      phone: phone,
      profilePicture: null,
      createdAt: new Date(),
    });

    return { success: true, user };
  } catch (error) {
    let errorMessage = 'Erro ao registrar usuário. Tente novamente.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este e-mail já está em uso.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'E-mail inválido.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
    }
    console.error("Erro no registro:", error.message);
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { success: true, user };
  } catch (error) {
    let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'E-mail ou senha inválidos.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'Usuário desativado.';
    }
    console.error("Erro no login:", error.message);
    return { success: false, error: errorMessage };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'E-mail de redefinição enviado com sucesso!' };
  } catch (error) {
    let errorMessage = 'Erro ao enviar e-mail de redefinição de senha.';
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'E-mail inválido.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'Nenhum usuário encontrado com este e-mail.';
    }
    console.error("Erro ao resetar senha:", error.message);
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Erro ao fazer logout:", error.message);
    return { success: false, error: 'Erro ao fazer logout. Tente novamente.' };
  }
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserData = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.warn("Nenhum documento de usuário encontrado para UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error.message);
    return null;
  }
};