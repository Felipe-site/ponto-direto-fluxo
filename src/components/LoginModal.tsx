import { LoginBox } from "./LoginBox";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    if (!isOpen) return null;

    const handleLoginSuccess = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-center mb-2">Login Necessário</h2>
                <p className="text-center text-gray-600 mb-6">
                    Para continuar com sua compra, por favor, faça o login ou cadastra-se.
                </p>

                <LoginBox onLoginSuccess={handleLoginSuccess} />

                <p className="text-center text-sm text-gray-500 mt-4">
                    Não tem uma conta? <a href="/login" className="text-sky-500 hover:underline">Cadastre-se na nossa página de login.</a>
                </p>
            </div>
        </div>
    );
};
