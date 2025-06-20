import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="border-8 border-gray-200 border-t-blue-600 rounded-full w-16 h-16 animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">Autenticando...</p>
    </div>
);

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loginWithTokens } = useAuth();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (accessToken && refreshToken) {
            loginWithTokens(accessToken, refreshToken);

            navigate('/area-do-aluno', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [searchParams, loginWithTokens, navigate]);

    return <LoadingSpinner />;
}