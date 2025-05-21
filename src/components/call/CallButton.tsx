
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface CallButtonProps {
  sessionStarted: boolean;
  connectionStatus: string;
  onToggle: () => void;
}

export const CallButton = ({ sessionStarted, connectionStatus, onToggle }: CallButtonProps) => {
  return (
    <Button 
      className={`w-full py-4 px-10 rounded-full text-lg font-medium flex items-center justify-center
        ${sessionStarted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#F5AA1F] hover:bg-[#e09d1d] text-white'}`}
      onClick={onToggle}
      disabled={connectionStatus === "connecting"}
    >
      <span className="uppercase font-bold">
        {connectionStatus === "connecting" ? "Conectando..." : sessionStarted ? "Colgar" : "Iniciar llamada"}
      </span>
    </Button>
  );
};
