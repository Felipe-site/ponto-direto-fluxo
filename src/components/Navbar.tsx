import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown, User } from 'lucide-react';
import SearchBar from './SearchBar.tsx';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCart } from '@/context/CartContext';
import { CartDrawer } from './cart/CartDrawer';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getQuantity } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileMaterialsOpen, setIsMobileMaterialsOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Container principal com altura aumentada */}
        <div className="flex items-center justify-between h-20">
          
          {/* Bloco da Esquerda: Logo Grande */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/logo+nome.png" alt="Direto No Ponto" className="w-[180px] h-auto" />
            </Link>
          </div>

          {/* Bloco da Direita: Itens de Navegação Centralizados (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-6">
            <SearchBar />
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-gabarito">
                    Materiais
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 p-2">
                      <li>
                        <Link
                          to="/materiais/resumos"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Resumos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/materiais/combos"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Combos
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/area-do-aluno" className="text-gray-600 hover:text-gabarito flex items-center">
              <User className="h-5 w-5 mr-1" />
              <span>Área de Alunos</span>
            </Link>

            <button onClick={() => setIsDrawerOpen(true)} className='relative'>
              <ShoppingCart className="w-6 h-6" />
              {getQuantity() > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {getQuantity()}
                </span>
              )}
            </button>
          </div>

          {/* Botão do Menu Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsDrawerOpen(true)} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {getQuantity() > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {getQuantity()}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile (código permanece o mesmo) */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <div className="px-3 py-2">
              <SearchBar />
            </div>
            <Link 
              to="/area-do-aluno" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gabarito hover:bg-gray-100"
            >
              Área de Alunos
            </Link>

            <div>
              <button
                onClick={() => setIsMobileMaterialsOpen(!isMobileMaterialsOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gabarito hover:bg-gray-100"
              >
                <span>Materiais</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMobileMaterialsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileMaterialsOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <Link to="/materiais/resumos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gabarito hover:bg-gray-100">
                    Resumos
                  </Link>
                  <Link to="/materiais/combos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gabarito hover:bg-gray-100">
                    Combos
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}


      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </nav>
  );
};

export default Navbar;