import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home"
import ProtectedRoute from './ProtectedRoute'
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from './ProtectedByRole';


//Admin
import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAdministradores from "../pages/admin/AdminAdministradores";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar-password" element={<RecuperarContraseña />} />
            <Route path="/home" element={ 
                <ProtectedRoute> 
                    <Home /> 
                </ProtectedRoute> 
        }/>
        
            <Route path="/admin" element={
                <ProtectedByRole allowed={["admin"]}>
                    <AdminLayout/>
                </ProtectedByRole>
        }>
                <Route path="dashboard" element={<AdminDashboard/>} />
                <Route path="administradores" element={<AdminAdministradores/>} />
            </Route>
        </Routes>
    );
}