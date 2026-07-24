import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

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

const PoliticaPrivacidad = () => {
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
          <ShieldCheck size={22} className="text-[#E8B04B]" />
          <h1 className="text-white font-black text-2xl sm:text-3xl uppercase tracking-wide">
            Política de Privacidad
          </h1>
        </div>
        <p className="text-white/30 text-xs mb-10">
          Última actualización: {new Date().getFullYear()}
        </p>

        <Seccion titulo="Introducción">
          La presente Política de Privacidad establece los términos en que Pelis Club usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.
        </Seccion>

        <Seccion titulo="Información que es recogida">
          Nuestro sitio web podrá recoger información personal por ejemplo: nombre, información de contacto como su dirección de correo electrónico e información demográfica. Así mismo, cuando sea necesario, podrá ser requerida información específica para procesar algún pedido, gestionar una suscripción o realizar una facturación.
        </Seccion>

        <Seccion titulo="Uso de la información recogida">
          Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de suscripciones o pedidos en caso que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con novedades, estrenos y otra información que consideremos relevante para usted o que pueda brindarle algún beneficio; estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.
          <br /><br />
          Pelis Club está altamente comprometido con mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos de que no exista ningún acceso no autorizado.
        </Seccion>

        <Seccion titulo="Cookies">
          Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador; al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado.
          <br /><br />
          Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Si se declinan, es posible que no pueda utilizar algunos de nuestros servicios.
        </Seccion>

        <Seccion titulo="Enlaces a Terceros">
          Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted dé clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre el sitio al que es redirigido y por lo tanto no somos responsables de los términos, la privacidad ni la protección de sus datos en esos sitios terceros.
        </Seccion>

        <Seccion titulo="Control de su información personal">
          En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web. Cada vez que se le solicite rellenar un formulario, como el de registro de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico.
          <br /><br />
          Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por una autoridad judicial competente.
        </Seccion>

        <Seccion titulo="Cambios">
          Pelis Club se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.
        </Seccion>

      </div>
    </div>
  );
};

export default PoliticaPrivacidad;