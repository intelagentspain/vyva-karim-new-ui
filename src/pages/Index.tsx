
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioQueue, setAudioQueue] = useState<Uint8Array[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const apiKey = "sk_c33c3c6300c6d170509ba72d34381ae579fc73df654fc16f";
  const agentId = "oNEWbnZcCxKoQW7FDrIg";
  
  useEffect(() => {
    return () => {
      // Cleanup websocket connection when component unmounts
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);
  
  useEffect(() => {
    if (audioQueue.length > 0 && !isPlaying && audioContext) {
      playNextAudio();
    }
  }, [audioQueue, isPlaying]);

  const connectToAgent = async () => {
    try {
      setIsConnecting(true);
      
      // Create audio context if not already created
      if (!audioContext) {
        const context = new AudioContext();
        setAudioContext(context);
      }
      
      // Get signed URL for connection
      const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`, {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error getting signed URL: ${response.statusText}`);
      }
      
      const data = await response.json();
      const signedUrl = data.signed_url;
      
      // Connect to WebSocket
      const ws = new WebSocket(signedUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        toast({
          title: "Conectado",
          description: "Conexión establecida con el agente",
        });
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === "audio") {
          // Handle audio data
          const audioData = Uint8Array.from(atob(message.data), c => c.charCodeAt(0));
          setAudioQueue(prevQueue => [...prevQueue, audioData]);
        } else if (message.type === "message") {
          // Handle text message
          console.log("Agent message:", message.data);
        }
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        setIsConnecting(false);
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el agente",
          variant: "destructive",
        });
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
      
      setWsConnection(ws);
    } catch (error) {
      console.error("Error connecting to agent:", error);
      setIsConnecting(false);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el agente",
        variant: "destructive",
      });
    }
  };

  const disconnectFromAgent = () => {
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
      setIsConnected(false);
      toast({
        title: "Desconectado",
        description: "Conexión cerrada con el agente",
      });
    }
  };

  const playNextAudio = async () => {
    if (audioQueue.length === 0 || !audioContext) return;
    
    setIsPlaying(true);
    
    const audioData = audioQueue[0];
    setAudioQueue(prevQueue => prevQueue.slice(1));
    
    try {
      const audioBuffer = await audioContext.decodeAudioData(audioData.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      audioSourceRef.current = source;
      
      source.onended = () => {
        audioSourceRef.current = null;
        setIsPlaying(false);
      };
      
      source.start();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#3B5B43] p-4 text-white">
      {/* Header with logo and image */}
      <div className="w-full flex justify-between items-start mb-6">
        <img src="/placeholder.svg" alt="Left Image" className="h-16" />
        <img src="/logo.png" alt="Logo" className="h-16" />
      </div>
      
      {/* Welcome heading */}
      <div className="text-center text-white mb-8">
        <h1 className="text-2xl font-bold">¡Hola!</h1>
        <p className="text-xl">¿Cómo puedo ayudarte hoy?</p>
      </div>
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
        {/* Call button */}
        <Button 
          className={`w-full border-2 border-white text-white py-4 rounded-lg text-lg font-medium
            ${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-[#3B5B43] hover:bg-[#2a4331]'}`}
          onClick={isConnected ? disconnectFromAgent : connectToAgent}
          disabled={isConnecting}
        >
          {isConnecting ? "Conectando..." : isConnected ? "Colgar" : "Iniciar llamada"}
        </Button>
        
        {/* Action buttons - 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331]">
            Controlar mis síntomas
          </Button>
          <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331]">
            Consulte a un médico ahora
          </Button>
          <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331]">
            Revise mis signos vitales
          </Button>
          <Button className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331]">
            Juega un juego mental
          </Button>
        </div>
        
        {/* Text input and send button */}
        <div className="flex flex-col w-full gap-2 mt-4">
          <Textarea 
            placeholder="Escribe tu mensaje..." 
            className="bg-[#3B5B43] border-2 border-white text-white min-h-[120px]"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button 
            className="bg-[#3B5B43] border-2 border-white text-white hover:bg-[#2a4331] mt-2" 
            disabled={true}
          >
            Enviar
          </Button>
        </div>
        
        {/* Bottom image */}
        <div className="w-full flex justify-center mt-6">
          <img src="/placeholder.svg" alt="Bottom Image" className="h-24" />
        </div>
      </div>
    </div>
  );
};

export default Index;
