
import { Button } from "@/components/ui/button";

export const ActionButtons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331] px-2 py-6">
        <span className="text-sm sm:text-base">Controlar mis síntomas</span>
      </Button>
      <a href="https://traveldoctores.doxy.me/zamora" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331] px-2 py-6 w-full">
          <span className="text-sm sm:text-base">Consulte a un médico ahora</span>
        </Button>
      </a>
      <a href="https://demo.shen.ai/" target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331] px-2 py-6 w-full">
          <span className="text-sm sm:text-base">Revise mis signos vitales</span>
        </Button>
      </a>
      <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331] px-2 py-6">
        <span className="text-sm sm:text-base">Juega un juego mental</span>
      </Button>
    </div>
  );
};
