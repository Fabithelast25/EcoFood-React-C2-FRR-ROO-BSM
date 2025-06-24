import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Ajusta la ruta según tu proyecto
import { obtenerPedidosPorEmail } from "../../services/pedidoFirebase";
import { useNavigate } from "react-router-dom";
import { cancelarPedido } from "../../services/pedidoFirebase";

export default function PedidosCliente() {
  const { userData } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData?.email) return;

    const fetchPedidos = async () => {
      const datos = await obtenerPedidosPorEmail(userData.email);
      setPedidos(datos);
    };

    fetchPedidos();
  }, [userData]);

  const handleCancelar = async (pedidoId) => {
  try {
    await cancelarPedido(pedidoId);
    // Actualizar estado local para reflejar el cambio
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, estado: "cancelado" } : pedido
      )
    );
  } catch (error) {
    console.error("Error al cancelar el pedido:", error);
  }
};

  if (!userData) return <p>Cargando usuario...</p>;

  return (
    <div className="container mt-4">
      <h3>Mis Pedidos</h3>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.productoNombre}</td>
                <td>{pedido.empresaNombre}</td>
                <td>{pedido.estado}</td>
                <td>
                  {pedido.estado === "pendiente" ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelar(pedido.id)}
                    >
                      Cancelar
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


