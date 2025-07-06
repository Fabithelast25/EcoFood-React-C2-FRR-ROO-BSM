import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';
import "../components/estilosCSS/recuperar_contraseña.css";

function RecuperarContraseña() {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Se ha enviado un correo electrónico de restablecimiento de contraseña.");
      setEmail(''); // Limpia el campo tras envío
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="recuperar-container">
      <Link to="/login" className="btn btn-primary volver-btn">
        Volver
      </Link>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleResetPassword}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="usuario@ejemplo.com"
            onChange={handleEmailChange}
            value={email}
            required
            maxLength={100}
          />
        </div>
        <button type="submit" className="btn btn-warning">Recuperar Contraseña</button>
      </form>
    </div>
  );
}

export default RecuperarContraseña;



