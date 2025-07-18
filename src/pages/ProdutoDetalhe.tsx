
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ShoppingCart, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api.ts";
import { ProdutoDetalhado } from "@/types/produto.ts";
import { useCart } from "@/context/CartContext.tsx";
import { useRef } from "react";
import { ProdutoCard } from "@/components/produtos/ProdutoCard";

const ProdutoDetalhe = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const amostraRef = useRef<HTMLDivElement | null>(null);
  
  const { data: produto, isLoading, error } = useQuery({
    queryKey: ['produto', slug],
    queryFn: async () => {
      // Agora buscamos pelo slug em vez de ID
      const response = await api.get(`/produtos/${slug}/`);
      return response.data as ProdutoDetalhado;
    }
  });

  const comprarAgora = () => {
    if (produto) {
      addToCart(produto);
      toast.success("Produto adicionado ao carrinho! Redirecionando para o checkout...");
      setTimeout(() => {
        navigate("/checkout");
      }, 1000);
    }
  }

  const adicionarAoCarrinho = () => {
    if (produto) {
      addToCart(produto);
      toast.success(`${produto.titulo} adicionado ao carrinho`);
    }
  };

  const verAmostra = () => {
    if (amostraRef.current) {
      amostraRef.current.scrollIntoView({ behavior: "smooth"});
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Carregando detalhes do produto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500">Erro ao carregar o produto.</p>
            <p className="mt-2">Produto não encontrado ou erro na comunicação com o servidor.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = [
    "Material Assertivo: Elaborado com as últimas novidades legislativas, jurisprudências e assuntos exigidos em provas.",
    "Material Digital: Não se limite a sua mesa de estudos! Estude do seu jeito, em qualquer lugar e a qualquer hora.",
    "Atualização por 12 meses: Durante 12 meses você terá acesso às atualizações sem gastar mais nenhum real."
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <h1 className="text-3xl font-bold mb-8">{produto.titulo}</h1>
          
          {/* Banner promocional */}
          <div className="bg-green-400 p-6 rounded-lg mb-8 flex justify-between items-center">
            <div className="text-white font-bold text-xl">Aproveite o preço com desconto!</div>
            <Button 
              onClick={comprarAgora}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Comprar agora
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da esquerda com imagem */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-center h-full">
              <Card className="overflow-hidden">
                {produto.imagem ? (
                  <div className="aspect-[3/4] w-full bg-white flex items-center justify-center">
                    <img 
                      src={produto.imagem?.startsWith("http") ? produto.imagem : `http://localhost:8000${produto.imagem}`}
                      alt={produto.titulo}
                      className="object-contain h-full w-full"
                      onError={(e) => {e.currentTarget.src;}}
                    />
                  </div>
                ) : (
                  <div className="bg-slate-800 text-white w-full h-full flex flex-col justify-center items-center rounded">
                    <h2 className="text-xl font-bold mb-2">RESUMO</h2>
                    <p className="uppercase">{produto.categoria_nome}</p>
                    <div className="absolute bottom-4 left-4 bg-blue-500 text-white text-sm py-1 px-3 rounded-full">
                      {produto.tag}
                    </div>
                  </div>
                )}
              </Card>
            </div>
            
            {/* Coluna do meio com detalhes */}
            <div className="bg-white p-6 rounded-xl shadow-md w-full">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Material Assertivo</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 w-5 h-5" />
                  Elaborado com as últimas novidades legislativas, jurisprudências e assuntos exigidos em provas.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 w-5 h-5" />
                  Não se limite à sua mesa de estudos! Estude do seu jeito, em qualquer lugar e a qualquer hora.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 w-5 h-5" />
                  Durante 12 meses você terá acesso às atualizações sem gastar mais nenhum real.
                </li>
              </ul>
            </div>
            
            {/* Coluna da direita com preço e botões */}
            <div className="bg-white p-6 roudned-xl shadow-md flex flex-col items-center w-full max-w-[280px] mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              R${Number(produto.preco).toFixed(2).replace('.', ',')}
            </h3>
                  
                  <div className="text-sm text-slate-600 mb-8 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão de crédito</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4"/>
                      <span>Cartão de débito</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <img src="/boleto.png" alt="Boleto" className="h-3 w-4 mr-1" />
                      <span>Boleto</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <img src="/pix.png" alt="Pix" className="h-4 w-4 mr-1" />
                      <span>Pagamento via Pix</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-3 w-full">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 mb-3"
                      onClick={comprarAgora}
                    >
                      Comprar agora
                    </Button>
                    
                    <Button 
                      onClick={verAmostra}
                      variant="outline" 
                      className="w-full border-blue-300 text-blue-500 hover:bg-blue-50 py-6 font-semibold"
                    >
                      Ver amostra
                    </Button>
                    
                    <Button 
                      onClick={adicionarAoCarrinho}
                      variant="outline" 
                      className="w-full border-gray-300 py-6"
                    >
                      <ShoppingCart className="mr-2" />
                      Adicionar ao carrinho
                    </Button>
                  </div>
            </div>
          </div>
          
          {/* Seção de descrição do produto */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Sobre o material</h2>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-800 whitespace-pre-line">{produto.descricao}</p>
              {produto.detalhes?.conteudo && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Conteúdo</h3>
                  <div className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: produto.detalhes.conteudo }}></div>
                </div>
              )}
              {produto.detalhes?.materiais_inclusos && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Materiais Inclusos</h3>
                  <div className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: produto.detalhes.materiais_inclusos }}></div>
                </div>
              )}
              {produto.detalhes?.objetivos && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Objetivos</h3>
                  <div className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: produto.detalhes.objetivos }}></div>
                </div>
              )}
              {produto.detalhes?.publico_alvo && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Público Alvo</h3>
                  <div className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: produto.detalhes.publico_alvo }}></div>
                </div>
              )}
            </div>
          </div>

          {produto.amostra && (
            <div ref={amostraRef} className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-6">Veja nosso material por dentro!</h2>
              <div className="w-full max-w-5xl mx-auto h-[70vh] px-4">
                <iframe
                  src={produto.amostra.startsWith("http")
                    ? produto.amostra
                    : `https://www.diretonoponto.com.br${produto.amostra}`
                  }
                  className="w-full h-full rounded shadow border"
                  allowFullScreen
                  />
              </div> 
            </div>  
          )}
          
          {/* Seção de produtos relacionados */}
          {produto.produtos_relacionados && produto.produtos_relacionados.length > 0 && (
            <div className="mt-16 border-t pt-12">
              <h2 className="text-3xl font-bold text-center mb-8">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {produto.produtos_relacionados.map((relacionado) => (
                  <ProdutoCard key={relacionado.id} produto={relacionado} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProdutoDetalhe;
