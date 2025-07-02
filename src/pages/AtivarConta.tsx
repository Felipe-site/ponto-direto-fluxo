import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useState, useEffect } from "react";
import api from "@/services/api.ts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type StatusPagina = 'ativando' | 'sucesso' | 'erro' | 'reenviar';

const AtivarConta = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const initialState: StatusPagina = uid && token ? 'ativando' : 'reenviar';
  const [status, setStatus] = useState<StatusPagina>(initialState);

  const [message, setMessage] = useState('Ativando sua conta, por favor, aguarde...');

  const emailParaReenvio = location.state?.email || "";

  useEffect(() => {
    if (uid && token) {
      const ativarContaApi = async () => {
        try {
          await api.get(`/activate/${uid}/${token}/`);
          setStatus('sucesso');
          setMessage('Sua conta foi ativada com sucesso! Você será redirecionado para a página de login.');
          toast.success("Conta ativada com sucesso!");
          setTimeout(() => navigate('/login'), 5000);
        } catch (error) {
          console.error("Erro na ativação: ", error);
          setStatus('erro');
          setMessage('Este link de ativação é inválido ou já expirou. Tente reenviar o e-mail de ativação.');
        }
      };
      ativarContaApi();
    } else {
      setStatus('reenviar');
    }
  }, [uid, token, navigate]);

  const handleReenviar = async () => {
    if (!emailParaReenvio) {
      toast.error("Endereço de e-mail não encontrado. Tente fazer login novamente para ser redirecionado.");
      return;
    }
    try {
      await api.post("api/reenviar-confirmacao/", { email: emailParaReenvio });
      toast.success("Um novo e-mail de ativação foi enviado para você!");
    } catch {
      toast.error("Erro ao reenviar o e-mail. Tente novamente mais tarde.");
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'ativando':
        return <p className="text-xl text-gray-700">{message}</p>;

      case 'sucesso':
        return <p className="text-xl text-green-600">{message}</p>;

      case 'erro':
        return (
          <div>
            <p className="text-xl text-red-500">{message}</p>
            <Link to="/login" className="mt-4 inline-block text-sky-500 hover:underline">
              Ir para a página de Login
            </Link>
          </div>
        );

      case 'reenviar':
        return (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-4">Sua conta ainda não foi ativada!</h1>
            <p className="text-lg mb-6">Para acessar o site, é necessário ativar sua conta pelo link enviado para seu e-mail.</p>
            {emailParaReenvio ? (
              <Button onClick={handleReenviar} className="bg-sky-500 hover:bg-sky-600">
                REENVIAR E-MAIL DE ATIVAÇÃO
              </Button>
            ) : (
              <p className="text-md text-gray-600">
                Se o e-mail não chegou ou expirou, tente fazer login novamente para receber a opção de reenviar.
              </p>
            )}
          </>
        );
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 max-w-2xl">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AtivarConta;
