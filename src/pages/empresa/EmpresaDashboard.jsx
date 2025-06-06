import { Link } from "react-router-dom";

export default function EmpresaDashboard() {
    return (
        <div style={{ padding: "2rem" }}>
        <h2>Panel de Empresa</h2>
        <Link to="/empresa/perfil">
            <button>Ir a Perfil Empresarial</button>
        </Link>
        </div>
    );
}
