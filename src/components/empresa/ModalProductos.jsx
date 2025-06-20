import { addProducto, updateProducto } from '../../services/productoFirebase';
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { useState } from 'react';

export default function AddProductos({
  show,
  setShow,
  userData,
  handleRefresh,
  formData,
  setFormData,
}) {

  const [errores, setErrores] = useState({})

  const validarPrecio = (precio) => {
    const soloNumeros = precio.replace(/[^0-9]/g, "");
    return soloNumeros;
  };

  const validarCantidad = (cantidad) => {
    const soloNumeros = cantidad.replace(/[^0-9]/g, "");
    return soloNumeros;
  };

  const validarDatos = () => {
    const errs = {};

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      errs.nombre = "El nombre solo debe contener letras y espacios.";
    }

    if (formData.nombre.trim().length < 3) {
      errs.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (formData.nombre.length > 25) {
      errs.nombre = "Máximo de carácteres : 25"
    }

    if (formData.descripcion.length > 200) {
      errs.descripcion = "Máximo de carácteres : 200"
    }

    if (formData.descripcion.length < 20) {
      errs.descripcion = "La descripción debe contener al menos 20 caracteres"
    }

    
    const precio = parseInt(formData.precio, 10);
    if (isNaN(precio) || precio < 0) {
      errs.precio = "El precio debe ser un número mayor a 0.";
    } else if (precio > 99999) {
      errs.precio = "El precio no puede superar los $99.999";
    }


    const cantidad = parseInt(formData.cantidad, 10);
    if (isNaN(cantidad) || cantidad < 0) {
      errs.cantidad = "La cantidad debe ser un número mayor o igual a 0.";
    } else if (cantidad > 100000) {
      errs.cantidad = "La cantidad no puede superar las 100.000 unidades";
    }

    if (!formData.vencimiento) {
      errs.vencimiento = "Debe ingresar una fecha de vencimiento.";
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaVencimiento = new Date(formData.vencimiento);
      fechaVencimiento.setHours(0, 0, 0, 0);

      if (fechaVencimiento < hoy) {
        errs.vencimiento = "La fecha de vencimiento no puede ser anterior a hoy.";
      }
    }

    return errs;
  }

  const guardarProducto = async (e) => {
    e.preventDefault();
    const erroresVal = validarDatos();
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal);
      return;
    }

    setErrores({});

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVencimiento = new Date(formData.vencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    const diferenciaDias = (fechaVencimiento - hoy) / (1000 * 60 * 60 * 24);

    if (diferenciaDias <= 3) {
      await Swal.fire({
        icon: "warning",
        title: "¡Advertencia!",
        text: "El producto está por vencer en menos de 3 días.",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

    formData.precio = parseInt(formData.precio);

    if (formData.cantidad === 0) {
      formData.estado = "No disponible";
    } else if (formData.cantidad > 0) {
      formData.estado = "Disponible";
    }


    if (formData.id) {
      await updateProducto(formData.id, formData);
      Swal.fire("Actualizado correctamente", "", "success");
    } else {
      await addProducto({ ...formData, empresaId: userData.uid });
      Swal.fire("Agregado correctamente", "", "success");
    }
    handleRefresh();
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          {formData.id ? "Editar" : "Agregar"} Producto
        </Modal.Title>
      </Modal.Header>

      <form onSubmit={guardarProducto}>
        <Modal.Body>
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            id="nombre"
            className="form-control mb-2"
            placeholder="Nombre"
            maxLength={25}
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          {errores.nombre && (
            <div className="text-danger mb-2">
              {errores.nombre}
            </div>
          )}

          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            className="form-control mb-2"
            placeholder="Descripción"
            value={formData.descripcion}
            maxLength={200}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          ></textarea>
          {errores.descripcion && (
            <div className="text-danger mb-2">
              {errores.descripcion}
            </div>
          )}

          <label htmlFor="precio" className="form-label">Precio</label>
          <input
            id="precio"
            type="text"
            className="form-control mb-2"
            maxLength={5}
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: validarPrecio(e.target.value) })
            }
          />
          {errores.precio && (
            <div className="text-danger mb-2">
              {errores.precio}
            </div>
          )}

          <label htmlFor="cantidad" className="form-label">Cantidad</label>
          <input
            id="cantidad"
            type="text"
            className="form-control mb-2"
            maxLength={5}
            value={formData.cantidad}
            onChange={(e) =>
              setFormData({ ...formData, cantidad: validarCantidad(e.target.value) })
            }
          />
          {errores.cantidad && (
            <div className="text-danger mb-2">
              {errores.cantidad}
            </div>
          )}

          <label htmlFor="fecha" className="form-label">Fecha Vencimiento</label>
          <input
            id="fecha"
            type="date"
            className="form-control"
            value={formData.vencimiento}
            onChange={(e) =>
              setFormData({ ...formData, vencimiento: e.target.value })
            }
          />
          {errores.vencimiento && (
            <div className="text-danger mb-2">
              {errores.vencimiento}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setErrores({})
              setShow(false)
            }}
          >
            Cerrar
          </button>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

