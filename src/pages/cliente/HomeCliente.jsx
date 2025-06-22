import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CerrarSesion from "../../components/CerrarSesion";

export default function HomeCliente() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  return (
    <div className="container mt-4">
      <h1>¡Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ""}!</h1>
    </div>
  );
}