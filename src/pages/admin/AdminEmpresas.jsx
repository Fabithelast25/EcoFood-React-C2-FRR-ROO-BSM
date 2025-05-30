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
  const [showAsociarModal, setShowAsociarModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
  });
  const [productoData, setProductoData] = useState({
    nombre: "",
    producto: "",
  });
  const [errores, setErrores] = useState({});
  const [erroresProducto, setErroresProducto] = useState({});

  const cargarEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
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
    let dvCalculado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

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
        (e) => e.email.trim().toLowerCase() === emailTrimmed && (!empresaActiva || e.id !== empresaActiva.id)
      );
      if (emailExistente) {
        errs.email = "Este correo ya está asociado a otra empresa.";
      }
    }
    if (!validarRut(formData.rut.trim())) {
      errs.rut = "RUT no válido.";
    }
    return errs;
  };

  const validarProducto = () => {
    const errs = {};
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(productoData.nombre.trim())) {
      errs.nombre = "El nombre de la empresa solo debe contener letras y espacios.";
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
    if (empresaActiva) {
      await updateEmpresa(empresaActiva.id, formData);
    } else {
      await addEmpresa(formData);
    }
    setShowModal(false);
    cargarEmpresas();
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });
    if (result.isConfirmed) {
      await deleteEmpresa(id);
      cargarEmpresas();
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
          });
          setErrores({});
          setShowModal(true);
        }}
      >
        Nueva Empresa
      </button>

      <button
        className="btn me-2"
        style={{ backgroundColor: "#cc7000", color: "#ffffff" }}
        onClick={() => {
          setProductoData({ nombre: "", producto: "" });
          setErroresProducto({});
          setShowAsociarModal(true);
        }}
      >
        Asociar Producto
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
                      setFormData(e);
                      setErrores({});
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
                />
                {errores.email && (
                  <div className="text-danger mb-2">{errores.email}</div>
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

      {/* Modal Asociar Producto */}
      {showAsociarModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asociar Producto</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre de la Empresa"
                  maxLength={50}
                  value={productoData.nombre}
                  onChange={(e) =>
                    setProductoData({ ...productoData, nombre: e.target.value })
                  }
                />
                {erroresProducto.nombre && (
                  <div className="text-danger mb-2">{erroresProducto.nombre}</div>
                )}
                <input
                  className="form-control mb-2"
                  placeholder="Nombre del Producto"
                  maxLength={50}
                  value={productoData.producto}
                  onChange={(e) =>
                    setProductoData({ ...productoData, producto: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAsociarModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    const erroresVal = validarProducto();
                    if (Object.keys(erroresVal).length > 0) {
                      setErroresProducto(erroresVal);
                      return;
                    }
                    setErroresProducto({});
                  }}
                >
                  Asociar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
