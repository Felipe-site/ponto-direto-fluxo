import { useCart } from "@/context/CartContext.tsx";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

export default function Carrinho() {
  const navigate = useNavigate();
  const { items, removeFromCart, incrementar, decrementar, subtotal, cupom, valorDesconto, totalFinal, aplicarCupom, removerCupom } = useCart();
  const [codigoCupom, setCodigoCupom] = useState("");
  const [erroCupom, setErroCupom] = useState<string | null>(null);

  const handleAplicarCupom = async () => {
    setErroCupom(null);
    try {
      await aplicarCupom(codigoCupom);
    } catch (e: any) {
      setErroCupom(e.message || "Erro ao validar cupom.")
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth"});
  }, [])

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 min-h-[100vh]">
        <h1 className="text-3xl font-bold mb-6 text-center pt-20">Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda: Produtos */}
          <div className="lg:col-span-2 space-y-6">
            {items.length === 0 ? (
              <p className="text-gray-500">Seu carrinho está vazio.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border p-4 rounded shadow-sm"
                >
                  <img src={item.imagem} className="w-20 h-20 object-cover rounded" />
                  <div className="ml-4 flex-1">
                    <p className="font-bold text-red-600">{item.titulo}</p>
                    <p className="text-sm text-gray-700">Preço unitário: R$ {Number(item.preco).toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decrementar(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        −
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        onClick={() => incrementar(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-medium mt-2">
                      Subtotal: R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remover
                  </button>
                </div>
              ))
            )}

            {/* Campo de cupom */}
            {items.length > 0 && (
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
                  className="bg-gray-800 text-white px-4 rounded"
                >
                  Aplicar Cupom
                </button>
              </div>
            )}
            {erroCupom && (
              <p className="text-red-600 text-sm mt-1">{erroCupom}</p>
            )}
          </div>

          {/* Coluna direita: Totais */}
          <div className="border p-6 rounded shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Total</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            {cupom && (
              <div className="flex justify-between text-green-600 text-sm">
                <span>
                  Cupom aplicado: {cupom.codigo}{" "}
                  ({cupom.tipo === "percentual"
                    ? `${cupom.valor}%`
                    : `R$ ${cupom.valor}`})
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

            <button onClick={() => navigate("/checkout")} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
