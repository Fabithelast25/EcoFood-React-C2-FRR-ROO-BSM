import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerPedidosPorEmpresaId, actualizarEstadoPedido } from "../../services/pedidoFirebase";
import { obtenerProductoPorId, reducirStockProducto } from "../../services/productoFirebase";
import { Popover } from 'bootstrap';
import Swal from "sweetalert2";

// Función para formatear fecha y hora
function formatearFechaHora(fecha) {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  let horas = fecha.getHours();
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const esPM = horas >= 12;
  horas = horas % 12 || 12;
  const amPm = esPM ? 'P.M.' : 'A.M.';
  return `${dia}-${mes}-${anio}\n${horas}:${minutos} ${amPm}`;
}

// Función para cargar y formatear los pedidos
async function cargarPedidosFormateados(empresaId) {
  const pedidos = await obtenerPedidosPorEmpresaId(empresaId);
  return await Promise.all(
    pedidos.map(async (pedido) => {
      const producto = await obtenerProductoPorId(pedido.productoId);
      return {
        ...pedido,
        productoNombre: producto?.nombre || "Producto no encontrado",
        productoCantidad: producto?.cantidad ?? "N/A",
        fechaFormateada: formatearFechaHora(pedido.fechaCreacion.toDate()),
        fecha: pedido.fechaCreacion.toDate() // para ordenar después
      };
    })
  );
}

export default function PedidosCliente() {
  const { userData } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [ordenNombre, setOrdenNombre] = useState("az");
  const [ordenFecha, setOrdenFecha] = useState("recientes");
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);


  useEffect(() => {
    const fetchPedidos = async () => {
      if (!userData?.uid) return;
      const pedidosConNombre = await cargarPedidosFormateados(userData.uid);
      setPedidos(pedidosConNombre);
    };
    fetchPedidos();
  }, [userData]);

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach((el) => new Popover(el));
  }, [pedidos]);

  // ----- Lógica de filtros -----
  const pedidosFiltrados = pedidos
  .filter(p => 
    p.productoNombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (filtroEstado === "todos" || p.estado === filtroEstado)
  )
  .sort((a, b) => {
    if (ordenNombre === "az") {
      return a.productoNombre.toLowerCase().localeCompare(b.productoNombre.toLowerCase());
    }
    if (ordenNombre === "za") {
      return b.productoNombre.toLowerCase().localeCompare(a.productoNombre.toLowerCase());
    }
    if (ordenFecha === "recientes") {
      return b.fecha.getTime() - a.fecha.getTime();
    } 
    if (ordenFecha === "antiguos") {
      return a.fecha.getTime() - b.fecha.getTime();
    }
    return 0;
  });


  const totalPaginas = Math.ceil(pedidosFiltrados.length / itemsPorPagina);
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };


  const manejarEntrega = async (pedido) => {
    try {
      const producto = await obtenerProductoPorId(pedido.productoId);

      if (!producto || producto.cantidad < pedido.cantidadSolicitada) {
        await Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: "No hay suficiente stock para entregar este pedido.",
        });
        return;
      }

      await reducirStockProducto(pedido.productoId, pedido.cantidadSolicitada);
      await actualizarEstadoPedido(pedido.id, "entregado");

      await Swal.fire({
        title: "Pedido entregado correctamente",
        icon: "success",
      });

      const pedidosConNombre = await cargarPedidosFormateados(userData.uid);
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
      });

      const pedidosActualizados = pedidos.map((p) =>
        p.id === pedido.id ? { ...p, estado: "rechazado" } : p
      );
      setPedidos(pedidosActualizados);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al rechazar el pedido: \n" + error.message
      });
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

      {/* Controles de filtro */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select className="form-select" onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="entregado">Entregado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" onChange={(e) => setOrdenNombre(e.target.value)}>
            <option value="az">Nombre A-Z</option>
            <option value="za">Nombre Z-A</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" onChange={(e) => setOrdenFecha(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => {
            setItemsPorPagina(Number(e.target.value));
            setPaginaActual(1);
          }}>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={30}>30 por página</option>
          </select>
        </div>
      </div>

      {/* Tabla de pedidos */}
      {pedidos.length === 0 ? (
        <p>No hay ningún pedido</p>
      ) : (
        <>
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Fecha Solicitud</th>
                <th>Cantidad Solicitada</th>
                <th>Cantidad Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosPaginados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.productoNombre}</td>
                  <td>{userData.nombre}</td>
                  <td>{pedido.estado}</td>
                  <td style={{ whiteSpace: 'pre-line' }}>{pedido.fechaFormateada}</td>
                  <td>{pedido.cantidadSolicitada}</td>
                  <td>{pedido.productoCantidad}</td>
                  <td>
                    {pedido.estado === "pendiente" ? (
                      <>
                        <button className="btn btn-sm btn-primary me-1" onClick={() => confirmarEntrega(pedido)}>Entregar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => confirmarRechazo(pedido)}>Rechazar</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-secondary me-1" onClick={alertaAccionRealizada}>Entregar</button>
                        <button className="btn btn-sm btn-secondary" onClick={alertaAccionRealizada}>Rechazar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${paginaActual === 1 && "disabled"}`}>
                <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>Anterior</button>
              </li>
              {Array.from({ length: totalPaginas }, (_, i) => (
                <li key={i} className={`page-item ${paginaActual === i + 1 && "active"}`}>
                  <button className="page-link" onClick={() => cambiarPagina(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${paginaActual === totalPaginas && "disabled"}`}>
                <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>Siguiente</button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}