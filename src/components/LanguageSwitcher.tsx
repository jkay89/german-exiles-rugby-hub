
import { useLanguage } from '@/contexts/LanguageContext';
import { GlobeIcon } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-900 hover:text-white transition-colors duration-200">
        <GlobeIcon className="h-4 w-4" />
        <span className="uppercase">{language}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border border-gray-700">
        <DropdownMenuItem 
          className={`focus:bg-gray-800 ${language === 'en' ? 'bg-gray-800' : ''}`}
          onClick={() => setLanguage('en')}
        >
          <div className="flex items-center gap-2">
            <span className="text-md">🇬🇧</span>
            <span className="text-gray-300">English</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`focus:bg-gray-800 ${language === 'de' ? 'bg-gray-800' : ''}`}
          onClick={() => setLanguage('de')}
        >
          <div className="flex items-center gap-2">
            <span className="text-md">🇩🇪</span>
            <span className="text-gray-300">Deutsch</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
