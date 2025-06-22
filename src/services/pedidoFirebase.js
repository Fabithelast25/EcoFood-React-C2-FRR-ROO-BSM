import { db } from "./firebase"; // Ajusta la ruta si es diferente
import { collection, getDocs, query, where } from "firebase/firestore";

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
