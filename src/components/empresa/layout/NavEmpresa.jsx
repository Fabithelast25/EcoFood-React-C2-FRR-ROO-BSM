// src/components/empresa/layout/NavEmpresa.jsx
import { NavLink } from "react-router-dom";

export default function NavEmpresa() {
  return (
    <nav className="sidebar bg-dark text-white p-3">
      <h4 className="text-white mb-4">ECOFOOD</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/empresa/dashboard" className="nav-link text-white">Inicio</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/empresa/producto" className="nav-link text-white">Productos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/empresa/pedidos" className="nav-link text-white">Pedidos</NavLink>
        </li>
      </ul>
    </nav>
  );
}
