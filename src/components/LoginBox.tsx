import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// A prop 'onLoginSuccess' é a chave para o modal saber quando fechar
interface LoginBoxProps {
  onLoginSuccess?: () => void;
}

export const LoginBox = ({ onLoginSuccess }: LoginBoxProps) => {
  const navigate = useNavigate();
  const { login, loginWithTokens } = useAuth();
  
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [recaptchaLoginToken, setRecaptchaLoginToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!recaptchaLoginToken) {
      toast.error("Por favor, confirme que você não é um robô.");
      return;
    }

    try {
      await login(loginData.username, loginData.password, recaptchaLoginToken);
      toast.success("Login realizado com sucesso!");
      
      // Se a função de callback existir (ou seja, se estivermos no modal), a executamos.
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Senão, navegamos para a área do aluno (comportamento da página de login)
        navigate("/area-do-aluno");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.non_field_errors?.[0] || "Usuário ou senha inválidos.";
      setError(errorMsg);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.post('/auth/google/', {
          access_token: tokenResponse.access_token,
        });
        const { access_token, refresh_token } = response.data;
        loginWithTokens(access_token, refresh_token);
        toast.success("Login com Google realizado com sucesso!");

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/area-do-aluno');
        }
      } catch (error) {
        console.error("Falha no login com Google:", error);
        toast.error("Ocorreu um erro ao tentar fazer login com o Google.");
      }
    },
  });

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Entrar</h3>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome de usuário ou e-mail *</label>
          <Input
            type="text"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha *</label>
          <Input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="mt-1 w-full"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex items-center justify-end">
          <Link to="/esqueci-minha-senha" className="text-sm text-red-600 hover:underline">
            Perdeu sua senha?
          </Link>
        </div>
        <ReCAPTCHA 
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setRecaptchaLoginToken(token)}
        />
        <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
          Acessar
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-100 text-gray-500">ou</span></div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.71C9.9 27.22 9.5 25.65 9.5 24s.4-3.22 1.03-4.71l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.07z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
            <span>Entrar com Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};