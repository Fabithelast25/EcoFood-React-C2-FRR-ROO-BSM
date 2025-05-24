import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';

function RecuperarContraseña() {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Se ha enviado un correo electrónico de restablecimiento de contraseña a su dirección.");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="container mt-5">
      <button type="button" className="btn btn-primary">
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
          Volver
        </Link>
      </button>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleResetPassword}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            className="form-control"
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


