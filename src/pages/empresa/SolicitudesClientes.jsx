import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Ajusta la ruta según tu proyecto
import { obtenerPedidosPorEmpresaId, actualizarEstadoPedido } from "../../services/pedidoFirebase";
import { obtenerProductoPorId, reducirStockProducto } from "../../services/productoFirebase";
import { Popover } from 'bootstrap';
import Swal from "sweetalert2";

export default function PedidosCliente() {
  const { userData } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const filtrarPedidos = () => {
    return pedidos.filter((pedido) =>
      pedido.productoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.estado.toLowerCase().includes(busqueda.toLowerCase())
    );
  };


    useEffect(() => {
    const fetchPedidos = async () => {
        if (!userData?.uid) return;

        const pedidos = await obtenerPedidosPorEmpresaId(userData.uid);

        const pedidosConNombre = await Promise.all(
        pedidos.map(async (pedido) => {
            const producto = await obtenerProductoPorId(pedido.productoId);
            return {
            ...pedido,
            productoNombre: producto?.nombre || "Producto no encontrado",
            productoCantidad: producto?.cantidad ?? "N/A", // ← cantidad actual del producto
            };
        })
        );
        setPedidos(pedidosConNombre);
    };

    fetchPedidos();
    }, [userData]);

    useEffect(() => {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

        popoverTriggerList.forEach((el) => {
            new Popover(el); // ← ya no usa window.bootstrap
        });
    }, [pedidos]);// esto asegura que se ejecute cada vez que se actualicen los pedidos

    const manejarEntrega = async (pedido) => {
    try {
        // Obtener el producto actual para verificar stock
        const producto = await obtenerProductoPorId(pedido.productoId);

        // Validar stock suficiente
        if (!producto || producto.cantidad < pedido.cantidadSolicitada) {
        await Swal.fire({
            icon: "error",
            title: "Stock insuficiente",
            text: "No hay suficiente stock para entregar este pedido.",
        });
        return; // 🔴 Detiene aquí el flujo, como lo hacía un throw
        }

        // Reducir stock
        await reducirStockProducto(pedido.productoId, pedido.cantidadSolicitada);

        // Actualizar estado
        await actualizarEstadoPedido(pedido.id, "entregado");

        await Swal.fire({
        title: "Pedido entregado correctamente",
        icon: "success",
        });

        // Recargar los pedidos actualizados
        const pedidos = await obtenerPedidosPorEmpresaId(userData.uid);

        const pedidosConNombre = await Promise.all(
        pedidos.map(async (pedido) => {
            const producto = await obtenerProductoPorId(pedido.productoId);
            return {
            ...pedido,
            productoNombre: producto?.nombre || "Producto no encontrado",
            productoCantidad: producto?.cantidad ?? "N/A",
            };
        })
        );

        setPedidos(pedidosConNombre);

    } catch (error) {
        await Swal.fire({
        title: "Error",
        text: "Ocurrió un problema al entregar el pedido.",
        icon: "error",
        });
    }
    };

    const manejarRechazo = async (pedido) => {
    try {
        await actualizarEstadoPedido(pedido.id, "rechazado");

        Swal.fire({
            icon: "success",
            title: "Pedido rechazado"
        })

        // Actualizar la vista
        const pedidosActualizados = pedidos.map((p) =>
        p.id === pedido.id ? { ...p, estado: "rechazado" } : p
        );
        setPedidos(pedidosActualizados);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error al rechazar el pedido: \n" + error.message
        })
    }
    };
    const confirmarEntrega = (pedido) => {
    Swal.fire({
        title: '¿Confirmas entregar este pedido?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, entregar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
        manejarEntrega(pedido);
        }
    });
    };

    const confirmarRechazo = (pedido) => {
    Swal.fire({
        title: '¿Confirmas rechazar este pedido?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
        manejarRechazo(pedido);
        }
    });
    };

    const alertaAccionRealizada = () => {
    Swal.fire({
        icon: "info",
        title: "Acción ya realizada",
        text: "Ya has realizado una acción para este pedido.",
        confirmButtonText: "Ok",
    });
    };


    
  if (!userData) return <p>Cargando usuario...</p>;

  return (
    <div className="container mt-4">
      <h3>Pedidos Cliente</h3>
      <input
        type="text"
        placeholder="Buscar por producto o estado..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {pedidos.length === 0 ? (
        <p>No hay ningún pedido</p>
      ) : filtrarPedidos().length === 0 ? (
        <p>No se encontraron pedidos que coincidan con la búsqueda.</p>
      ) : (
          <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Cantidad Solicitada</th>
              <th>Cantidad Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarPedidos().map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.productoNombre}</td>
                <td>{userData.nombre}</td>
                <td>{pedido.estado}</td>
                <td>{pedido.cantidadSolicitada}</td>
                <td>{pedido.productoCantidad}</td>
                <td>
                        {pedido.estado === "pendiente" ? (
                        <>
                            <button
                            type="button"
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => confirmarEntrega(pedido)}
                            >
                            Entregar
                            </button>
                            <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => confirmarRechazo(pedido)}
                            >
                            Rechazar
                            </button>
                        </>
                        ) : (
                        <>
                            <button
                            type="button"
                            className="btn btn-sm btn-secondary me-1"
                            onClick={alertaAccionRealizada}
                            >
                            Entregar
                            </button>
                            <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={alertaAccionRealizada}
                            >
                            Rechazar
                            </button>
                        </>
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


