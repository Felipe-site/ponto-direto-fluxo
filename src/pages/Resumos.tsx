
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from 'lucide-react';
import { toast } from "sonner";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/services/api.ts";
import { Produto } from "@/types/produto.ts";
import { useCart } from '@/context/CartContext.tsx';
import { useSearch } from '@/context/SearchContext.tsx';
import { ProdutoCard } from '@/components/produtos/ProdutoCard.tsx';
const Resumos = () => {

  const { addToCart } = useCart();
  const { searchTerm } = useSearch();

  const { data: searchedProducts, isLoading: isLoadingSearch, error } = useQuery<Produto[]>({
    queryKey: ['produtos', { tipo: 'resumo', q: searchTerm }],
    queryFn: async () => {
      const params: { tipo: string; q?: string } = {
        tipo: 'resumo',
      };

      if (searchTerm) {
        params.q = searchTerm;
      }
      const response = await api.get<Produto[]>('/produtos/', { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const { data: recommendedProducts, isLoading: isLoadingRecs } = useQuery<Produto[]>({
    queryKey: ['produtosRecomendados'],
    queryFn: async () => {
      const response = await api.get<Produto[]>('/produtos/', { params: { tipo: 'resumo'} });
      return response.data;
    },
    enabled: !isLoadingSearch && !!searchTerm && searchedProducts?.length === 0,
  });

  if (isLoadingSearch && !searchedProducts) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl">Carregando produtos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500">Erro ao carregar produtos.</p>
            <p className="mt-2">Verifique se o servidor está rodando.</p>
          </div>
        </div>
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
            <h1 className="text-3xl font-bold mb-4">
              {searchTerm ? `Resultados para "${searchTerm}"`: 'Resumos para Concurso Público'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Materiais elaborados por especialistas para otimizar seu tempo de estudo e maximizar seus resultados.
            </p>
          </div>

          {/* Banner promocional */}
          {!searchTerm && (
          <div className="bg-gray-100 p-6 rounded-lg mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Monte o seu combo com até 30% de desconto!</h2>
          </div>
          )}

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
                <p className="text-xl text-gray-700">Nenhum resultado encontrado para "{searchTerm}.</p>
                <p className="text-gray-500 mt-2">Tente buscar por outro nome.</p>
              </div>

              <div className="mt-12 border-t pt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Produtos que possam te interessar:</h2>

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
              <p className="text-xl text-gray-700">Nenhum resumo encontrado no momento.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resumos;
