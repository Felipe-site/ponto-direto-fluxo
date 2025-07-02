import { useCart } from "@/context/CartContext.tsx";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoginModal } from "@/components/LoginModal";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import api from "@/services/api.ts";
import { stat } from "fs";

const Spinner = () => (
  <div className="border-4 border-gray-200 border-t-blue-600 rounded-full w-12 h-12 animate-spin"></div>
)

type StatusPagamento = 'idle' | 'pending' | 'paid' | 'failed' | 'error';

export default function Checkout() {
  const { items, cupom, subtotal, valorDesconto, totalFinal, clearCart, aplicarCupom, removerCupom } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [statusPagamento, setStatusPagamento] = useState<StatusPagamento>('idle');
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState('');

  const [codigoCupom, setCodigoCupom] = useState(cupom?.codigo || "");
  const [erroCupom, setErroCupom] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && statusPagamento === 'idle') {
      navigate("/carrinho");
    }
  }, [items, navigate, statusPagamento]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth"});
  }, [])

  const handleAplicarCupom = async () => {
    setErroCupom(null);
    try {
      await aplicarCupom(codigoCupom);
    } catch (e: any) {
      setErroCupom(e.message || "Erro ao validar cupom.");
    }
  };

  const iniciarPagamento = async () => {
    
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setStatusPagamento('pending');
    setMensagem('Preparando seu pagamento, um momento...');

    try {
      const token = localStorage.getItem("token");

      const response = await api.post("/checkout-link/", {
        itens: items.map((item) => ({
          produto: item.id,
          quantidade: item.quantidade,
        })),
        subtotal,
        desconto: valorDesconto,
        total: totalFinal,
        cupom: cupom?.id || null,
      });

      setPedidoId(response.data.pedido_id);

      window.open(response.data.url, '_blank');

      setMensagem('Aguardando a confirmação do pagamento. Pode levar alguns instantes...');
    
    } catch (error: any) {
      console.error("Erro ao criar link de pagamento:", error);
      setStatusPagamento('error');
      if (error.response?.status === 401) {
        setMensagem('Você precisa estar logado para comprar. Redirecionando...')
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMensagem('Ocorreu um erro ao iniciar o pagamento. Tente novamente.');
      }
    }
  };
  
  {/*Efeito - Verificar o status (polling)*/}
  useEffect(() => {
    if (statusPagamento !== 'pending' || !pedidoId) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await api.get(`/pedidos/${pedidoId}/status/`);
        const novoStatus = response.data.status;

        if (novoStatus === 'pago') {
          setStatusPagamento('paid');
          clearInterval(intervalId);
        } else if (novoStatus === 'falhou' || novoStatus === 'cancelado') {
          setStatusPagamento('failed');
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [statusPagamento, pedidoId]);

  {/*Efeito para redirecionar o usuário*/}
  useEffect(() => {
    if (statusPagamento === 'paid') {
      setMensagem('Pagamento aprovado! Redirecionando para seus materiais...');
      clearCart();
      setTimeout(() => {
        navigate('/area-do-aluno');
      }, 3000);
    }

    if (statusPagamento === 'failed') {
      setMensagem('Pagamento falhou ou foi cancelado. Você será redirecionado em breve.');
      setTimeout(() => {
        navigate('/');
      }, 4000);
    }
  }, [statusPagamento, navigate, clearCart]);

  return (
    <>
      <Navbar />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <div className="max-w-5xl mx-auto p-4 py-10">
        <h1 className="text-3xl font-bold mb-5 pt-20">Finalizar Compra</h1>
      
      {statusPagamento === 'idle' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border p-4 rounded shadow-sm">
                <div>
                  <p className="font-semibold">{item.titulo}</p>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantidade}</p>
                </div>
                <div className="font-bold">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border p-6 rounded shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            {cupom && (
              <div className="flex justify-between text-green-600 text-sm">
                <span>
                  Cupom: {cupom.codigo}
                </span>
                <div className="flex items-center">
                  <span>-R$ {valorDesconto.toFixed(2)}</span>
                  <button
                      onClick={removerCupom}
                      className="ml-2 text-red-500 hover:text-red-700 font-bold"
                      title="Remover cupom"
                    >
                      [x]
                  </button>
                </div>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {totalFinal.toFixed(2)}</span>
            </div>

            <div className="pt-4 flex-grow">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigoCupom}
                  onChange={(e) => setCodigoCupom(e.target.value)}
                  placeholder="Código Cupom"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={handleAplicarCupom}
                  className="bg-gray-800 text-white px-2 rounded"
                >
                  Aplicar
                </button>
              </div>
              {erroCupom && (
                <p className="text-red-600 text-sm mt-1">{erroCupom}</p>
              )}
            </div>

            <button
              onClick={iniciarPagamento}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Pagar com Pagar.me
            </button>
          </div>
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center bg-gray-50 p-10 rounded-lg">
            <Spinner />
            <h2 className="text-2xl font-semibold mt-6 text-gray-800">{mensagem}</h2>
            {statusPagamento === 'pending' && <p className="text-gray-600 mt-2">Você pode fechar a aba quando o pagamento terminar. Nós te avisaremos aqui.</p>}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
