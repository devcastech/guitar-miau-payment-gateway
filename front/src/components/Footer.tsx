
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">
              © {currentYear} Guitar Miau. Todos los derechos reservados.
            </span>
          </div>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            Pago seguro con cifrado SSL. Aceptamos todas las tarjetas de crédito
            y débito.
          </p>
        </div>
      </div>
    </footer>
  );
};

