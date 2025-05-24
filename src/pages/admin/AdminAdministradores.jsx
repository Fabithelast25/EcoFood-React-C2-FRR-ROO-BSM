import React, { useEffect, useState } from "react";
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
    password: ""
  });

  const cargarAdmins = async () => {
    const data = await getAdministradores();
    setAdmins(data);
  };

  const guardar = async () => {
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

  useEffect(() => {
    cargarAdmins();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Administradores</h2>
      <button className="btn btn-primary mb-3" onClick={() => {
        setAdminActivo(null);
        setFormData({ nombre: "", email: "", comuna: "", direccion: "", password: "" });
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
                <h5 className="modal-title">{adminActivo ? "Editar Administrador" : "Nuevo Administrador"}</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
                {!adminActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
