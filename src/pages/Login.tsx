import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { loginWithTokens } = useAuth();

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [recaptchaLoginToken, setRecaptchaLoginToken] = useState<string | null>(null);
  
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [registerData, setRegisterData] = useState({ email: "", password: "" });
  
    const [errors, setErrors] = useState({
      login: { username: "", password: "" },
      register: { email: "", password: "" },
    });
  
    const [remember, setRemember] = useState(false);
  
    const validateRegister = () => {
      const newErrors = { email: "", password: "" };
      if (!registerData.email.includes("@")) newErrors.email = "E-mail inválido";
      if (registerData.password.length < 6) newErrors.password = "Mínimo 6 caracteres";
      setErrors((e) => ({ ...e, register: newErrors }));
      return !newErrors.email && !newErrors.password;
    };
  
    const validateLogin = () => {
      const newErrors = { username: "", password: "" };
      if (!loginData.username) newErrors.username = "Preencha o usuário";
      if (!loginData.password) newErrors.password = "Preencha a senha";
      setErrors((e) => ({ ...e, login: newErrors }));
      return !newErrors.username && !newErrors.password;
    };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaLoginToken) {
      alert("Pro favor, confirme que você não é um robô.");
      return;
    }
    
    if (!validateLogin()) return;

    try {
      await login(loginData.username, loginData.password, recaptchaLoginToken);
      navigate("/area-do-aluno");
    } catch (error: any) {
      console.log("ERRO DE LOGIN: ", error?.response?.data);

      const data = error?.response?.data;
      const msgArray = data?.non_field_errors || [];
      const mensagem = msgArray.join(" ").toLowerCase();

      if (mensagem.includes("inativa") || mensagem.includes("ativar")) {
        navigate("/ativar-conta", { state: { email: loginData.username } });
      } else {
        alert("Usuário ou senha inválidos.");
      }
    }
  };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateRegister()) return;

      if(!recaptchaToken) {
        alert("Por favor, confirme que você não é um robô.");
        return;
      }

      try {
        await api.post("/register/", {
          username: registerData.email,
          email: registerData.email,
          password: registerData.password,
          recaptcha_token: recaptchaToken,
        });
        navigate("/cadastro-concluido");
      } catch (error: any){
        const errorData = error.response?.data;
        const firstErrorKey = Object.keys(errorData)[0];
        const errorMessage = errorData[firstErrorKey]?.[0] || "Erro ao cadastrar.";
        alert(errorMessage);
        console.error("Erro no cadastro", errorData);
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
          navigate('/area-do-aluno');
        } catch (error) {
          console.error("Falha no login com Google:", error);
          alert("Ocorreu um erro ao tentar fazer login com o Google.");
        }
      },
    });
    
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen pt-32 bg-white px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Área de Alunos</h2>
    
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Login */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Entrar</h3>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Nome de usuário ou e-mail *
                    </label>
                    <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) =>
                        setLoginData({ ...loginData, username: e.target.value })
                    }
                    className={`mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none ${
                        errors.login.username ? "border-red-500" : "border-gray-300"
                    }`}
                    />
                    {errors.login.username && (
                    <p className="text-red-600 text-sm mt-1">{errors.login.username}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Senha *</label>
                    <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                    }
                    className={`mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none ${
                        errors.login.password ? "border-red-500" : "border-gray-300"
                    }`}
                    />
                    {errors.login.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.login.password}</p>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="mr-2"
                    />
                    Lembre-me
                    </label>
                    <Link to="/esqueci-minha-senha" className="text-sm text-red-600 hover:underline">
                    Perdeu sua senha?
                    </Link>
                </div>
                <ReCAPTCHA 
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaLoginToken(token)}
                />
                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white py-2 rounded font-semibold hover:bg-sky-600"
                >
                    Acessar
                </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-100 text-gray-500">ou</span>
                    </div>
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
    
            {/* Cadastro */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Cadastre-se</h3>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Endereço de e-mail *
                    </label>
                    <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                    }
                    className={`mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none ${
                        errors.register.email ? "border-red-500" : "border-gray-300"
                    }`}
                    />
                    {errors.register.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.register.email}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Senha *</label>
                    <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                    }
                    className={`mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none ${
                        errors.register.password ? "border-red-500" : "border-gray-300"
                    }`}
                    />
                    {errors.register.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.register.password}</p>
                    )}
                </div>
                <p className="text-xs text-gray-600">
                    Seus dados pessoais serão usados para aprimorar sua experiência neste site.
                    Consulte nossa{" "}
                    <a href="#" className="text-red-600 hover:underline">
                    política de privacidade
                    </a>
                    .
                </p>
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                  ref={recaptchaRef}
                />
                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white py-2 rounded font-semibold hover:bg-sky-600"
                >
                    Cadastre-se
                </button>
                </form>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-100 text-gray-500">ou</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => handleGoogleLogin()}
                        className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <svg viewBox="0 0 48 48" className="w-5 h-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.71C9.9 27.22 9.5 25.65 9.5 24s.4-3.22 1.03-4.71l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.07z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                        <span>Cadastre-se com Google</span>
                      </button>
                    </div>
                  </div>
              </div>
            </div>
        </div>

      <Footer />
    </>
    );
  };
  
  export default Login;
  
