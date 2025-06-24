import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion"; 
import CardProducto from '../components/CardProducto';

export default function Home() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  return (
    <div className="container mt-4">
      <h1>¡Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ""}!</h1>
      <div className="d-flex flex-column align-items-center mt-4 gap-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/empresa/producto")}
        >
          Visualizar productos
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/empresa/solicitudes")}
        >
          Ver solicitudes realizadas
        </button>
        <button
          className="btn btn-outline-info"
          onClick={() => navigate("/empresa/perfil")}
        >
          Editar perfil
        </button>
      </div>
      <CardProducto nombre="Pan Integral" precio="$500" />
      <CerrarSesion /> 
    </div>
  );
}
