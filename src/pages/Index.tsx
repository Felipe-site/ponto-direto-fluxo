
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentCards from "@/components/ContentCards";
import Features from "@/components/Features";
import AprovadosCarrossel from "@/components/AprovadosCarrossel";
import Footer from "@/components/Footer";

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
