import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { app } from './firebaseConfig';

const auth = getAuth(app);

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validarPassword = (pass) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validarPassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres, incluyendo letras y números.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      setSuccess('Usuario registrado con éxito. Se ha enviado un correo de verificación a: ' + user.email);
      console.log('Usuario registrado:', {
        email,
        nombreCompleto,
        direccion,
        comuna,
        telefono,
      });
    } catch (error) {
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
          Nombre completo:
          <input
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </label>
        <label>
          Comuna:
          <input
            type="text"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          />
        </label>
        <label>
          Teléfono (opcional):
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </label>
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
