// Em src/pages/Combos.tsx

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearch } from '@/context/SearchContext';
import { Produto } from "@/types/produto";
import api from "@/services/api";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProdutoCard } from "@/components/produtos/ProdutoCard";

// 1. MUDE O NOME DO COMPONENTE
const Combos = () => {
  const { searchTerm } = useSearch();

  const { data: searchedProducts, isLoading: isLoadingSearch, error } = useQuery<Produto[]>({
    // 2. MUDE A CHAVE DA QUERY PARA DIFERENCIAR O CACHE
    queryKey: ['produtos', { tipo: 'combo', q: searchTerm }],
    
    queryFn: async () => {
      // 3. MUDE O PARÂMETRO 'tipo' NA CHAMADA DA API
      const params: { tipo: string; q?: string } = {
        tipo: 'combo', // ALTERADO DE 'resumo' PARA 'combo'
      };
      
      if (searchTerm) {
        params.q = searchTerm;
      }
      const response = await api.get<Produto[]>('/produtos/', { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  // Query para sugestões, também buscando por combos
  const { data: recommendedProducts, isLoading: isLoadingRecs } = useQuery<Produto[]>({
    queryKey: ['produtosRecomendados_combos'], // Chave única
    queryFn: async () => {
      const response = await api.get<Produto[]>('/produtos/', { params: { tipo: 'combo' } });
      return response.data.slice(0, 4); 
    },
    enabled: !isLoadingSearch && !!searchTerm && searchedProducts?.length === 0,
  });

  if (isLoadingSearch && !searchedProducts) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center"><p className="text-xl">Carregando combos...</p></div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center"><p className="text-xl text-red-500">Erro ao carregar combos.</p></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="text-center mb-10">
            {/* 4. ATUALIZE OS TEXTOS DA PÁGINA */}
            <h1 className="text-3xl font-bold mb-4">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Combos de Materiais'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pacotes de estudo completos para acelerar sua aprovação.
            </p>
          </div>

          {/* Renderização condicional (a lógica é a mesma, não precisa mudar) */}
          {searchedProducts && searchedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchedProducts.map((produto) => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}

          {!isLoadingSearch && searchTerm && searchedProducts?.length === 0 && (
            <>
              <div className="text-center py-10">
                <p className="text-xl text-gray-700">Nenhum resultado encontrado para "{searchTerm}".</p>
                <p className="text-gray-500 mt-2">Tente buscar por outro nome.</p>
              </div>

              <div className="mt-12 border-t pt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Combos que possam te interessar:</h2>
                {isLoadingRecs ? (
                  <p className="text-center">Carregando sugestões...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts?.map((produto) => (
                      <ProdutoCard key={produto.id} produto={produto} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          
          {searchedProducts && searchedProducts.length === 0 && !searchTerm && (
             <div className="text-center py-10">
                <p className="text-xl text-gray-700">Nenhum combo encontrado no momento.</p>
              </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// 5. MUDE A EXPORTAÇÃO PADRÃO
export default Combos;