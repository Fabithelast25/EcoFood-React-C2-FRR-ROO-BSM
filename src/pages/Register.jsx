import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService"; // Aquí puedes guardar en Firestore

//Nombre completo
//Correo electrónico
//Contraseña robusta

//Teléfono (opcional)

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [comuna, setComuna] = useState("");
  const [direccion, setDireccion] = useState("");
  const navigate = useNavigate();
  
  const validarPassword = (pass) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;
  return regex.test(pass);
};

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarPassword(password)) {
      Swal.fire("Contraseña inválida", "Debe tener al menos 6 caracteres, incluyendo letras y números.", "warning");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(cred.user); // Enviar correo de verificación

      await saveUserData(cred.user.uid, {
        nombre,
        tipo,
        email,
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
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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
            required
          />
        </div>

        <div className="mb-3">
            <label className="form-label">Direccion</label>
            <input
              type="text"
              className="form-control"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="cliente">Cliente</option>
          </select>
        </div>

        
        <div className="mb-3">
          <label className="form-label">Comuna/Ciudad</label>
          <select
            className="form-select"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
          >
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