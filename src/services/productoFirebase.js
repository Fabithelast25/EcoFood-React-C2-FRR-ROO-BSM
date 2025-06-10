import { db } from "./firebase";
import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteDoc,
  doc,
  orderBy,
  limit,
  startAt,
  endAt,
  startAfter,
  getCountFromServer, // SDK v9+ → consulta agregada COUNT
} from "firebase/firestore";

// Agregar producto con ID generado automáticamente
export const addProducto = async (producto) => {
  const ref = doc(collection(db, "productos")); // genera ID
  const productoConId = { ...producto, id: ref.id };
  await setDoc(ref, productoConId);
};

// Eliminar producto por ID
export const deleteProducto = async (id) => {
  await deleteDoc(doc(db, "productos", id));
};

// Actualizar producto por ID
export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};

// Obtener total de productos, con filtro opcional por nombre
export async function obtenerTotalProductos(empresaId, busqueda = "") {
  const productosRef = collection(db, "productos");
  let q = query(productosRef, where("empresaId", "==", empresaId));

  if (busqueda.trim() !== "") {
    const term = busqueda.toLowerCase();
    q = query(
      q,
      orderBy("nombre"), // requiere índice compuesto en Firestore
      startAt(term),
      endAt(term + "\uf8ff")
    );
  }

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export const PAGE_SIZE = 5;

// Obtener productos paginados, con búsqueda opcional por nombre
export const getProductosByEmpresaPagina = async (
  empresaId,
  cursor = null,
  nombre = ""
) => {
  const ref = collection(db, "productos");

  let q = query(
    ref,
    where("empresaId", "==", empresaId),
    orderBy("nombre"),
    startAt(nombre),
    endAt(nombre + "\uf8ff"),
    limit(PAGE_SIZE)
  );

  if (cursor) {
    q = query(
      ref,
      where("empresaId", "==", empresaId),
      orderBy("nombre"),
      startAt(nombre),
      endAt(nombre + "\uf8ff"),
      startAfter(cursor),
      limit(PAGE_SIZE)
    );
  }

  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { productos, lastVisible };
};


