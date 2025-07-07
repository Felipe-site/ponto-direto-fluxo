import { act, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext.tsx";
import api from "@/services/api.ts";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import DetalhesDaContaForm from "@/components/DetalhesDaContaForm.tsx";
import AlterarSenhaForm from "@/components/AlterarSenhaForm.tsx";
import EnderecoForm from "@/components/EnderecoForm";

interface Material {
  id: number;
  titulo: string;
  descricao_curta: string;
  imagem: string;
  download_url: string;
}

interface User {
  username: string;
  email: string;
}

const AreaDoAluno = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("materiais");
  const [userProfile, setUserProfile] = useState<any>(null);

  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loadingMateriais, setLoadingMateriais] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    if(token) {
      api.get("/accounts/profile/")
        .then((res) => setUserProfile(res.data))
        .catch(err => console.error("Erro ao buscar perfil:", err));
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "materiais" && token) {
      setLoadingMateriais(true);
      api
        .get("/meus-materiais/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setMateriais(res.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar materiais:", err);
        })
        .finally(() => {
          setLoadingMateriais(false);
        });
    }
  }, [token, activeTab]);

  const handleDownload = async (material: Material) => {
    setDownloading(material.id);
    try {
      const response = await api.get(material.download_url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const header = response.headers['content-disposition'];
      const parts = header.split(';');
      let filename = 'download.pdf';
      parts.forEach(part => {
        if(part.trim().startsWith('filename=')) {
          filename = part.split('=')[1].replace(/"/g, '');
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Falha no download:", error);
      alert("Não foi possível baixar o arquivo. Tente novamente.");
    } finally {
      setDownloading(null);
    }
  };
  
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 pt-12 pb-24">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-10 mt-12">Área do Aluno</h1>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/*Menu Lateral */}
            <aside className="w-full md:w-1/4 space-y-2">
              <button onClick={() => setActiveTab("materiais")}
                      className={`w-full text-left px-4 py-3 rounded ${
                        activeTab === "materiais"
                        ? "bg-slate-800 text-white"
                        : "bg-gray-100 text-gray-800"
                      }`}
              >
                Meus Materiais
              </button>
              <button onClick={() => setActiveTab("enderecos")}
                      className={`w-full text-left px-4 py-3 rounded ${
                        activeTab === "enderecos"
                        ? "bg-slate-800 text-white"
                        : "bg-gray-100 text-gray-800"
                      }`}
              >
                Endereços
              </button>
              <button onClick={() => setActiveTab("conta")}
                      className={`w-full text-left px-4 py-3 rounded ${
                        activeTab === "conta"
                        ? "bg-slate-800 text-white"
                        : "bg-gray-100 text-gray-800"
                      }`}
              >
                Detalhes da Conta
              </button>
              <button onClick={() => setActiveTab("seguranca")}
                className={`w-full text-left px-4 py-3 rounded ${
                  activeTab === "seguranca"
                    ? "bg-slate-800 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Segurança
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 rounded bg-gray-100 text-red-600 hover:bg-red-100"
              >
                Sair
              </button>
            </aside>

            <section className="w-full md:w-3/4 bg-white border border-gray-200 rounded p-6 min-h-[200px">
              {activeTab === "materiais" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">Meus Materiais</h2>
                  {loadingMateriais ? (
                    <p className="text-gray-600">Carregando seus materiais...</p>
                  ) : materiais.length > 0 ? (
                    <div className="space-y-4">
                      {materiais.map((material) => (
                        <div key={material.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                          <div className="flex items-center gap-4">
                            <img src={material.imagem} alt={material.titulo} className="w-24 h-24 object-cover rounded-md hidden sm:block"/>
                            <div>
                              <h3 className="font-bold text-lg text-slate-700">{material.titulo}</h3>
                              <p className="text-sm text-gray-500">{material.descricao_curta}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(material)}
                            disabled={downloading === material.id}
                            className="bg-blue-600 text-white folt-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {downloading === material.id ? 'Baixando...' : 'Baixar'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhum pedido foi feito ainda.</p>
                  )}
                </div>
              )}

              {activeTab === "conta" && (
                <div className="space-y-2 text-gray-700">
                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">Detalhes da Conta</h2>
                  <p className="text-gray-600 mb-6">Atualize suas informações pessoais e de perfil abaixo.</p>
                  <DetalhesDaContaForm />
                </div>
              )}
              {activeTab === "enderecos" && (
                <div className="space-y-2 text-gray-700">
                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">Meu Endereço</h2>
                  <p className="text-gray-600 mb-6">Mantenha seu endereço de cobrança atualizado.</p>
                  <EnderecoForm />
                </div>
              )}

              {activeTab === "seguranca" && userProfile && (
                <AlterarSenhaForm signupMethod={userProfile.profile.signup_method} />
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AreaDoAluno;
