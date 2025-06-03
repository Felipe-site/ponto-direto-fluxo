import { useCart } from "@/context/CartContext";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: Props) => {
  const { items, removeFromCart, incrementar, decrementar } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

  return (
  <div
    className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl z-50 transform transition-transform ${
      isOpen ? "translate-x-0" : "translate-x-full"
    } flex flex-col`}
  >
    {/* Cabeçalho */}
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-bold">Carrinho</h2>
      <button onClick={onClose}>
        <X />
      </button>
    </div>

    {/* Lista de itens */}
    <div className="p-4 flex-1 overflow-y-auto">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 mb-4">
            <img src={item.imagem} className="w-16 h-16 rounded object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.titulo}</p>
              <p className="text-sm text-gray-600">Preço: R$ {Number(item.preco).toFixed(2)}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => decrementar(item.id)}
                  className="px-2 bg-gray-200 text-black rounded"
                >
                  −
                </button>
                <span>{item.quantidade}</span>
                <button
                  onClick={() => incrementar(item.id)}
                  className="px-2 bg-gray-200 text-black rounded"
                >
                  +
                </button>
              </div>

              <p className="mt-2 text-sm font-semibold">
                Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
              </p>
            </div>

            <button onClick={() => removeFromCart(item.id)} className="text-red-500">
              <X />
            </button>
          </div>
        ))
      )}
    </div>

    {/* Rodapé fixo */}
    <div className="p-4 border-t bg-white">
      <div className="flex justify-between mb-4 font-semibold">
        <span>Subtotal:</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>
      <Link to="/carrinho">
        <button className="bg-gray-600 text-white px-4 py-3 rounded w-full font-bold mb-2">
          Ver carrinho
        </button>
      </Link>
      <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
        Finalizar compra
      </button>
    </div>
  </div>
);

};
