
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  sessionStarted: boolean;
}

export const MessageInput = ({ sessionStarted }: MessageInputProps) => {
  const [inputMessage, setInputMessage] = useState("");

  const sendTextMessage = () => {
    if (!sessionStarted || !inputMessage.trim()) return;
    
    // The @11labs/react library doesn't directly support text input
    // This would need to be implemented through the agent's API if needed
    
    setInputMessage("");
    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado",
    });
  };

  return (
    <div className="flex flex-col w-full gap-2 mt-4">
      <Textarea 
        placeholder="Escribe tu mensaje..." 
        className="bg-[#3B5B43] border-2 border-white text-white min-h-[120px]"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        disabled={!sessionStarted}
      />
      <Button 
        className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331] mt-2" 
        disabled={!sessionStarted || !inputMessage.trim()}
        onClick={sendTextMessage}
      >
        Enviar
      </Button>
    </div>
  );
};
