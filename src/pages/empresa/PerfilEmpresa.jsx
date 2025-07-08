import { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

// Lista de comunas (puedes mover esto a otro archivo si lo deseas)
const comunasDisponibles = [
  "La Serena",
    "Vicuña",
    "Ovalle",
    "Coquimbo",
    "Santiago",
];

export default function EmpresaPerfil() {
  const { user } = useContext(AuthContext);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    comuna: "",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setEmpresa(data);
          setForm({
            nombre: data.nombre || "",
            comuna: data.comuna || "",
            direccion: data.direccion || "",
            telefono: data.telefono || "",
          });
        }
      } catch (error) {
        console.error("Error al obtener empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchEmpresa();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "¿Deseas actualizar la información de tu perfil?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const ref = doc(db, "usuarios", user.uid);
        await updateDoc(ref, {
          nombre: form.nombre,
          comuna: form.comuna,
          direccion: form.direccion,
        });
        setEmpresa({ ...empresa, ...form });
        setEditando(false);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Perfil actualizado correctamente.",
        });
      } catch (error) {
        console.error("Error al actualizar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al guardar.",
        });
      }
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="container mt-4">
      <h2>Perfil del Cliente</h2>

      <div className="mb-3">
        <label className="form-label">Correo:</label>
        <input
          type="email"
          className="form-control"
          value={empresa.email}
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
            maxLength={30}
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
          maxLength={50}
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
          maxLength={15}
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
