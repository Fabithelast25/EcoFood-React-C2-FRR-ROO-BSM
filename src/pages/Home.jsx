import CerrarSesion from "../components/CerrarSesion"; 
import CardProducto from '../components/CardProducto';

export default function Home() {
 return (
    <div className="container mt-4">
        <h1>Productos Disponibles</h1>
        <CardProducto nombre="Pan Integral" precio="$500" />
        <CerrarSesion /> 
    </div>
 );
}
