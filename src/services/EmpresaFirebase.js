import { secondaryAuth, db } from "./firebase";
import { setDoc, doc, getDocs, getDoc, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export const getEmpresas = async () => {
  const snapshot = await getDocs(collection(db, "usuarios"));
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(user => user.tipo === "empresa");
};

export const addEmpresa = async (datos) => {
   try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      datos.password
    );
    await sendEmailVerification(cred.user);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      rut: datos.rut || "",
      comuna: datos.comuna || "",
      direccion: datos.direccion || "",
      tipo: "empresa",
      email: datos.email || "",
      telefono: datos.telefono || "",
      
    });
    await secondaryAuth.signOut();
    return cred;
  } catch (error) {
    console.error("Error registrando empresa:", error);
    throw error;
  }
};


export const updateEmpresa = async (id, empresaData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, empresaData);
};

export const deleteEmpresa = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};


export const obtenerEmpresaPorId = async (id) => {
  try {
    const ref = doc(db, "usuarios", id);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      return snapshot.data(); // contiene nombre, comuna, etc.
    } else {
      console.warn("Empresa no encontrada");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    return null;
  }
};