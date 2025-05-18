import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from './firebaseConfig'; // Importa la configuración de Firebase

const auth = getAuth(app);

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // El usuario se registró correctamente
      const user = userCredential.user;
      setSuccess('Usuario registrado con éxito: ' + user.email);
      console.log(user);
    } catch (error) {
      // Hubo un error al registrar al usuario
      setError('Error al registrar el usuario: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;