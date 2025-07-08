import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getEmpresas,
  addEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../../services/EmpresaFirebase";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaActiva, setEmpresaActiva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
    password: "",
  });
  const [errores, setErrores] = useState({});

  const cargarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las empresas.", "error");
    }
  };

  const validarRut = (rut) => {
    rut = rut.replace(/[^0-9kK]/g, "");
    if (rut.length < 8 || rut.length > 9) return false;
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    let dvCalculado =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
    return dv === dvCalculado;
  };

  const formatearRut = (rut) => {
    rut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (rut.length <= 1) return rut;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    cuerpo = cuerpo.replace(/^0+/, "");
    let formatted = "";
    for (let i = cuerpo.length; i > 0; i -= 3) {
      let start = Math.max(i - 3, 0);
      let part = cuerpo.slice(start, i);
      formatted = part + (formatted ? "." + formatted : "");
    }
    return `${formatted}-${dv}`;
  };

  const validarDatos = () => {
    const errs = {};
    const emailTrimmed = formData.email.trim().toLowerCase();

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      errs.nombre = "El nombre solo debe contener letras y espacios.";
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
      const emailExistente = empresas.find(
        (e) =>
          e.email.trim().toLowerCase() === emailTrimmed &&
          (!empresaActiva || e.id !== empresaActiva.id)
      );
      if (emailExistente) {
        errs.email = "Este correo ya está asociado a otra empresa.";
      }
    }
    if (!validarRut(formData.rut.trim())) {
      errs.rut = "RUT no válido.";
    }

    // Validación de contraseña
    if (!empresaActiva || formData.password.trim() !== "") {
      if (formData.password.length < 12) {
        errs.password = "La contraseña debe tener al menos 12 caracteres.";
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
        errs.password = "La contraseña debe incluir letras y números.";
      }
    }

    return errs;
  };

  const guardar = async () => {
    const erroresVal = validarDatos();
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal);

      // Mostrar SweetAlert con la lista de errores
      const erroresHtml = Object.values(erroresVal)
        .map((e) => `<li>${e}</li>`)
        .join("");
      Swal.fire({
        icon: "error",
        title: "Errores en el formulario",
        html: `<ul style="text-align:left;">${erroresHtml}</ul>`,
      });
      return;
    }
    setErrores({});

    const dataToSave = { ...formData };
    if (empresaActiva && formData.password.trim() === "") {
      delete dataToSave.password; // No actualizar contraseña si está vacía
    }

    try {
      if (empresaActiva) {
        await updateEmpresa(empresaActiva.id, dataToSave);
        Swal.fire("Actualizado", "Empresa actualizada correctamente", "success");
      } else {
        await addEmpresa(dataToSave);
        Swal.fire("Guardado", "Empresa creada correctamente", "success");
      }
      setShowModal(false);
      cargarEmpresas();
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al guardar la empresa.", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });
    if (result.isConfirmed) {
      try {
        await deleteEmpresa(id);
        Swal.fire("Eliminada", "Empresa eliminada correctamente", "success");
        cargarEmpresas();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la empresa.", "error");
      }
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Empresas Registradas</h3>
      <button
        className="btn btn-primary me-2"
        onClick={() => {
          setEmpresaActiva(null);
          setFormData({
            nombre: "",
            rut: "",
            direccion: "",
            comuna: "",
            email: "",
            telefono: "",
            password: "",
          });
          setErrores({});
          setMostrarPassword(false);
          setShowModal(true);
        }}
      >
        Nueva Empresa
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Dirección</th>
            <th>Comuna</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.rut}</td>
              <td>{e.direccion}</td>
              <td>{e.comuna}</td>
              <td>{e.email}</td>
              <td>{e.telefono}</td>
              <td>
                <div className="mt-2">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEmpresaActiva(e);
                      setFormData({ ...e, password: "" });
                      setErrores({});
                      setMostrarPassword(false);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminar(e.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Nueva/Editar Empresa */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {empresaActiva ? "Editar Empresa" : "Nueva Empresa"}
                </h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  maxLength={50}
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
                {errores.nombre && (
                  <div className="text-danger mb-2">{errores.nombre}</div>
                )}
                <input
                  className="form-control mb-2"
                  placeholder="RUT"
                  maxLength={12}
                  value={formData.rut}
                  onChange={(e) =>
                    setFormData({ ...formData, rut: formatearRut(e.target.value) })
                  }
                />
                {errores.rut && (
                  <div className="text-danger mb-2">{errores.rut}</div>
                )}
                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  maxLength={100}
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
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
                  placeholder="Email"
                  maxLength={80}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!!empresaActiva}
                />
                {errores.email && (
                  <div className="text-danger mb-2">{errores.email}</div>
                )}
                {empresaActiva && (
                  <div className="form-text text-muted mb-2">
                    El correo no se puede modificar una vez registrado.
                  </div>
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
                      const formatted = `+56 9 ${input.slice(1, 5)} ${input.slice(
                        5,
                        9
                      )}`.trim();
                      setFormData({ ...formData, telefono: formatted });
                    }
                  }}
                />
                {errores.telefono && (
                  <div className="text-danger mb-2">{errores.telefono}</div>
                )}

                <div className="input-group mb-2">
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Contraseña"
                    maxLength={50}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                  >
                    {mostrarPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
                {errores.password && (
                  <div className="text-danger mb-2">{errores.password}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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

