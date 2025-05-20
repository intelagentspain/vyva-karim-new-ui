
import { Button } from "@/components/ui/button";
import { User, Pill, Brain, Heart } from "lucide-react";

export const ActionButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <a href="https://traveldoctores.doxy.me/zamora" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-4/5 h-4/5 flex items-center justify-center">
            <User className="w-full h-full" />
          </div>
          <span className="text-sm font-medium">Habla con un Doctor</span>
        </Button>
      </a>
      
      <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-2 p-2">
        <div className="w-4/5 h-4/5 flex items-center justify-center">
          <Pill className="w-full h-full" />
        </div>
        <span className="text-sm font-medium">Mi Medicina</span>
      </Button>
      
      <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-2 p-2">
        <div className="w-4/5 h-4/5 flex items-center justify-center">
          <Brain className="w-full h-full" />
        </div>
        <span className="text-sm font-medium">Memoria y ánimo</span>
      </Button>
      
      <a href="https://demo.shen.ai/" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-4/5 h-4/5 flex items-center justify-center">
            <Heart className="w-full h-full" />
          </div>
          <span className="text-sm font-medium">Revisa mi salud</span>
        </Button>
      </a>
    </div>
  );
};
