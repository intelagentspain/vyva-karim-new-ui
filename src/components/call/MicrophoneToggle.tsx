
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface MicrophoneToggleProps {
  isMuted: boolean;
  onToggle: () => void;
  isSpeaking: boolean;
}

export const MicrophoneToggle = ({ isMuted, onToggle, isSpeaking }: MicrophoneToggleProps) => {
  return (
    <div className="w-full flex justify-center mb-2">
      <Button 
        className={`border-2 border-white text-white rounded-full p-2 w-12 h-12 flex items-center justify-center
          ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        onClick={onToggle}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>
      
      {isSpeaking && (
        <div className="ml-4 text-sm italic">
          El agente está hablando...
        </div>
      )}
    </div>
  );
};
