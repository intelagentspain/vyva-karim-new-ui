
import { useEffect } from "react";
import { useConversation } from '@11labs/react';
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useElevenLabsConversation = () => {
  const navigate = useNavigate();
  
  const conversation = useConversation({
    clientTools: {
      redirectUser: async ({ url, message }: { url: string; message?: string }) => {
        console.log("Redirect requested:", { url, message });
        
        try {
          // Show toast message if provided
          if (message) {
            toast({
              title: "Redirigiendo",
              description: message,
              duration: 2000,
            });
          }
          
          // Small delay to show the toast
          setTimeout(() => {
            // Check if it's an external URL
            if (url.startsWith('http://') || url.startsWith('https://')) {
              window.open(url, '_blank', 'noopener,noreferrer');
            } else {
              // Internal navigation
              navigate(url);
            }
          }, message ? 1000 : 0);
          
          return "Redirección exitosa";
        } catch (error) {
          console.error("Error during redirect:", error);
          toast({
            variant: "destructive",
            title: "Error de redirección",
            description: "No se pudo completar la redirección",
            duration: 3000,
          });
          return "Error en la redirección";
        }
      }
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
      window.ELEVENLABS_API_KEY = "sk_3f6fcce03cdbd22e706c78e671ea7afb17d3a83d5f737372";
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
