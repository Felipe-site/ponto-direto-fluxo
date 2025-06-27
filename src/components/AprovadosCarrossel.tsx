import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

interface Aprovador {
  id: number;
  nome: string;
  cargo: string;
  foto: string;
}

const AprovadosCarrossel = () => {
  const { data: aprovadores, isLoading, error } = useQuery<Aprovador[]>({
    queryKey: ['aprovados'],
    queryFn: async () => {
      const response = await api.get("/aprovados/");
      return response.data;
    }
  });

  if (isLoading) return <div className="text-center py-12">Carregando aprovados...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Não foi possível carregar os aprovados.</div>;
  if (!aprovadores || aprovadores.length === 0) return null;

  return (
    <div className="py-12 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Quem aprova o Direto no Ponto</h2>
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        navigation
        autoplay={{ delay: 3000 }}
        loop
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {aprovadores.map((aprov) => (
          <SwiperSlide key={aprov.id}>
            <div className="flex flex-col items-center p-4 shadow rounded bg-gray-50">
              <img
                src={aprov.foto}
                alt={aprov.nome}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <p className="font-semibold">{aprov.nome}</p>
              <p className="text-sm text-gray-600">{aprov.cargo}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AprovadosCarrossel;
