import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useSearch } from '@/context/SearchContext';

interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

const Footer = () => {

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    setSearchTerm(categoryName);
    navigate('/materiais/resumos');
  }

  useEffect(() => {
    api.get('/categorias/?destaque_rodape=true')
      .then(response => {
        setCategorias(response.data.slice(0, 6));
      })
      .catch(error => console.error("Erro ao buscar categorias para o footer:", error));
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link to="/">
              <img src="/logo+nome.png" alt="Direto No Ponto" className="w-48 h-auto" />
            </Link>
            <p className="text-gray-400 text-sm">
              Resumos e materiais de estudo direto ao ponto para otimizar seu aprendizado 
              e conquistar seus objetivos acadêmicos.
            </p>
            <p className="text-gray-400 text-sm">
              CNPJ: 59.662.477/0001-85 | DFL ENSINO
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/materiais/resumos" className="text-gray-400 hover:text-white transition-colors">Resumos</Link></li>
              <li><Link to="/materiais/combos" className="text-gray-400 hover:text-white transition-colors">Combos</Link></li>
              <li><Link to="/area-do-aluno" className="text-gray-400 hover:text-white transition-colors">Área do Aluno</Link></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.nome)}
                    className="text-gray-400 hover:text-white transition-colors text-left w-full"
                  >
                    {cat.nome}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Rua Visconde de Pirajá, 414, Sala 718 - Rio de Janeiro, RJ</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">(21) 96406-0760</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">dflensinoltda@gmail.com</span>
              </li>
            </ul>
            {/*
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Assine nossa newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-md transition-colors">
                  Enviar
                </button>
              </div>
            </div>
            */}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Direto No Ponto. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link to="#" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
