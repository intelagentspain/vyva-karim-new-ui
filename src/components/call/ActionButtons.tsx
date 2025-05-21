
import { Button } from "@/components/ui/button";
import { User, Pill, Brain, Heart } from "lucide-react";

export const ActionButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <a href="https://traveldoctores.doxy.me/zamora" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-36 w-full flex flex-col items-center justify-center gap-1 p-2">
          <div className="h-24 flex items-center justify-center mb-1">
            <User size={80} strokeWidth={1.2} className="text-[#6B38A6]" />
          </div>
          <span className="text-sm font-medium">Habla con un Doctor</span>
        </Button>
      </a>
      
      <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-36 w-full flex flex-col items-center justify-center gap-1 p-2">
        <div className="h-24 flex items-center justify-center mb-1">
          <Pill size={80} strokeWidth={1.2} className="text-[#6B38A6]" />
        </div>
        <span className="text-sm font-medium">Mi Medicina</span>
      </Button>
      
      <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-36 w-full flex flex-col items-center justify-center gap-1 p-2">
        <div className="h-24 flex items-center justify-center mb-1">
          <Brain size={80} strokeWidth={1.2} className="text-[#6B38A6]" />
        </div>
        <span className="text-sm font-medium">Memoria y ánimo</span>
      </Button>
      
      <a href="https://demo.shen.ai/" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-36 w-full flex flex-col items-center justify-center gap-1 p-2">
          <div className="h-24 flex items-center justify-center mb-1">
            <Heart size={80} strokeWidth={1.2} className="text-[#6B38A6]" />
          </div>
          <span className="text-sm font-medium">Revisa mi salud</span>
        </Button>
      </a>
    </div>
  );
};
