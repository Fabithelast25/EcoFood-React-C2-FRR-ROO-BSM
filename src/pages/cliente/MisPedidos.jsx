import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerPedidosPorEmail,
  cancelarPedido,
} from "../../services/pedidoFirebase";
import Swal from "sweetalert2";

export default function PedidosCliente() {
  const { userData } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cantidadPorPagina, setCantidadPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    if (!userData?.email) return;

    const fetchPedidos = async () => {
      const datos = await obtenerPedidosPorEmail(userData.email);

      const pedidosConFecha = datos.map((pedido) => {
        const fechaCreacion = pedido.fechaCreacion?.toDate?.().toLocaleString(
          "es-CL",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ) || "Sin fecha";

        const fechaSolo =
          pedido.fechaCreacion?.toDate?.().toISOString().slice(0, 10) || "";

        return { ...pedido, fechaCreacion, fechaSolo };
      });

      setPedidos(pedidosConFecha);
    };

    fetchPedidos();
  }, [userData]);

  const handleCancelar = async (pedidoId) => {
    const confirmacion = await Swal.fire({
      title: "¿Cancelar pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await cancelarPedido(pedidoId);
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: "cancelado" } : pedido
        )
      );

      Swal.fire("Cancelado", "El pedido fue cancelado correctamente.", "success");
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
      Swal.fire("Error", "No se pudo cancelar el pedido.", "error");
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideNombre = pedido.productoNombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideFecha = fechaFiltro ? pedido.fechaSolo === fechaFiltro : true;
    return coincideNombre && coincideFecha;
  });

  const totalPaginas = Math.ceil(pedidosFiltrados.length / cantidadPorPagina);
  const inicio = (paginaActual - 1) * cantidadPorPagina;
  const pedidosPagina = pedidosFiltrados.slice(
    inicio,
    inicio + cantidadPorPagina
  );

  if (!userData) return <p>Cargando usuario...</p>;

  return (
    <div className="container mt-4">
      <h3>Mis Pedidos</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Filtrar por fecha:</label>
          <input
            type="date"
            className="form-control"
            value={fechaFiltro}
            onChange={(e) => {
              setFechaFiltro(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

        <div className="col-md-4">
          <label>Buscar por nombre:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: manzana, arroz..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

        <div className="col-md-4">
          <label>Mostrar:</label>
          <select
            className="form-select"
            value={cantidadPorPagina}
            onChange={(e) => {
              setCantidadPorPagina(parseInt(e.target.value));
              setPaginaActual(1);
            }}
          >
            <option value={5}>5 pedidos</option>
            <option value={10}>10 pedidos</option>
            <option value={15}>15 pedidos</option>
          </select>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <p>No se encontraron pedidos que coincidan con los filtros.</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosPagina.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.productoNombre}</td>
                  <td>{pedido.empresaNombre}</td>
                  <td>{pedido.estado}</td>
                  <td>{pedido.fechaCreacion}</td>
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

          {/* Paginación */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
