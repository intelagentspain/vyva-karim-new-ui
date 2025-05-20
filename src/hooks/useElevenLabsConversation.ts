
import { useEffect } from "react";
import { useConversation } from '@11labs/react';
import { toast } from "@/hooks/use-toast";

export const useElevenLabsConversation = () => {
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
      window.ELEVENLABS_API_KEY = "sk_c33c3c6300c6d170509ba72d34381ae579fc73df654fc16f";
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
