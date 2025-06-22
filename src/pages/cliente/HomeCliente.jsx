import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CerrarSesion from "../../components/CerrarSesion";

export default function HomeCliente() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  return (
    <div className="container mt-4">
      <h1>¡Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ""}!</h1>
      <div className="d-flex flex-column align-items-center mt-4 gap-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/cliente/VerProductos")}
        >
          Ver productos disponibles
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/cliente/MisPedidos")}
        >
          Ver mis solicitudes
        </button>
        <button
          className="btn btn-outline-info"
          onClick={() => navigate("/cliente/EditarPerfil")}
        >
          Editar perfil
        </button>
      </div>
      <CerrarSesion />
    </div>
  );
}