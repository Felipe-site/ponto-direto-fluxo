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
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md relative flex flex-col max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-800 flex-grow text-center">Login Necessário</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
                        aria-label="Fechar modal"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <p className="text-center text-gray-600 mb-6">
                        Para continuar com sua compra, por favor, faça o login ou cadastre-se.
                    </p>

                    <LoginBox onLoginSuccess={handleLoginSuccess} layout="modal" />
                </div>

                <div className="p-4 bg-gray-50 border-t text-center">
                    <p className="text-sm text-gray-600">
                        Não tem uma conta? <a href="/login" className="text-sky-500 hover:underline font-semibold">Cadastre-se</a>
                    </p>
                </div>
            </div>
        </div>
    );
};
