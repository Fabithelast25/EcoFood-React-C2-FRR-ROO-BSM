import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import { getUserData } from "../services/userService";

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
            else if (datos.tipo === "empresa") navigate("/empresa/dashboard")
            else if (datos.tipo === "cliente") navigate("/cliente/homecliente");
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            Swal.fire("Error", "Credenciales incorrectas", "error");
        }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            maxLength={50}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
      <Link to="/recuperar-password">Recuperar Contraseña</Link>
      <div className="mt-3">
        <button type="button" className="btn btn-success">
          <Link to="/registro" style={{ color: 'white', textDecoration: 'none' }}>
            Crear Cuenta Nueva
          </Link>
        </button>
      </div>
    </div>
  );
}
