import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  registrarAdministradorConAuth,
  updateAdministrador,
  deleteAdministrador
} from "../../services/AdministradorFirebase";
import { getAuth } from "firebase/auth";

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

  const [errores, setErrores] = useState({});

  const cargarAdmins = async () => {
    const data = await getAdministradores();
    setAdmins(data);
  };

  const validarDatos = () => {
    const errs = {};
    const emailTrimmed = formData.email.trim().toLowerCase();

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      errs.nombre = "El nombre solo debe contener letras y espacios.";
    }
    if (!formData.direccion.trim()) {
      errs.direccion = "La dirección no puede estar vacía.";
    }
    if (!formData.comuna) {
      errs.comuna = "Debe seleccionar una comuna.";
    }
    if (!/^\+56\s9\s\d{4}\s\d{4}$/.test(formData.telefono.trim())) {
      errs.telefono = "Debe ser un número chileno válido (ej: +56 9 1234 5678).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = "Correo electrónico no válido.";
    } else {
      const emailExistente = admins.find(
        (e) => e.email.trim().toLowerCase() === emailTrimmed && (!adminActivo || e.id !== adminActivo.id)
      );
      if (emailExistente) {
        errs.email = "Este correo ya está asociado a otro administrador.";
      }
      if (!adminActivo) {
        const password = formData.password ? formData.password.trim() : "";
        if (!password) {
          errs.password = "La contraseña no puede estar vacía.";
        } else if (password.length < 8 || password.length > 20) {
          errs.password = "La contraseña debe tener entre 8 y 20 caracteres.";
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
          errs.password = "La contraseña debe incluir letras y números.";
        }
      }
    }
    return errs;
  };

  const guardar = async () => {
    const erroresVal = validarDatos();
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal);
      return;
    }
    setErrores({});
    try {
      if (adminActivo) {
        await updateAdministrador(adminActivo.id, {
          nombre: formData.nombre,
          comuna: formData.comuna,
          direccion: formData.direccion,
          telefono: formData.telefono,
        });
        Swal.fire("Actualizado", "Administrador actualizado correctamente.", "success");
      } else {
        await registrarAdministradorConAuth(formData);
        Swal.fire("Agregado", "Administrador registrado correctamente.", "success");
      }
      setShowModal(false);
      cargarAdmins();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const auth = getAuth();
  const usuarioActual = auth.currentUser;
  const eliminar = async (id, esPrincipal, email) => {
    if (esPrincipal) {
      Swal.fire("Advertencia", "No puedes eliminar al administrador principal.", "warning");
      return;
    }

    if (usuarioActual && email === usuarioActual.email) {
      Swal.fire("Advertencia", "No puedes eliminar tu propio usuario.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    });

    if (result.isConfirmed) {
      try {
        await deleteAdministrador(id);
        Swal.fire("Eliminado", "Administrador eliminado correctamente.", "success");
        cargarAdmins();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Administradores</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
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
        }}
      >
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
                    setFormData({
                      nombre: admin.nombre || "",
                      email: admin.email || "",
                      comuna: admin.comuna || "",
                      direccion: admin.direccion || "",
                      telefono: admin.telefono || "",
                      password: ""
                    });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={admin.principal}
                  onClick={() => eliminar(admin.id, admin.principal, admin.email)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {admins.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No hay administradores registrados.
              </td>
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
                {errores.nombre && (
                  <div className="text-danger mb-2">{errores.nombre}</div>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control mb-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  readOnly={!!adminActivo}
                />
                {errores.email && (
                  <div className="text-danger mb-2">{errores.email}</div>
                )}
                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  minLength={5}
                  maxLength={50}
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                />
                {errores.direccion && (
                  <div className="text-danger mb-2">{errores.direccion}</div>
                )}
                <select
                  className="form-control mb-2"
                  value={formData.comuna}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                >
                  <option value="">Seleccione</option>
                  <option value="La Serena">La Serena</option>
                  <option value="Vicuña">Vicuña</option>
                  <option value="Ovalle">Ovalle</option>
                  <option value="Coquimbo">Coquimbo</option>
                  <option value="Santiago">Santiago</option>
                </select>
                {errores.comuna && (
                  <div className="text-danger mb-2">{errores.comuna}</div>
                )}
                <input
                  className="form-control mb-2"
                  placeholder="Teléfono"
                  maxLength={17}
                  value={formData.telefono}
                  onChange={(e) => {
                    let input = e.target.value.replace(/\D/g, "");
                    if (input.startsWith("56")) input = input.slice(2);
                    if (input.length > 9) input = input.slice(0, 9);
                    if (input.length === 0) {
                      setFormData({ ...formData, telefono: "" });
                    } else {
                      const formatted = `+56 9 ${input.slice(1, 5)} ${input.slice(5, 9)}`.trim();
                      setFormData({ ...formData, telefono: formatted });
                    }
                  }}
                />
                {errores.telefono && (
                  <div className="text-danger mb-2">{errores.telefono}</div>
                )}
                {!adminActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={6}
                    maxLength={20}
                    required
                  />
                )}
                {errores.password && (
                  <div className="text-danger mb-2">{errores.password}</div>
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
