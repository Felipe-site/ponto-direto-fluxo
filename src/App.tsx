
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import AreaDoAluno from "./pages/AreaDoAluno";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Resumos from "./pages/Resumos";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Carrinho from "./pages/Carrinho";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import CadastroConcluido from "./pages/CadastroConcluido";
import AtivarConta from "./pages/AtivarConta";
import Busca from "./pages/Busca";
import AuthCallback from "./pages/AuthCallback";
import { GoogleOAuthProvider } from '@react-oauth/google';
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import { SearchProvider } from "./context/SearchContext";
import Combos from "./pages/Combos";
import TermosDeUso from "./pages/TermoDeUso";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if(!googleClientId) {
    console.error("VITE_GOOGLE_cLIENT_ID não encontrada no arquivo .env");
    return <div>Erro de configuração: Chave do Google não encontrada.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SearchProvider>
            <CartProvider>  
              <TooltipProvider>
                <Toaster />
                <Sonner 
                  position="bottom-right"
                  duration={1200}
                  closeButton
                />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/busca" element={<Busca />} />
                    <Route path="/materiais" element={<Resumos />} />
                    <Route path="/materiais/resumos" element={<Resumos />} />
                    <Route path="/materiais/combos" element={<Combos />} />
                    <Route path="/produtos/:slug" element={<ProdutoDetalhe />} />
                    <Route path="/cadastro-concluido" element={<CadastroConcluido />} />
                    <Route path="/ativar-conta" element={<AtivarConta />} />
                    <Route path="/ativacao/:uid/:token" element={<AtivarConta />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/esqueci-minha-senha" element={<EsqueciSenha />} />
                    <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenha />} />
                    <Route path="/carrinho" element={<Carrinho />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/termos-de-uso" element={<TermosDeUso />} />
                    <Route 
                      path="/area-do-aluno"
                      element={
                        <PrivateRoute>
                          <AreaDoAluno />
                        </PrivateRoute>
                      }
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </SearchProvider>
        </QueryClientProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
  );
};

export default App;
