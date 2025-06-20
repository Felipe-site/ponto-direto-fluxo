import React from 'react';

interface AmostraProps {
    nomeArquivo: string;
}

const AmostraPDF: React.FC<AmostraProps> = ({ nomeArquivo }) => {
    const url = `http://localhost:8000/api/amostra/${nomeArquivo}`;

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold text-center mb-4">Veja uma amostra do material</h2>
            <iframe
                src={url}
                width="100%"
                height="500"
                style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                loading="lazy"
                allow="fullscreen"
                title="Amostra PDF"
            ></iframe>
        </div>
    );
};

export default AmostraPDF;