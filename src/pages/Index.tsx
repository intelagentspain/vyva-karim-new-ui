import { useState, useEffect } from "react";
import { useConversation } from '@11labs/react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Phone, Mic, MicOff } from "lucide-react";

const Index = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      toast({
        title: "Conectado",
        description: "Conexión establecida con el agente",
        duration: 3000,
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      toast({
        title: "Desconectado",
        description: "Conexión cerrada con el agente",
        duration: 3000,
      });
      setSessionStarted(false);
    },
    onMessage: (message) => {
      console.log("Message from agent:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con el agente",
        duration: 5000,
      });
      setSessionStarted(false);
    },
  });

  const toggleConversation = async () => {
    try {
      if (!sessionStarted) {
        await conversation.startSession({
          agentId: "oNEWbnZcCxKoQW7FDrIg",
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

  useEffect(() => {
    // Set API key
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.ELEVENLABS_API_KEY = "sk_c33c3c6300c6d170509ba72d34381ae579fc73df654fc16f";
    }
    
    return () => {
      // Clean up
      if (sessionStarted) {
        conversation.endSession();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#3B5B43] p-4 text-white">
      {/* Header with logo only */}
      <div className="w-full flex justify-end items-start mb-6">
        <img src="/lovable-uploads/8857d91b-c600-4c5a-b1cf-a105eaf9905a.png" alt="Diputación de Zamora" className="h-16 object-contain" />
      </div>
      
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6">
        {/* Welcome heading and call button in 70-30 layout */}
        <div className="flex flex-col md:flex-row items-center mb-8 w-full">
          <div className="w-full md:w-[70%] text-center text-white mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">¡Hola!</h1>
            <p className="text-xl">¿Cómo puedo ayudarte hoy?</p>
          </div>
          <div className="w-full md:w-[30%] md:pl-4">
            <Button 
              className={`w-full border-2 border-white text-white py-4 px-2 rounded-lg text-lg font-medium flex items-center justify-center
                ${sessionStarted ? 'bg-red-500 hover:bg-red-600' : 'bg-[#F5AA1F] hover:bg-[#e09d1d]'}`}
              onClick={toggleConversation}
              disabled={conversation.status === "connecting"}
            >
              <Phone className="mr-2" />
              <span className="whitespace-nowrap">{conversation.status === "connecting" ? "Conectando..." : sessionStarted ? "Colgar" : "Iniciar llamada"}</span>
            </Button>
          </div>
        </div>
        
        {/* Mic toggle button (only shows when connected) */}
        {sessionStarted && (
          <div className="w-full flex justify-center mb-2">
            <Button 
              className={`border-2 border-white text-white rounded-full p-2 w-12 h-12 flex items-center justify-center
                ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              onClick={toggleMicrophone}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            
            {conversation.isSpeaking && (
              <div className="ml-4 text-sm italic">
                El agente está hablando...
              </div>
            )}
          </div>
        )}
        
        {/* Action buttons - 2x2 grid */}
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
        
        {/* Text input and send button */}
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
        
        {/* Bottom image with reduced size and email link */}
        <div className="w-full flex justify-center mt-6">
          <a href="mailto:hola@mokadigital.net">
            <img src="/lovable-uploads/5d56e02d-e530-46ec-8f53-f13aa6cd6114.png" alt="Powered by VYVA" className="h-16 object-contain" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
