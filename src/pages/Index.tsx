
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useElevenLabsConversation } from "@/hooks/useElevenLabsConversation";
import { Header } from "@/components/call/Header";
import { Footer } from "@/components/call/Footer";
import { ActionButtons } from "@/components/call/ActionButtons";
import { CallButton } from "@/components/call/CallButton";
import { MicrophoneToggle } from "@/components/call/MicrophoneToggle";

const Index = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const conversation = useElevenLabsConversation();

  const toggleConversation = async () => {
    try {
      if (!sessionStarted) {
        await conversation.startSession({
          agentId: "agent_01jvrq6dg2ffz9j5zk83g80gj2",
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
    <div className="flex flex-col min-h-screen bg-[#642A97] p-4 text-white">
      <Header />
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 mt-4">
        {/* Main heading */}
        <h1 className="text-2xl font-bold text-[#F5AA1F] mb-2">¿Cómo puedo asistir?</h1>
        
        {/* Action buttons in grid */}
        <ActionButtons />
        
        {/* Call button */}
        <div className="w-full mt-4">
          <CallButton 
            sessionStarted={sessionStarted}
            connectionStatus={conversation.status}
            onToggle={toggleConversation}
          />
        </div>
        
        {/* Mic toggle button (only shows when connected) */}
        {sessionStarted && (
          <MicrophoneToggle 
            isMuted={isMuted}
            onToggle={toggleMicrophone}
            isSpeaking={conversation.isSpeaking}
          />
        )}
        
        {/* Bottom image */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
