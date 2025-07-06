// src/components/cliente/layout/NavCliente.jsx
import { NavLink } from "react-router-dom";

export default function NavCliente() {
  return (
    <nav className="sidebar bg-dark text-white p-3">
      <h4 className="text-white mb-4">ECOFOOD</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/cliente" className="nav-link text-white">Inicio</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cliente/productos" className="nav-link text-white">Productos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cliente/pedidos" className="nav-link text-white">Mis Pedidos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cliente/contacto" className="nav-link text-white">Contacto</NavLink>
        </li>
      </ul>
    </nav>
  );
}
