import { useState, useEffect } from 'react';
import api from '@/services/api';
import Select, { MultiValue } from 'react-select';

interface AreaInteresse {
    id: number;
    nome: string;
}

interface ProfileFormData {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile: {
        telefone: string;
        formacao: string;
        concurso_desejado: string;
        aprovacoes: string;
        bio: string;
        areas_interesse: AreaInteresse[];
        areas_interesse_ids: number[];
    }
}

interface SelectOption {
    value: number;
    label: string;
}

export default function DetalhesDaContaForm() {
    
    const [formData, setFormData] = useState<ProfileFormData | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [opcoesAreas, setOpcoesAreas] = useState<AreaInteresse[]>([]);

    useEffect(() => {
        Promise.all([
            api.get('/accounts/profile/'),
            api.get('/accounts/areas-interesse/')
        ]).then(([profileResponse, areasResponse]) => {
            const profileData = profileResponse.data;
            setFormData({
                ...profileData,
                profile: {
                    ...profileData.profile,
                    areas_interesse_ids: profileData.profile.areas_interesse.map((area: AreaInteresse) => area.id)
                }
            });
            setOpcoesAreas(areasResponse.data);
        }).catch(error => console.error("Erro ao buscar dados iniciais:", error));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name in formData!.profile) {
            setFormData(prev => ({
                ...prev!,
                profile: { ...prev!.profile, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev!, [name]: value }));
        }
    };

    const handleAreaChange = (selectedOptions: MultiValue<SelectOption>) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prev => {
            if(!prev) return null;
            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    areas_interesse_ids: selectedIds
                }
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await api.put('/accounts/profile/', formData);
            const updatedProfileData = response.data
            setFormData({
                ...updatedProfileData,
                profile: {
                    ...updatedProfileData.profile,
                    areas_interesse_ids: updatedProfileData.profile.areas_interesse.map((area: AreaInteresse) => area.id)
                }
            });
            setSuccessMessage('Dados salvos com sucesso!');
        } catch (error: any) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
        }
    };

    if (!formData) {
        return <p>Carregando seus dados...</p>;
    }

    const areaOptionsForSelect: SelectOption[] = opcoesAreas.map(area => ({
        value: area.id,
        label: area.nome
    }));

    const selectedAreaOptions = areaOptionsForSelect.filter(option =>
        formData.profile.areas_interesse_ids?.includes(option.value)
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                <input name="username" value={formData.username} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100" readOnly title="O e-mail não pode ser alterado." />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Telefone (com DDD)</label>
                <input name="telefone" value={formData.profile.telefone || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Formação Acadêmica</label>
                <input name="formacao" value={formData.profile.formacao || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Concurso Desejado</label>
                <input name="concurso_desejado" value={formData.profile.concurso_desejado || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Áreas de Interesse</label>
                <p className="text-xs text-gray-500 mb-2">Selecione uma ou mais opções para receber atualizações de concursos da área!</p>
                <Select
                    isMulti
                    name="areas_interesse"
                    options={areaOptionsForSelect}
                    value={selectedAreaOptions}
                    onChange={handleAreaChange}
                    className="mt-1"
                    classNamePrefix="select"
                    placeholder="Selecione as áreas..."
                    noOptionsMessage={() => "Nenhuma outra opção disponível"}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Aprovações</label>
                <textarea name="aprovacoes" value={formData.profile.aprovacoes || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" rows={3} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Sobre Mim (uma breve biografia)</label>
                <textarea name="bio" value={formData.profile.bio || ''} onChange={handleChange} className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm" rows={3} />
            </div>
            <div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700">Salvar Alterações</button>
                {successMessage && <span className="text-green-600 ml-4">{successMessage}</span>}
            </div>
        </form>
    );
}