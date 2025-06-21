import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api.ts';
import { ProdutoCard } from '@/components/produtos/ProdutoCard.tsx';
import Navbar from '@/components/Navbar.tsx';
import Footer from '@/components/Footer.tsx';

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const Busca = () => {
  const query = useQueryParams().get('q');

  const { data: resultados, isLoading, error } = useQuery({
    queryKey: ['produtos', 'busca', query],
    queryFn: async () => {
      const res = await api.get('/produtos/', { params: { q: query } });
      return res.data;
    },
    enabled: !!query,
  });

  const { data: recomendados } = useQuery({
    queryKey: ['produtos', 'recomendados'],
    queryFn: async () => {
      const res = await api.get('/produtos/', { params: { destaque: true } });
      return res.data;
    },
    enabled: !!resultados || !!error,  // só busca recomendados quando necessário
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16 p-6">
        <h1 className="text-2xl font-bold mb-4">Resultados para: "{query}"</h1>

        {isLoading && <p>Carregando...</p>}
        {error && <p className="text-red-500">Erro ao buscar produtos.</p>}

        {resultados?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resultados.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">Nenhum produto encontrado para sua busca.</p>
            {recomendados?.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4">Talvez você goste de:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recomendados.map((produto) => (
                    <ProdutoCard key={produto.id} produto={produto} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Busca;
