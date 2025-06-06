import { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";

export default function EmpresaPerfil() {
  const { user } = useContext(AuthContext); // asumimos que esto tiene el uid del usuario
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    comuna: "",
    direccion: "",
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
    try {
      const ref = doc(db, "usuarios", user.uid);
      await updateDoc(ref, {
        nombre: form.nombre,
        comuna: form.comuna,
        direccion: form.direccion,
      });
      setEmpresa({ ...empresa, ...form });
      setEditando(false);
      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Ocurrió un error al guardar.");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Perfil Empresarial</h2>
      <div>
        <label>Correo:</label>
        <input type="email" value={empresa.email} readOnly disabled />
      </div>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          disabled={!editando}
        />
      </div>
      <div>
        <label>Comuna:</label>
        <input
          type="text"
          name="comuna"
          value={form.comuna}
          onChange={handleChange}
          disabled={!editando}
        />
      </div>
      <div>
        <label>Dirección:</label>
        <input
          type="text"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          disabled={!editando}
        />
      </div>

      {editando ? (
        <>
          <button onClick={handleGuardar}>Guardar</button>
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </>
      ) : (
        <button onClick={() => setEditando(true)}>Editar</button>
      )}
    </div>
  );
}
