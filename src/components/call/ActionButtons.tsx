
import { Button } from "@/components/ui/button";
import { User, Pill, Brain, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <a href="https://traveldoctores.doxy.me/zamora" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-3 p-2 [&_svg]:!size-auto">
          <User className="w-28 h-28" />
          <span className="text-base font-medium">Habla con un Doctor</span>
        </Button>
      </a>
      
      <Button 
        onClick={() => navigate("/medicine")}
        className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-3 p-2 [&_svg]:!size-auto"
      >
        <Pill className="w-28 h-28" />
        <span className="text-base font-medium">Mi Medicina</span>
      </Button>
      
      <Button 
        onClick={() => navigate("/mood")}
        className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-3 p-2 [&_svg]:!size-auto"
      >
        <Brain className="w-28 h-28" />
        <span className="text-base font-medium">Memoria y ánimo</span>
      </Button>
      
      <a href="https://demo.shen.ai/" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-white hover:bg-white/90 text-[#6B38A6] rounded-xl h-32 w-full flex flex-col items-center justify-center gap-3 p-2 [&_svg]:!size-auto">
          <Heart className="w-28 h-28" />
          <span className="text-base font-medium">Revisa mi salud</span>
        </Button>
      </a>
    </div>
  );
};
