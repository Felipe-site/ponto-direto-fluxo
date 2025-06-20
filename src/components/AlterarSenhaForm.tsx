import { useState } from 'react';
import api from '@/services/api';

interface Props {
    signupMethod: 'google' | 'site' | null;
}

export default function AlterarSenhaForm({ signupMethod }: Props) {
    const [formData, setFormData] = useState({
        old_password: '',
        new_password1: '',
        new_password2: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isGoogleUser = signupMethod === 'google';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.new_password1 !== formData.new_password2) {
            setError('As novas senhas não coincidem.');
            return;
        }
        if (formData.new_password1.length < 8) {
            setError('A nova senha deve ter pelo menos 8 caracteres.');
            return;
        }

        try {
            const payload: any = {
                new_password1: formData.new_password1,
                new_password2: formData.new_password2,
            };

            if (!isGoogleUser) {
                payload.old_password = formData.old_password;
            }

            await api.post('/auth/password/change', payload);
            setSuccess('Senha alterada com sucesso!');
            setFormData({ old_password: '', new_password1: '', new_password2: '' });
        } catch (err: any) {
            const errorData = err.response?.data;
            const firstError = Object.values(errorData)[0];
            setError(Array.isArray(firstError) ? firstError[0] : 'Ocorreu um erro.');
            console.error(errorData);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Segurança da Conta</h2>

            {isGoogleUser && (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded" role="alert">
                    <p className="font-bold">Você fez login com o Google</p>
                    <p>Você não possui uma senha cadastrada. Se desejar, pode criar uma abaixo para acessar sua conta também com e-mail e senha.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isGoogleUser && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                        <input
                            type="password"
                            name="old_password"
                            value={formData.old_password}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm"
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input
                        type="password"
                        name="new_password1"
                        value={formData.new_password1}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirme a Nova Senha</label>
                    <input
                        type="password"
                        name="new_password2"
                        value={formData.new_password2}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <div>
                    <button type ='submit' className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700">
                        {isGoogleUser? 'Criar Senha' : 'Alterar Senha'}
                    </button>
                </div>
            </form>
        </div>
    );
}