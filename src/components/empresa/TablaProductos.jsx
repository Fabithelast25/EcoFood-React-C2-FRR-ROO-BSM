import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  obtenerTotalProductos,
  getProductosByEmpresaPagina,
  PAGE_SIZE,
} from "../../services/productoFirebase";

export default function TablaProductos({
  userData,
  busqueda,
  eliminar,
  abrirModal,
  orden,
  porPagina,
  estadoFiltro,
}) {
  const [total, setTotal] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [productos, setProductos] = useState([]);
  const [sinMas, setSinMas] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setPagina(0);
    setHistorial([]);
  }, [busqueda, orden, porPagina, estadoFiltro]);

  useEffect(() => {
    if (!userData) return;
    const fetchTotal = async () => {
      const cantidad = await obtenerTotalProductos(userData.uid, busqueda);
      setTotal(cantidad);
    };
    fetchTotal();
  }, [userData, busqueda]);

  useEffect(() => {
    const cargarPagina = async () => {
      setCargando(true);
      let cursor = null;
      if (pagina > 0) {
        cursor = historial[pagina - 1] || null;
      }
      const { productos: nuevos, lastVisible } = await getProductosByEmpresaPagina(
        userData.uid,
        cursor,
        busqueda,
        orden,
        porPagina,
        estadoFiltro
      );
      setProductos(nuevos);
      setHistorial((prev) => {
        const copia = [...prev];
        copia[pagina] = lastVisible;
        return copia;
      });
      setSinMas(nuevos.length < (porPagina || PAGE_SIZE));
      setCargando(false);
    };

    if (userData) {
      cargarPagina();
    }
  }, [pagina, userData, busqueda, orden, porPagina, estadoFiltro]);

  return (
    <div className="row">
      <div className="col-12">
        {cargando ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : productos.length === 0 ? (
          <div className="alert alert-info text-center my-4">
            No se encontraron productos con los filtros actuales.
          </div>
        ) : (
          <ul className="list-group mb-3">
            {productos.map((p, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>Nombre:</strong> {p.nombre}
                </div>
                <div>
                  <strong>Precio:</strong> ${p.precio}
                </div>
                <div>
                  <strong>Vence:</strong> {p.vencimiento}
                </div>
                <div>
                  <strong>Cantidad:</strong> {p.cantidad}
                </div>
                <div>
                  <strong>Estado:</strong> {p.estado}
                </div>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminar(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="col">
        <p className="mt-2">Total de productos: {total}</p>
      </div>

      <div className="col-auto">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${pagina <= 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina <= 0}
              >
                <i className="fa-solid fa-arrow-left" />
              </button>
            </li>
            <li className={`page-item ${sinMas ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPagina((p) => p + 1)}
                disabled={sinMas}
              >
                <i className="fa-solid fa-arrow-right" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

TablaProductos.propTypes = {
  userData: PropTypes.object,
  busqueda: PropTypes.string,
  eliminar: PropTypes.func.isRequired,
  abrirModal: PropTypes.func.isRequired,
  orden: PropTypes.string,
  porPagina: PropTypes.number,
  estadoFiltro: PropTypes.string,
};
