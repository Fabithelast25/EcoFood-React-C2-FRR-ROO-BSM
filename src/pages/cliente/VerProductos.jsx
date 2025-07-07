import React, { useEffect, useState } from "react";
import { collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { crearPedido } from "../../services/pedidoFirebase";
import { useAuth } from "../../context/AuthContext";
import { obtenerEmpresaPorId } from "../../services/EmpresaFirebase";
import Swal from "sweetalert2";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [cantidadPorPagina, setCantidadPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);
  const { userData } = useAuth();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const ref = collection(db, "productos");
        const snapshot = await getDocs(ref);
        const lista = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const fechaCreacion = data.fechaCreacion?.toDate?.().toLocaleString("es-CL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) || "Sin fecha";

            const fechaSolo = data.fechaCreacion?.toDate?.().toISOString().slice(0, 10) || "";

            return { ...data, id: doc.id, fechaCreacion, fechaSolo };
          })
          .filter((p) => p.estado?.toLowerCase() === "disponible" && p.cantidad > 0);

        setProductos(lista);
      } catch (e) {
        console.error("Error al cargar productos:", e);
      }
    };

    cargarProductos();
  }, []);

  const manejarCantidad = (id, valor) => {
    const num = parseInt(valor);
    if (!isNaN(num)) {
      setCantidades({ ...cantidades, [id]: num });
    }
  };

  const solicitar = async (producto) => {
    const cantidadSolicitada = cantidades[producto.id] || 1;

    if (cantidadSolicitada > producto.cantidad) {
      Swal.fire("Cantidad inválida", "No puedes solicitar más de lo disponible.", "warning");
      return;
    }

    if (!userData?.email) {
      Swal.fire("No autenticado", "Debes iniciar sesión para realizar pedidos.", "info");
      return;
    }

    const confirmacion = await Swal.fire({
      title: `¿Solicitar ${cantidadSolicitada} unidad(es) de "${producto.nombre}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, solicitar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    let empresaNombre = "Desconocida";
    if (producto.empresaId) {
      const empresa = await obtenerEmpresaPorId(producto.empresaId);
      if (empresa?.nombre) {
        empresaNombre = empresa.nombre;
      }
    }

    const pedido = {
      productoId: producto.id,
      productoNombre: producto.nombre,
      empresaId: producto.empresaId || "sin_id",
      empresaNombre,
      cantidadSolicitada,
      emailCliente: userData.email,
      estado: "pendiente",
      fechaCreacion: serverTimestamp(), // ✅ importante
    };

    try {
      await crearPedido(pedido);
      Swal.fire("¡Pedido realizado!", `Has solicitado ${cantidadSolicitada} unidades.`, "success");
    } catch (error) {
      console.error("Error al registrar el pedido:", error);
      Swal.fire("Error", "No se pudo registrar el pedido.", "error");
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFecha = fechaFiltro ? p.fechaSolo === fechaFiltro : true;
    return coincideNombre && coincideFecha;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / cantidadPorPagina);
  const inicio = (paginaActual - 1) * cantidadPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, inicio + cantidadPorPagina);

  return (
    <div className="container mt-4">
      <h2>Productos disponibles</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-control"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

        <div className="col-md-4">
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
          <select
            className="form-select"
            value={cantidadPorPagina}
            onChange={(e) => {
              setCantidadPorPagina(parseInt(e.target.value));
              setPaginaActual(1);
            }}
          >
            <option value={5}>5 productos</option>
            <option value={10}>10 productos</option>
            <option value={15}>15 productos</option>
          </select>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="text-muted">No se encontraron productos.</p>
      ) : (
        <>
          {productosPagina.map((producto) => (
            <div key={producto.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.descripcion}</p>
                <p className="card-text">
                  <strong>Disponible:</strong> {producto.cantidad} unidades
                </p>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={producto.cantidad}
                    className="form-control"
                    style={{ width: "100px" }}
                    value={cantidades[producto.id] || 1}
                    onChange={(e) => manejarCantidad(producto.id, e.target.value)}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => solicitar(producto)}
                  >
                    Solicitar
                  </button>
                </div>
              </div>
            </div>
          ))}

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
