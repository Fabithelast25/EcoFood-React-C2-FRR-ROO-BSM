import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  registrarAdministradorConAuth,
  updateAdministrador,
  deleteAdministrador
} from "../../services/AdministradorFirebase";

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    direccion: "",
    telefono: "",
    password: ""
  });


  const cargarAdmins = async () => {
    const data = await getAdministradores();
    setAdmins(data);
  };

  const validarPassword = (pass) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;
    return regex.test(pass);
  };

  const formatearTelefono = (valor) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    if (numeros.length >= 11) {
      return `+56 ${numeros[2]} ${numeros.slice(3, 7)} ${numeros.slice(7, 11)}`;
    }
    return valor;
  };

  const handleTelefonoChange = (e) => {
    const input = e.target.value;
    const numeros = input.replace(/\D/g, "");
    setFormData({ ...formData, telefono: formatearTelefono(numeros) });
  };
const guardar = async () => {
    const { nombre, email, password, telefono, comuna, direccion } = formData;

    if (!nombre || nombre.length < 3) {
      Swal.fire("Nombre inválido", "Debe tener al menos 3 caracteres.", "warning");
      return;
    }

    if (!email.includes("@") || email.length < 6) {
      Swal.fire("Correo inválido", "Introduce un correo electrónico válido.", "warning");
      return;
    }

    if (!adminActivo && !validarPassword(password)) {
      Swal.fire("Contraseña inválida", "Debe tener al menos 6 caracteres, incluyendo letras y números.", "warning");
      return;
    }

    if (telefono && telefono.replace(/\D/g, "").length !== 11) {
      Swal.fire("Teléfono inválido", "Debe contener exactamente 11 dígitos (Ej: +56 9 1234 5678)", "warning");
      return;
    }

    if (!direccion || direccion.length < 5) {
      Swal.fire("Dirección inválida", "Debe tener al menos 5 caracteres.", "warning");
      return;
    }

    try {
      if (adminActivo) {
        await updateAdministrador(adminActivo.id, formData);
      } else {
        await registrarAdministradorConAuth(formData);
      }
      setShowModal(false);
      cargarAdmins();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Elimina un administrador (si no es el principal)
  const eliminar = async (id, esPrincipal) => {
    if (esPrincipal) {
      Swal.fire("Advertencia", "No puedes eliminar al administrador principal.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí"
    });

    if (result.isConfirmed) {
      await deleteAdministrador(id);
      cargarAdmins();
    }
  };

  // Carga los administradores al montar el componente
  useEffect(() => {
    cargarAdmins();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Administradores</h2>

      <button className="btn btn-primary mb-3" onClick={() => {
        setAdminActivo(null);
        setFormData({
          nombre: "",
          email: "",
          comuna: "",
          direccion: "",
          telefono: "",
          password: ""
        });
        setShowModal(true);
      }}>
        Nuevo Administrador
      </button>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Principal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.nombre}</td>
              <td>{admin.email}</td>
              <td>{admin.comuna}</td>
              <td>{admin.direccion}</td>
              <td>{admin.telefono}</td>
              <td>{admin.principal ? "✅" : "❌"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  disabled={admin.principal}
                  onClick={() => {
                    setAdminActivo(admin);
                    setFormData(admin);
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={admin.principal}
                  onClick={() => eliminar(admin.id, admin.principal)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {admins.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">No hay administradores registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {adminActivo ? "Editar Administrador" : "Nuevo Administrador"}
                </h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  minLength={3}
                  maxLength={50}
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                  minLength={5}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleTelefonoChange}
                  inputMode="numeric"
                  minLength={8}
                  maxLength={18}
                />
                {!adminActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={6}
                    required
                  />
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardar}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}