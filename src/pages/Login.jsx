import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import Swal from "sweetalert2";
import { auth } from "../services/firebase";
import { getUserData } from "../services/userService";
import "../components/estilosCSS/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        Swal.fire("Verificación requerida", "Debes verificar tu correo antes de ingresar.", "warning");
        return;
      }

      const datos = await getUserData(cred.user.uid);
      if (datos.tipo === "admin") navigate("/admin/dashboard");
      else if (datos.tipo === "empresa") navigate("/empresa/dashboard");
      else if (datos.tipo === "cliente") navigate("/cliente/homecliente");
    } catch (error) {
      Swal.fire("Error", "Credenciales incorrectas", "error");
    }
  };

  return (
    <div className="login-form-container">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            maxLength={100}
            required
          />
          <label>Correo Electrónico</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            maxLength={50}
            required
          />
          <label>Contraseña</label>
        </div>

        <Link to="/recuperar-password" className="recuperar-link">
          Recuperar Contraseña
        </Link>

        <button type="submit" className="btn-login">
          Iniciar Sesión
        </button>

        <div className="crear-cuenta">
          <Link to="/registro">
            <button type="button" className="btn btn-success">
              Crear Cuenta Nueva
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

