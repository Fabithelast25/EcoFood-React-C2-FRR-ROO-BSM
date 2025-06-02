import { useAuth } from "../../../context/AuthContext";
import CerrarSesion from "../../CerrarSesion";
import { Link } from "react-router-dom";

export default function NavEmpresa() {
    const { userData } = useAuth();
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Ecofood {userData.nombre}</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bstarget="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle
                navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/empresa/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                    <span className="navbar-text">
                        <CerrarSesion />
                    </span>
                </div>
            </div>
        </nav>
    );
}
