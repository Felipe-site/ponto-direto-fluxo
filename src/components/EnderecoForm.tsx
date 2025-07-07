import { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from "sonner";

interface EnderecoFormData {
    id?: number;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
}

export default function EnderecoForm() {
    const [formData, setFormData] = useState<EnderecoFormData>({
        rua: '',
        numero: '',
        bairro: '',
        complemento: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: 'BR',
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/enderecos/')
          .then(response => {
            if (response.data && response.data.length > 0) {
                setFormData(response.data[0]);
            }
          })
          .catch(error => {
            console.error("Erro ao buscar endereço:", error);
            toast.error("Não foi possível carregar seu endereço.");
          })
          .finally(() => {
            setIsLoading(false);
          });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (formData.id) {
                await api.put(`/enderecos/${formData.id}/`, formData);
            } else {
                await api.post('/enderecos/', formData);
            }
            toast.success('Endereço salvo com sucesso!');
        } catch (error) {
            console.error("Erro ao salvar endereço:", error);
            toast.error('Ocorreu um erro ao salvar o endereço.');
        }
    };

    if (isLoading) {
        return <p>Carregando seu endereço...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">CEP</label>
                    <input name="cep" value={formData.cep || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rua</label>
                    <input name="rua" value={formData.rua || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Número</label>
                    <input name="numero" value={formData.numero || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Complemento</label>
                    <input name="complemento" value={formData.complemento || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input name="bairro" value={formData.bairro || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input name="cidade" value={formData.cidade || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Estado (UF)</label>
                    <input name="estado" value={formData.estado || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
            </div>

            <div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700">Salvar Endereço</button>
            </div>
        </form>
    );
}