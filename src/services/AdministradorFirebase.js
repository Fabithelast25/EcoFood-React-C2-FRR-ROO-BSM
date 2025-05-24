// src/services/AdministradorFirebase.js
import { secondaryAuth, db } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc, getDocs, collection, updateDoc, deleteDoc } from "firebase/firestore";

export const registrarAdministradorConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      datos.password
    );
    await sendEmailVerification(cred.user);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      comuna: datos.comuna || "",
      direccion: datos.direccion || "",
      tipo: "Admin",
      email: datos.email || "",
      principal: false
    });
    await secondaryAuth.signOut();
    return cred;
  } catch (error) {
    console.error("Error registrando administrador:", error);
    throw error;
  }
};

export const getAdministradores = async () => {
  const snapshot = await getDocs(collection(db, "usuarios"));
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(user => user.tipo === "Admin");
};

export const updateAdministrador = async (id, nuevosDatos) => {
  await updateDoc(doc(db, "usuarios", id), nuevosDatos);
};

export const deleteAdministrador = async (id) => {
  await deleteDoc(doc(db, "usuarios", id));
};
