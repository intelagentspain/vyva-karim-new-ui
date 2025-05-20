
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
      className={`w-full border-2 border-white text-white py-6 px-4 rounded-lg text-lg font-medium flex items-center justify-center
        ${sessionStarted ? 'bg-red-500 hover:bg-red-600' : 'bg-[#F5AA1F] hover:bg-[#e09d1d]'}`}
      onClick={onToggle}
      disabled={connectionStatus === "connecting"}
    >
      <Phone className="mr-2" />
      <span className="whitespace-nowrap">
        {connectionStatus === "connecting" ? "Conectando..." : sessionStarted ? "Colgar" : "Iniciar llamada"}
      </span>
    </Button>
  );
};
