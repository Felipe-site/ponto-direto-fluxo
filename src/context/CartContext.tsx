import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Produto } from "@/types/produto.ts";
import api from "@/services/api.ts";
import { toast } from "sonner";

interface Cupom {
  id: number;
  codigo: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
  desconto: number;
  produtos_elegiveis: number[];
}

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

  cupom: any;
  subtotal: number;
  valorDesconto: number;
  totalFinal: number;

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
    const product_ids = items.map(item => item.id);
    const itensParaApi = items.map(item => ({produto: item.id, quantidade: item.quantidade}));

    try {
      const res = await api.post("/verificar-cupom/", {
        codigo: codigo,
        subtotal: subtotal,
        product_ids: product_ids,
        itens: itensParaApi, 
      });
      
      if (res.data.valido) {
        setCupom(res.data); 
        return res.data;
      } else {
        setCupom(null); 
        throw new Error(res.data.erro || "Cupom inválido ou não aplicável.");
      }
    } catch (e: any) {
      setCupom(null);
      throw e;
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

  const revalidarCupom = (cupomAtual: Cupom | null, novosItens: CartItem[]) => {
    if (!cupomAtual || !cupomAtual.produtos_elegiveis || cupomAtual.produtos_elegiveis.length === 0) {
      return;
    }

    const idsNoCarrinho = new Set(novosItens.map(item => item.id));
    const aindaValido = cupomAtual.produtos_elegiveis.some(id_elegivel => idsNoCarrinho.has(id_elegivel));

    if (!aindaValido) {
      setCupom(null);
      toast.info("O cupom foi removido, pois o produto elegível foi retirado do carrinho.");
    }
  };

  const decrementar = (id: number) => {
    setItems((prevItens) => {
      const novosItens = prevItens
        .map((item) => 
          item.id === id ? { ...item, quantidade: item.quantidade - 1}: item
        )
        .filter((item) => item.quantidade > 0);

      revalidarCupom(cupom, novosItens);

      return novosItens;
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prevItens) => {
      const novosItens = prevItens.filter((item) => item.id !== id);
      revalidarCupom(cupom, novosItens);
      return novosItens;
    });
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