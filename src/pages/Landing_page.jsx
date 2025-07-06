import "../components/estilosCSS/landing_page.css"
import { Link } from "react-router-dom";
import { useState } from "react";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <div id="background">
      {/* NAVBAR SUPERIOR */}
      <nav className="navbar navbar-expand-md">
        <div className="container-fluid">
          <Link className="navbar-brand fs-3 fw-bold" to="/">
            EcoFood
            <img src="/img/logo.png" alt="Logo EcoFood" className="d-inline-block rounded-5 ms-2" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse justify-content-end text-center ${isOpen ? "show" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-md-0">
              <li className="nav-item d-flex">
                <a className="nav-link" href="#QuienesSomos">Quienes somos</a>
                <a className="nav-link" href="#Mision">Nuestra Mision</a>
                <a className="nav-link" href="#Vision">Nuestra Vision</a>
                <a className="nav-link" href="#Problematica">Problemas</a>
                <a className="nav-link" href="#Solucion">Nuestra Solución</a>
                <Link className="nav-link botonInicio" to="/login">Iniciar sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container-xxl mt-0">
        <div className="container-fluid">
          <h1 className="display-4 mt-4 fw-bold">
            Desperdicio alimentario y como hacerle frente
          </h1>
          <p id="descripcion" className="fs-5">
            lograr reducir solamente el 25% del desperdicio alimentario global podría alimentar a más de 870 millones de personas.
          </p>
          <img id="imagenTitulo" src="/img/Imagen titulo.png" alt="Foto del desperdicio alimentario" />
          <p className="mt-4 fs-5">
            El informe de la FAO sobre pérdidas y desperdicio de alimentos a nivel global, estima que un tercio de los alimentos destinados al consumo humano se pierden o desperdician anualmente, lo que equivale a 1.300 millones de toneladas. En países con ingresos altos, la mayor parte del desperdicio ocurre en el consumo final, mientras que en países de ingresos bajos, las pérdidas se dan principalmente en las primeras etapas de la cadena alimentaria debido a limitaciones en infraestructura y tecnología. El estudio subraya la necesidad de mejorar las infraestructuras, especialmente en los países en desarrollo, y  cambiar el comportamiento del consumidor en los países industrializados para reducir el desperdicio.
          </p>
        </div>

        {/* QUIÉNES SOMOS */}
        <div className="container-fluid" id="QuienesSomos">
          <h1 className="text-center">
            EcoFood
          </h1>
          <div className="d-flex mt-4">
            <img id="imagenSomos" src="/img/EcoFood imagen 1.png" className="img-fluid " alt="Imagen acompañamiento" />
            <div className="m-auto ms-4">
              <h2>Quiénes somos</h2>
              <p>
                EcoFood es una organización comprometida con la reducción del desperdicio alimentario mediante iniciativas educativas, tecnológicas y prácticas cotidianas. Nuestro propósito es promover un mundo más justo y sostenible, empoderando a las personas y comunidades para optimizar el uso de alimentos, minimizar residuos y proteger nuestro planeta. Somos un equipo diverso formado por expertos en medio ambiente, tecnología y desarrollo comunitario, unidos por un propósito común: generar conciencia, educar y activar soluciones para enfrentar este desafío global.
              </p>
            </div>
          </div>

          {/* MISIÓN */}
          <div className="d-flex mt-4" id="Mision">
            <div className="m-auto">
              <h2>Nuestra misión</h2>
              <p>
                Nuestra misión es sensibilizar y movilizar a las comunidades locales y globales sobre la importancia de reducir el desperdicio de alimentos, brindando herramientas prácticas, educativas y tecnológicas que permitan a las personas adoptar hábitos sostenibles y responsables para mejorar la seguridad alimentaria y proteger el medio ambiente.
              </p>
            </div>
            <img id="imagenMision" src="/img/EcoFood imagen 2.png" alt="Imagen misión" />
          </div>

          {/* VISIÓN */}
          <div className="d-flex" id="Vision">
            <img id="imagenVision" src="/img/EcoFood imagen 3.png" alt="Imagen visión" />
            <div className="m-auto ms-4">
              <h2>Nuestra visión</h2>
              <p>
                Nuestra visión es un mundo en el cual los alimentos se valoren y aprovechen responsablemente, en donde la seguridad alimentaria esté garantizada para todos y el desperdicio alimentario sea mínimo, generando un impacto positivo significativo en el medio ambiente, la economía y la sociedad.
              </p>
            </div>
          </div>
        </div>

        {/* PROBLEMÁTICAS */}
        <div className="container-fluid mt-5" id="Problematica">
          <h2 className="text-center">
            Problemáticas a enfrentar
          </h2>
          <div className="d-flex mt-4">
            <div className="m-auto">
              <ul className="fs-5">
                <li>1/3 de los alimentos producidos globalmente se desperdician.</li>
                <li>El desperdicio alimentario genera el 8-10% de las emisiones de gases de efecto invernadero.</li>
                <li>Más de 820 millones de personas sufren inseguridad alimentaria.</li>
                <li>Reducir el 25% del desperdicio podría alimentar a 870 millones de personas.</li>
              </ul>
            </div>
            <img id="imagenProblematica" src="/img/Problematica.png" className="img-fluid" alt="Imagen problemáticas" />
          </div>
        </div>

        {/* SOLUCIÓN */}
        <div className="container-fluid mt-5" id="Solucion" >
          <h2 className="text-center">¿Cómo lo solucionaremos?</h2>

          <div className="mt-5 d-flex">
            <img src="/img/flecha.png" alt="Flecha giratoria" className="w-50" />
            <ul className="w-50 m-auto">
              <li>
                <h2>Educamos:</h2>
                <p>Ofrecemos materiales educativos gratuitos y talleres comunitarios para fomentar prácticas sostenibles en el consumo de alimentos.</p>
              </li>
              <li>
                <h2>Conectamos</h2>
                <p>Promovemos alianzas entre productores, comerciantes, consumidores y comunidades para reducir excedentes y aprovechar al máximo los alimentos disponibles.</p>
              </li>
              <li>
                <h2>Innovamos</h2>
                Utilizamos la tecnología para desarrollar soluciones prácticas, como aplicaciones móviles, plataformas web y redes comunitarias que faciliten la reducción del desperdicio alimentario.
                <p></p>
              </li>
            </ul>
            
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <nav className="navbar navbar-expand-md">
        <div className="container-fluid">
          <Link className="navbar-brand fs-3 fw-bold" to="/">
            EcoFood
            <img src="/img/logo.png" alt="Logo EcoFood" className="d-inline-block rounded-5 ms-2" />
          </Link>
          <div id="BotonesNavegacion" className="justify-content-end navbar-nav mt-4">
            <ul>
              <li>Dirección: <a href="#">Calle Verde 123, Ciudad Sostenible</a></li>
              <li>Correo electrónico: <a href="#">contacto@ecofood.org</a></li>
              <li>Teléfono: <a href="#">+56 9 1234 5678</a></li>
            </ul>
            <ul>
              <li>Redes sociales:</li>
              <li>Facebook: <a href="#">EcoFoodOficial</a></li>
              <li>Instagram: <a href="#">@ecofood_oficial</a></li>
              <li>Twitter: <a href="#">@EcoFood_org</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
