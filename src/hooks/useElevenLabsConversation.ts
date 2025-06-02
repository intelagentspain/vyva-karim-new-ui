
import { useEffect } from "react";
import { useConversation } from '@11labs/react';
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useElevenLabsConversation = () => {
  const navigate = useNavigate();
  
  const conversation = useConversation({
    clientTools: {
      "read-vitals": async ({ message }: { message?: string }) => {
        console.log("Read vitals requested:", { message });
        
        try {
          toast({
            title: "Revisando signos vitales",
            description: message || "Redirigiendo a revisión de salud...",
            duration: 2000,
          });
          
          // Redirect to external vitals URL in the same window after a short delay
          setTimeout(() => {
            window.location.href = 'https://demo.shen.ai/';
          }, 1000);
          
          return "Redirigiendo a revisión de signos vitales";
        } catch (error) {
          console.error("Error during vitals redirect:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo acceder a la revisión de signos vitales",
            duration: 3000,
          });
          return "Error al acceder a revisión de signos vitales";
        }
      },
      "see-doctor": async ({ message }: { message?: string }) => {
        console.log("See doctor requested:", { message });
        
        try {
          toast({
            title: "Conectando con doctor",
            description: message || "Redirigiendo a consulta médica...",
            duration: 2000,
          });
          
          // Redirect to external doctor URL in the same window after a short delay
          setTimeout(() => {
            window.location.href = 'https://traveldoctores.doxy.me/zamora';
          }, 1000);
          
          return "Redirigiendo a consulta médica";
        } catch (error) {
          console.error("Error during doctor redirect:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo conectar con el doctor",
            duration: 3000,
          });
          return "Error al conectar con el doctor";
        }
      },
    },
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
    },
  });

  useEffect(() => {
    // Set API key
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.ELEVENLABS_API_KEY = "sk_06caed3d3cd30ebcfe2317c58a48eb9bcee50ea00ce33024";
    }
    
    // Clean up on unmount
    return () => {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, []);

  return conversation;
};
