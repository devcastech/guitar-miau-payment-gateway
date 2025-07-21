import { Menu, X, Home, Info, Phone } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <NavLink to="/" onClick={closeMenu}>
              <img
                src="/guitar-logo.png"
                alt="Guitar Store"
                className="h-16 md:h-20 w-auto"
              />
            </NavLink>
            <h1 className="font-bold">Guitar Miau</h1>
          </div>

          <div className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <NavLink
                  className="flex items-center gap-2 text-gray-700 hover:gray-800 font-medium transition-colors hover:underline duration-200"
                  to="/"
                >
                  Guitarras
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-slate-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <NavLink
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-slate-800 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                <Home size={20} />
                Inicio
              </NavLink>
              <NavLink
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-slate-800 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                <Info size={20} />
                Guitarras
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
