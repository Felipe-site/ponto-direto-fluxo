import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import api from "@/services/api";

const AtivarConta = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [reenviado, setReenviado] = useState(false);
  const [erro, setErro] = useState("");

  const handleReenviar = async () => {
    try {
      await api.post("/reenviar-confirmacao/", { email });
      setReenviado(true);
      setErro("");
    } catch {
      setErro("Erro ao reenviar o e-mail. Tente novamente.");
      setReenviado(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-2xl text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-4">Sua conta ainda não foi ativada!</h1>
          <p className="text-lg mb-2">
            Para acessar o site, é necessário ativar sua conta pelo link enviado para seu e-mail.
          </p>
          <p className="text-md mb-6">
            Se você não recebeu o e-mail ou ele expirou, clique no botão abaixo para reenviar.
          </p>

          {email && (
            <button
              onClick={handleReenviar}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded"
            >
              REENVIAR E-MAIL DE ATIVAÇÃO
            </button>
          )}

          {!email && (
            <p className="text-red-600 mt-4">
              Endereço de e-mail não encontrado. Tente fazer login novamente.
            </p>
          )}

          {reenviado && (
            <p className="mt-4 text-green-600 font-medium">
              Um novo e-mail de ativação foi enviado!
            </p>
          )}
          {erro && (
            <p className="mt-4 text-red-600 font-medium">
              {erro}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AtivarConta;
