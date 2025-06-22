import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const ref = collection(db, "productos");
        const snapshot = await getDocs(ref);
        const lista = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .filter(p => p.estado?.toLowerCase() === "disponible" && p.cantidad > 0);

        setProductos(lista);
      } catch (e) {
        console.error("Error al cargar productos:", e);
      }
    };

    cargarProductos();
  }, []);

  const filtrar = () => {
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const manejarCantidad = (id, valor) => {
    const num = parseInt(valor);
    if (!isNaN(num)) {
      setCantidades({ ...cantidades, [id]: num });
    }
  };

  const solicitar = (producto) => {
    const cantidadSolicitada = cantidades[producto.id] || 1;

    if (cantidadSolicitada > producto.cantidad) {
      alert("No puedes solicitar más de lo disponible.");
      return;
    }

    console.log("Solicitud registrada:", {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: cantidadSolicitada,
    });

    alert(`Solicitaste ${cantidadSolicitada} unidades de "${producto.nombre}"`);
  };

  return (
    <div className="container mt-4">
      <h2>Productos disponibles</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {productos.length === 0 ? (
        <p className="text-muted">No hay productos disponibles en este momento.</p>
      ) : filtrar().length === 0 ? (
        <p className="text-muted">No se encontraron productos que coincidan con la búsqueda.</p>
      ) : (
        filtrar().map((producto) => (
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
        ))
      )}
    </div>
  );
}
