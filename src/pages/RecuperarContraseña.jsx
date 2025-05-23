import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleResetPassword}>
        <label>
          Correo Electrónico:
          <input type="email" name="email" onChange={handleEmailChange} value={email} required />
        </label>
        <button type="submit">Recuperar Contraseña</button>
      </form>
    </div>
  );
}

export default RecuperarContraseña;

