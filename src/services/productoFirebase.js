import { db } from "./firebase";
import {
  collection,
  setDoc,
  getDocs,
  getDoc,
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
import Swal from "sweetalert2";

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
  busqueda = "",
  orden = "nombre-asc",
  pageSize = 10,
  estadoFiltro = "todos"
) => {
  let [campo, dir] = orden.split("-");
  if (!["nombre", "precio"].includes(campo)) campo = "nombre";
  if (!["asc", "desc"].includes(dir)) dir = "asc";

  let ref = collection(db, "productos");
  let filtros = [where("empresaId", "==", empresaId)];

  // Filtro de estado
  const hoy = new Date().toISOString().slice(0, 10);
  if (estadoFiltro === "disponibles") {
    filtros.push(where("vencimiento", ">", hoy));
  } else if (estadoFiltro === "por-vencer") {
    const en7 = new Date();
    en7.setDate(new Date().getDate() + 7);
    const en7str = en7.toISOString().slice(0, 10);
    filtros.push(where("vencimiento", ">", hoy));
    filtros.push(where("vencimiento", "<=", en7str));
  } else if (estadoFiltro === "vencidos") {
    filtros.push(where("vencimiento", "<=", hoy));
  }

  // Filtro de búsqueda por nombre
  if (busqueda) {
    filtros.push(where("nombre", ">=", busqueda));
    filtros.push(where("nombre", "<=", busqueda + "\uf8ff"));
  }

  let q = query(
    ref,
    ...filtros,
    orderBy(campo, dir),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(pageSize)
  );

  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { productos, lastVisible };
};

// Verifica si hay al menos un producto vencido
export const hayProductosVencidos = async (empresaId) => {
  const hoy = new Date().toISOString().slice(0, 10);
  const ref = collection(db, "productos");

  const q = query(
    ref,
    where("empresaId", "==", empresaId),
    where("vencimiento", "<=", hoy),
    limit(1)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export async function obtenerProductoPorId(id) {
  const ref = doc(db, "productos", id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    return null;
  }
}

export async function reducirStockProducto(productoId, cantidadARestar) {
  const ref = doc(db, "productos", productoId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await Swal.fire({
      icon: "error",
      title: "Producto no encontrado",
      text: "El producto no se ha encontrado para reducir su stock"
    }
    )
    throw new Error("Producto no encontrado");
  }

  const producto = snapshot.data();
  const nuevaCantidad = producto.cantidad - cantidadARestar;

  if (nuevaCantidad < 0) {
      await Swal.fire({
      icon: "error",
      title: "Stock insuficiente",
      text: "No hay suficiente stock para entregar este pedido.",
    });
    return; // ← IMPORTANTE: corta la función aquí
  }

  await updateDoc(ref, {
    cantidad: nuevaCantidad,
  });
}
