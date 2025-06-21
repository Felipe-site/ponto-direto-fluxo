
import Navbar from "@/components/Navbar.tsx";
import Hero from "@/components/Hero.tsx";
import ContentCards from "@/components/ContentCards.tsx";
import Features from "@/components/Features.tsx";
import AprovadosCarrossel from "@/components/AprovadosCarrossel.tsx";
import Footer from "@/components/Footer.tsx";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16">
        <Hero /> 
        <ContentCards />
        <Features />
        <AprovadosCarrossel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
