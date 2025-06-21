import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/services/api.ts';
import Navbar from '@/components/Navbar.tsx';
import Footer from '@/components/Footer.tsx';

export default function RedefinirSenha() {
  // Pega os parâmetros 'uid' e 'token' da URL
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    new_password1: '',
    new_password2: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpa o erro quando o usuário começa a digitar novamente
  useEffect(() => {
    if (error) setError('');
  }, [formData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.new_password1.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      setLoading(false);
      return;
    }

    if (formData.new_password1 !== formData.new_password2) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      await api.post('auth/password/reset/confirm/', {
        uid,
        token,
        new_password1: formData.new_password1,
        new_password2: formData.new_password2,
      });

      setSuccess('Senha redefinida com sucesso! Você será redirecionado para a página de login em 5 segundos.');
      
      // Redireciona para o login após 5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (err: any) {
      // Tenta pegar uma mensagem de erro específica da API, senão usa uma genérica
      const apiError = err.response?.data?.token?.[0] || err.response?.data?.detail;
      setError(apiError || 'Link inválido ou expirado. Por favor, solicite um novo link de redefinição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          
          {success ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sucesso!</h2>
              <p className="text-green-600">{success}</p>
              <Link to="/login" className="mt-6 inline-block text-blue-600 hover:underline">
                Ir para o Login agora
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crie uma Nova Senha</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="new_password1" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="new_password1"
                    name="new_password1"
                    value={formData.new_password1}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label 
                    htmlFor="new_password2" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirme a Nova Senha
                  </label>
                  <input
                    type="password"
                    id="new_password2"
                    name="new_password2"
                    value={formData.new_password2}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Salvando...' : 'Redefinir Senha'}
                </button>
              </form>
              <div className="text-center mt-4">
                <Link to="/esqueci-minha-senha" className="text-sm text-gray-600 hover:underline">
                    Seu link não funciona? Tente novamente.
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}