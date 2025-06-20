import { useState } from 'react';
import api from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EsqueciSenha() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await api.post('/auth/password/reset', { email });
            setMessage('Se um usuário com este e-mail exsitir, um link para redefinição de senha foi enviado. Por favor, verifique sua caixa de entrada e spam.');
        } catch (err) {
            setError('Ocorreu um erro. Por favor, tente novamente.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Redefinir Senha</h2>
                    <p className="text-center text-gray-600 mb-6">Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        {message && <p className="text-green-600 text-sm">{message}</p>}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                            Enviar Link de Redefinição
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}