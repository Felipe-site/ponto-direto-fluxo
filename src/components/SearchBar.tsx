import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {

  const [termo, setTermo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(termo.trim()) {
      navigate(`/busca?q=${encodeURIComponent(termo.trim())}`)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <Input 
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Qual material você está buscando?"
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>
    </form>
  );
};

export default SearchBar;
