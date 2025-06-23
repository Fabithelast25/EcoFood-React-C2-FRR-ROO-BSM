import { db } from "./firebase"; // Ajusta la ruta si es diferente
import { collection, getDocs, query, where, doc, updateDoc} from "firebase/firestore";

export async function obtenerPedidosPorEmail(emailCliente) {
  try {
    const pedidosRef = collection(db, "pedidos");
    const q = query(pedidosRef, where("emailCliente", "==", emailCliente));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return [];
  }
}

// Obtener todos los pedidos hechos a una empresa específica
export async function obtenerPedidosPorEmpresaId(empresaId) {
  try {
    const pedidosRef = collection(db, "pedidos");
    const q = query(pedidosRef, where("empresaId", "==", empresaId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return [];
  }
}

export async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  const ref = doc(db, "pedidos", pedidoId);
  await updateDoc(ref, {
    estado: nuevoEstado,
  });
}