import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CadastroConcluido: React.FC = () => {
  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto p-8 text-center min-h-screen bg-gray-50 flex flex-col justify-center">
        <h1 className="text-3xl font-semibold mb-4">Seja bem-vindo ao Direto no Ponto!</h1>
        <p className="text-lg mb-4">
          <strong>Parabéns, você é o mais novo aluno do Direto no Ponto!</strong>
        </p>
        <p className="text-lg mb-2">
          Para completar o seu cadastro, falta apenas <strong>ativar a sua conta</strong> através do e-mail
          que você receberá nos próximos minutos.
        </p>
        <p className="text-lg mb-6">
          Se você não receber nada, é possível que a mensagem tenha caído na sua <strong>caixa de spam</strong>.
        </p>
        <p className="text-md text-gray-600">
          Estamos ansiosos para te ajudar na sua caminhada até a aprovação!
        </p>
      </div>

      <Footer />
    </>
  );
};

export default CadastroConcluido;
