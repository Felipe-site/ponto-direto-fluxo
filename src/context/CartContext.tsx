import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Produto } from "@/types/produto";
import api from "@/services/api"; // Importamos o 'api' para fazer a chamada

interface CartItem extends Produto {
  quantidade: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Produto) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getQuantity: () => number;
  incrementar: (id: number) => void;
  decrementar: (id: number) => void;

  // O estado do cupom e os totais continuam aqui
  cupom: any;
  subtotal: number;
  valorDesconto: number;
  totalFinal: number;

  // Expondo a nova função para aplicar o cupom
  aplicarCupom: (codigo: string) => Promise<any>;
  removerCupom: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("diretoNoPontoCartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cupom, setCupom] = useState<any>(() => {
    const savedCupom = localStorage.getItem("diretoNoPontoCartCupom");
    return savedCupom ? JSON.parse(savedCupom) : null;
  });

  useEffect(() => {
    localStorage.setItem("diretoNoPontoCartItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (cupom) {
      localStorage.setItem("diretoNoPontoCartCupom", JSON.stringify(cupom));
    } else {
      localStorage.removeItem("diretoNoPontoCartCupom");
    }
  }, [cupom]);

  const aplicarCupom = async (codigo: string) => {
    const res = await api.post("/verificar-cupom/", {
      codigo: codigo,
      total: subtotal,
    });
    
    if (res.data.valido) {
      setCupom(res.data); 
      return res.data;
    } else {
      setCupom(null); 
      throw new Error(res.data.erro || "Cupom inválido ou não aplicável.");
    }
  };

  const addToCart = (produto: Produto) => {
    setItems((prev) => {
      const existente = prev.find((item) => item.id === produto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prev, { ...produto, quantidade: 1 }];
      }
    });
  };

  const incrementar = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const decrementar = (id: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCupom(null); 
  };

  const removerCupom = () => {
    setCupom(null);
  };

  const getQuantity = () =>
    items.reduce((acc, item) => acc + item.quantidade, 0);


  const subtotal = items.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0);
  const valorDesconto = cupom?.desconto || 0;
  const totalFinal = subtotal > valorDesconto ? subtotal - valorDesconto : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getQuantity,
        incrementar,
        decrementar,
        cupom,
        subtotal,
        valorDesconto,
        totalFinal,
        aplicarCupom,
        removerCupom,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
};