import { useEffect, useState, useCallback } from "react";
import { deleteProducto, hayProductosVencidos } from "../../services/productoFirebase";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import TablaProductos from '../../components/empresa/TablaProductos';
import ModalProductos from '../../components/empresa/ModalProductos';

export default function Productos() {
  const { userData } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    vencimiento: "",
    id: null,
  });

  // NUEVOS ESTADOS
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [orden, setOrden] = useState("nombre-asc");
  const [porPagina, setPorPagina] = useState(10);
  const [tieneVencidos, setTieneVencidos] = useState(false);

  const handleRefresh = () => {
    setRefreshTick((t) => t + 1);
  };

  const eliminar = useCallback(async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Eliminar producto?",
        showCancelButton: true,
      });
      if (confirm.isConfirmed) {
        await deleteProducto(id);
        handleRefresh();
      } else {
        return;
      }
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  }, []);

  const abrirModal = (producto = null) => {
    if (producto) {
      setFormData({ ...producto });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        vencimiento: "",
        id: null,
      });
    }
    setShowModal(true);
  };

  useEffect(() => {
    if (!userData?.uid) return;
    const checkVencidos = async () => {
      const hayVencidos = await hayProductosVencidos(userData.uid);
      setTieneVencidos(hayVencidos);
    };
    checkVencidos();
  }, [userData]);

  return (
    <>
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-12">
            <h3>Gestión de Productos</h3>
            {tieneVencidos && (
              <div className="alert alert-danger mt-3">
                ¡Atención! Tienes productos vencidos.
              </div>
            )}
          </div>

          {/* FILTRO DE ESTADO */}
          <div className="col-12 col-md-3">
            <label className="form-label">Estado del producto</label>
            <select
              className="form-select"
              value={estadoFiltro}
              onChange={e => setEstadoFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="disponibles">Disponibles</option>
              <option value="por-vencer">Por vencer</option>
              <option value="vencidos">Vencidos</option>
            </select>
          </div>

          {/* ORDENAMIENTO */}
          <div className="col-12 col-md-3">
            <label className="form-label">Ordenar por</label>
            <select
              className="form-select"
              value={orden}
              onChange={e => setOrden(e.target.value)}
            >
              <option value="nombre-asc">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
              <option value="precio-asc">Precio (menor a mayor)</option>
              <option value="precio-desc">Precio (mayor a menor)</option>
            </select>
          </div>

          {/* CANTIDAD POR PÁGINA */}
          <div className="col-12 col-md-3">
            <label className="form-label">Productos por página</label>
            <select
              className="form-select"
              value={porPagina}
              onChange={e => setPorPagina(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="col"></div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => abrirModal()}>
              Agregar Producto
            </button>
          </div>

          <div className="col-12">
            <div className="btn-group" role="group" aria-label="Basic example" style={{ width: '100%' }}>
              <input
                className="form-control"
                type="search"
                placeholder="Buscar nombre"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn btn-outline-success" onClick={handleRefresh}>
                <i className="fa-solid fa-arrows-rotate"></i>
              </button>
            </div>
          </div>

          <div className="col-12">
            <TablaProductos
              key={refreshTick}
              busqueda={busqueda}
              userData={userData}
              eliminar={eliminar}
              abrirModal={abrirModal}
              estadoFiltro={estadoFiltro}
              orden={orden}
              porPagina={porPagina}
            />
          </div>
        </div>
      </div>

      <ModalProductos
        id="productoModal"
        show={showModal}
        setShow={setShowModal}
        userData={userData}
        formData={formData}
        setFormData={setFormData}
        abrirModal={abrirModal}
        handleRefresh={handleRefresh}
      />
    </>
  );
}
