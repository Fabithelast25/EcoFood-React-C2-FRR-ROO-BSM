import { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PerfilCliente() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    comuna: "",
    direccion: "",
    telefono: "",
  });

  const comunasDisponibles = [
    "La Serena",
    "Vicuña",
    "Ovalle",
    "Coquimbo",
    "Santiago",
  ];

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCliente(data);
          setForm({
            nombre: data.nombre || "",
            comuna: data.comuna || "",
            direccion: data.direccion || "",
            telefono: data.telefono || "",
          });
        }
      } catch (error) {
        console.error("Error al obtener cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchCliente();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const ref = doc(db, "usuarios", user.uid);
      await updateDoc(ref, {
        nombre: form.nombre,
        comuna: form.comuna,
        direccion: form.direccion,
        // No se actualiza el teléfono
      });
      setCliente({ ...cliente, ...form });
      setEditando(false);
      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Ocurrió un error al guardar.");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-primary mb-3" onClick={() => navigate("/cliente/HomeCliente")}>
        Volver al inicio
      </button>

      <h2>Perfil del Cliente</h2>

      <div className="mb-3">
        <label className="form-label">Correo:</label>
        <input
          type="email"
          className="form-control"
          value={cliente.email}
          readOnly
          disabled
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre:</label>
        <input
          type="text"
          className="form-control"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          disabled={!editando}
          maxLength={50} 
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Comuna:</label>
        {editando ? (
          <select
            className="form-select"
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            {comunasDisponibles.map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            className="form-control"
            value={form.comuna}
            readOnly
            disabled
            maxLength={30} // 
          />
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Dirección:</label>
        <input
          type="text"
          className="form-control"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          disabled={!editando}
          maxLength={50} // 
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Teléfono:</label>
        <input
          type="text"
          className="form-control"
          name="telefono"
          value={form.telefono}
          readOnly
          disabled
          maxLength={15} // 
        />
      </div>

      {editando ? (
        <>
          <button className="btn btn-success me-2" onClick={handleGuardar}>
            Guardar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setEditando(false)}
          >
            Cancelar
          </button>
        </>
      ) : (
        <button className="btn btn-warning" onClick={() => setEditando(true)}>
          Editar
        </button>
      )}
    </div>
  );
}


