import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Checkout() {
  const { items, cupom, subtotal, valorDesconto, totalFinal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/carrinho");
    }
  }, [items]);

  const finalizarPedido = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/api/pedidos/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                itens: items.map((item) => ({
                    produto: item.id,
                    quantidade: item.quantidade,
                })),
                subtotal,
                desconto: valorDesconto,
                total: totalFinal,
                cupom: cupom?.id || null,
            }),
        });

        if (response.ok) {
            alert("Pedido realizado com sucesso!");
            clearCart();
        } else {
            alert("Erro ao finalizar pedido.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro inesperado ao finalizar pedido.");    
    }
};

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

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
                <span>Cupom: {cupom.codigo}</span>
                <span>-R$ {valorDesconto.toFixed(2)}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {totalFinal.toFixed(2)}</span>
            </div>
            <button
              onClick={finalizarPedido}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
