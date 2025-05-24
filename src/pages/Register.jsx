import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [comuna, setComuna] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const navigate = useNavigate();

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
    setTelefono(formatearTelefono(numeros));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarPassword(password)) {
      Swal.fire("Contraseña inválida", "Debe tener al menos 6 caracteres, incluyendo letras y números.", "warning");
      return;
    }

    if (telefono && telefono.replace(/\D/g, "").length !== 11) {
      Swal.fire("Teléfono inválido", "Debe contener exactamente 11 dígitos (Ej: +56 9 1234 5678)", "warning");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(cred.user);

      await saveUserData(cred.user.uid, {
        nombre,
        tipo,
        email,
        telefono,
        comuna,
        direccion,
        email_verificado: false,
        creado: new Date()
      });

      Swal.fire("Registrado", "Usuario creado correctamente. Revisa tu correo para verificar tu cuenta.", "success");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <button type="button" className="btn btn-primary">
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Volver</Link>
      </button>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            minLength={3}
            maxLength={50}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            minLength={6}
            maxLength={100}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            maxLength={50}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            value={telefono}
            onChange={handleTelefonoChange}
            placeholder="+56 9 1234 5678"
            inputMode="numeric"
            minLength={8}
            maxLength={18}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            minLength={5}
            maxLength={100}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="">Seleccione</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Comuna/Ciudad</label>
          <select
            className="form-select"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          >
            <option value="">Seleccione</option>
            <option value="La Serena">La Serena</option>
            <option value="Vicuña">Vicuña</option>
            <option value="Ovalle">Ovalle</option>
            <option value="Coquimbo">Coquimbo</option>
            <option value="Santiago">Santiago</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">Registrar</button>
      </form>
    </div>
  );
}
