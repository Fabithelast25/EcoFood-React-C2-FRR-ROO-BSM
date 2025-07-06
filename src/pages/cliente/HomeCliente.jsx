import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CerrarSesion from "../../components/CerrarSesion";

export default function HomeCliente() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  return (
    <div className="mt-4 px-3">
      <h1>¡Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ""}!</h1>

      {/* Aquí puedes agregar tarjetas, resumen de pedidos, botones, etc. */}
    </div>
  );
}
