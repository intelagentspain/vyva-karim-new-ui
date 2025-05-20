
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useElevenLabsConversation } from "@/hooks/useElevenLabsConversation";
import { Header } from "@/components/call/Header";
import { Footer } from "@/components/call/Footer";
import { Welcome } from "@/components/call/Welcome";
import { CallButton } from "@/components/call/CallButton";
import { MicrophoneToggle } from "@/components/call/MicrophoneToggle";
import { ActionButtons } from "@/components/call/ActionButtons";
import { MessageInput } from "@/components/call/MessageInput";

const Index = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const conversation = useElevenLabsConversation();

  const toggleConversation = async () => {
    try {
      if (!sessionStarted) {
        await conversation.startSession({
          agentId: "RyloaiqsF04O4XPLfna0",
        });
        setSessionStarted(true);
        toast({
          title: "Iniciando conversación",
          description: "Conectando con el agente...",
        });
      } else {
        await conversation.endSession();
        setSessionStarted(false);
        toast({
          title: "Conversación terminada",
          description: "La conexión ha sido cerrada",
        });
      }
    } catch (error) {
      console.error("Error toggling conversation:", error);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con el agente",
        duration: 5000,
      });
    }
  };

  const toggleMicrophone = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      conversation.setVolume({ volume: 1 });
      toast({
        title: "Micrófono activado",
        description: "Ahora puedes hablar",
      });
    } else {
      conversation.setVolume({ volume: 0 });
      toast({
        title: "Micrófono desactivado",
        description: "Ya no te escuchan",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#3B5B43] p-4 text-white">
      <Header />
      
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6">
        {/* Welcome heading and call button in 70-30 layout */}
        <div className="flex flex-col md:flex-row items-center mb-8 w-full">
          <Welcome />
          <div className="w-full md:w-[30%] md:pl-4">
            <CallButton 
              sessionStarted={sessionStarted}
              connectionStatus={conversation.status}
              onToggle={toggleConversation}
            />
          </div>
        </div>
        
        {/* Mic toggle button (only shows when connected) */}
        {sessionStarted && (
          <MicrophoneToggle 
            isMuted={isMuted}
            onToggle={toggleMicrophone}
            isSpeaking={conversation.isSpeaking}
          />
        )}
        
        {/* Action buttons */}
        <ActionButtons />
        
        {/* Text input and send button */}
        <MessageInput sessionStarted={sessionStarted} />
        
        {/* Bottom image */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
