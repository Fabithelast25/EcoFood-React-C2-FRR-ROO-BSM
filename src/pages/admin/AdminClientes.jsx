import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getClientes, addCliente, updateCliente, deleteCliente } from "../../services/clienteFirebase.js"

export default function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [clienteActivo, setClienteActivo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        comuna: "",
        password: ""
    });

    const [errores, setErrores] = useState({});

    const cargarClientes = async () => {
        const data = await getClientes();
        setClientes(data);
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = "Correo electrónico no válido.";
    } else {
      const emailExistente = clientes.find(
        (e) => e.email.trim().toLowerCase() === emailTrimmed && (!adminActivo || e.id !== adminActivo.id)
      );
      if (emailExistente) {
        errs.email = "Este correo ya está asociado a otro usuario.";
      }
      const password = formData.password.trim();
      if (password.length < 8 || password.length > 20) {
        errs.password = "La contraseña debe tener entre 8 y 20 caracteres.";
      } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
        errs.password = "La contraseña debe incluir letras y números.";
      }
      else if (!formData.password.trim()) {
          errs.password = "La contraseña no puede estar vacía"
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
            await updateAdministrador(adminActivo.id, formData);
        } else {
            await registrarAdministradorConAuth(formData);
        }

        if (clienteActivo) {
            await updateCliente(clienteActivo.id, formData);
        } else {
            await addCliente(formData);
        }
        setShowModal(false);
        cargarClientes();
    } catch (error) {
        Swal.fire("Error", error.message, "error");
    }
};


    const eliminar = async (idn, esPrincipal) => {
        if (esPrincipal) {
            Swal.fire("Advertencia", "No puedes eliminar al administrador principal.", "warning");
            return;
        }


        const result = await Swal.fire({
            title: "¿Eliminar cliente?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
        });
        if (result.isConfirmed) {
            await deleteCliente(id);
            cargarClientes();
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    return (
        <div className="container mt-4">
            <h3>Clientes Registrados</h3>
            <button
                className="btn btn-primary"
                onClick={() => {
                    setClienteActivo(null);
                    setShowModal(true);
                }}
            >
                Nuevo Cliente
            </button>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Comuna</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((c) => (
                        <tr key={c.id}>
                            <td>{c.nombre}</td>
                            <td>{c.email}</td>
                            <td>{c.comuna}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                        setClienteActivo(c);
                                        setFormData(c);
                                        setShowModal(true);
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => eliminar(c.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}
                                </h5>
                            </div>
                            <div className="modal-body">
                                <input
                                    className="form-control mb-2"
                                    placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nombre: e.target.value })
                                    }
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
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
                                <input type="password"
                                    className="form-control mb-2"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    minLength={6}
                                    maxLength={50}
                                    required
                                />
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
