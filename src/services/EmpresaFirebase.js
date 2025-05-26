import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getEmpresas = async () => {
  const q = query(
    collection(db, "empresas"),
    where("tipo", "==", "empresa")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addEmpresa = async ({ nombre, rut, direccion, comuna, email, telefono }) => {
  return await addDoc(collection(db, "empresas"), {
    nombre,
    rut,
    direccion,
    comuna,
    email,
    telefono,
    tipo: "empresa",
  });
};

export const updateEmpresa = async (id, empresaData) => {
  const ref = doc(db, "empresas", id);
  return await updateDoc(ref, empresaData);
};

export const deleteEmpresa = async (id) => {
  const ref = doc(db, "empresas", id);
  return await deleteDoc(ref);
};
