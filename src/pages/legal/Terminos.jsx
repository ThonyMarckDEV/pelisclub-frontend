import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const Seccion = ({ titulo, children }) => (
  <div className="mb-8">
    <h2 className="text-white font-black text-sm uppercase tracking-wide mb-3">
      {titulo}
    </h2>
    <p className="text-white/50 text-sm leading-relaxed">
      {children}
    </p>
  </div>
);

const Terminos = () => {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#E8B04B] transition-colors text-xs font-semibold uppercase tracking-widest mb-10"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <FileText size={22} className="text-[#E8B04B]" />
          <h1 className="text-white font-black text-2xl sm:text-3xl uppercase tracking-wide">
            Términos y Condiciones
          </h1>
        </div>
        <p className="text-white/30 text-xs mb-10">
          Última actualización: {new Date().getFullYear()}
        </p>

        <Seccion titulo="Aceptación de los términos">
          Al acceder y utilizar Pelis Club, usted acepta cumplir con los presentes Términos y Condiciones, así como con nuestra Política de Privacidad. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar el sitio web ni sus servicios.
        </Seccion>

        <Seccion titulo="Descripción del servicio">
          Pelis Club es una plataforma de catálogo y streaming de contenido audiovisual. Nos reservamos el derecho de modificar, suspender o discontinuar, temporal o permanentemente, cualquier parte del servicio, con o sin previo aviso.
        </Seccion>

        <Seccion titulo="Registro de cuenta">
          Para acceder a ciertas funciones del sitio, es posible que se le solicite crear una cuenta. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta. Debe notificarnos de inmediato ante cualquier uso no autorizado de su cuenta.
        </Seccion>

        <Seccion titulo="Uso aceptable">
          Usted se compromete a utilizar Pelis Club únicamente con fines lícitos y de acuerdo con estos términos. Queda prohibido: 
          <br /><br />
          — Redistribuir, copiar o retransmitir el contenido del sitio sin autorización.
          <br />
          — Utilizar herramientas automatizadas para extraer datos o contenido del sitio (scraping).
          <br />
          — Intentar vulnerar la seguridad o el funcionamiento normal de la plataforma.
          <br />
          — Compartir su cuenta con fines comerciales no autorizados.
        </Seccion>

        <Seccion titulo="Propiedad intelectual">
          Todo el contenido disponible en Pelis Club, incluyendo pero no limitado a títulos, imágenes, logotipos, diseño e interfaz, está protegido por derechos de autor y demás leyes de propiedad intelectual. El acceso al contenido no otorga al usuario ningún derecho de propiedad sobre el mismo.
        </Seccion>

        <Seccion titulo="Suscripciones y pagos">
          En caso de que el servicio incluya planes de pago o suscripción, los precios, condiciones y métodos de cobro se indicarán claramente al momento de la contratación. Pelis Club se reserva el derecho de modificar los precios de sus planes, notificando a los usuarios con antelación razonable.
        </Seccion>

        <Seccion titulo="Limitación de responsabilidad">
          Pelis Club no garantiza que el servicio esté libre de interrupciones, errores o fallos técnicos. No nos hacemos responsables por daños directos o indirectos derivados del uso o la imposibilidad de uso del sitio, en la medida permitida por la legislación aplicable.
        </Seccion>

        <Seccion titulo="Enlaces a terceros">
          Nuestro sitio puede contener enlaces a sitios web de terceros. Pelis Club no controla ni se responsabiliza por el contenido, políticas o prácticas de dichos sitios.
        </Seccion>

        <Seccion titulo="Terminación">
          Nos reservamos el derecho de suspender o cancelar el acceso de un usuario al servicio, sin previo aviso, en caso de incumplimiento de estos Términos y Condiciones.
        </Seccion>

        <Seccion titulo="Modificaciones">
          Pelis Club se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor desde su publicación en esta página, por lo que se recomienda revisarla periódicamente.
        </Seccion>

        <Seccion titulo="Legislación aplicable">
          Estos Términos y Condiciones se rigen por las leyes aplicables en la jurisdicción donde opera Pelis Club, sin perjuicio de las normas de protección al consumidor que correspondan al usuario.
        </Seccion>

      </div>
    </div>
  );
};

export default Terminos;