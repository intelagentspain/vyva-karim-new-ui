
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Phone, Mic, MicOff } from "lucide-react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioQueue, setAudioQueue] = useState<Uint8Array[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [micPermission, setMicPermission] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  const apiKey = "sk_c33c3c6300c6d170509ba72d34381ae579fc73df654fc16f";
  const agentId = "RyloaiqsF04O4XPLfna0";
  
  useEffect(() => {
    return () => {
      // Cleanup websocket connection and audio resources when component unmounts
      if (wsConnection) {
        wsConnection.close();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (processorRef.current && audioContext) {
        processorRef.current.disconnect();
      }
      
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [wsConnection, audioContext]);
  
  useEffect(() => {
    if (audioQueue.length > 0 && !isPlaying && audioContext) {
      playNextAudio();
    }
  }, [audioQueue, isPlaying]);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Store the stream for later use
      streamRef.current = stream;
      setMicPermission(true);
      toast({
        title: "Micrófono activado",
        description: "Permiso de micrófono concedido",
      });
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error de micrófono",
        description: "No se pudo acceder al micrófono",
        variant: "destructive",
      });
      return false;
    }
  };

  const setupAudioProcessing = (ws: WebSocket) => {
    if (!audioContext || !streamRef.current) return;
    
    // Create microphone input source
    const micSource = audioContext.createMediaStreamSource(streamRef.current);
    
    // Create a script processor node for processing audio data
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;
    
    // Process audio data
    processor.onaudioprocess = (e) => {
      if (!isConnected || isMuted) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Convert float32 audio data to int16
      const pcmData = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        pcmData[i] = Math.min(1, Math.max(-1, inputData[i])) * 0x7fff;
      }
      
      // Send audio data as binary message
      if (ws.readyState === WebSocket.OPEN) {
        // Create a message object for audio data
        const message = {
          type: "audio",
          data: Array.from(pcmData)
        };
        
        ws.send(JSON.stringify(message));
      }
    };
    
    // Connect the audio nodes
    micSource.connect(processor);
    processor.connect(audioContext.destination);
  };
  
  const connectToAgent = async () => {
    try {
      setIsConnecting(true);
      
      // First request microphone permission
      const permissionGranted = await requestMicrophonePermission();
      if (!permissionGranted) {
        setIsConnecting(false);
        return;
      }
      
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
        
        // Initialize the conversation
        const initMessage = {
          type: "init",
          sample_rate: 16000  // Standard sample rate for voice recognition
        };
        ws.send(JSON.stringify(initMessage));
        
        // Setup audio processing after connection is established
        setupAudioProcessing(ws);
        
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
        } else if (message.type === "error") {
          console.error("WebSocket error message:", message.data);
          toast({
            title: "Error de comunicación",
            description: message.data,
            variant: "destructive",
          });
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
        // Stop the microphone stream when the connection closes
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setMicPermission(false);
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
      
      // Stop the microphone stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setMicPermission(false);
      
      toast({
        title: "Desconectado",
        description: "Conexión cerrada con el agente",
      });
    }
  };

  const toggleMicrophone = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
        
        toast({
          title: isMuted ? "Micrófono activado" : "Micrófono desactivado",
          description: isMuted ? "Ahora puedes hablar" : "Ya no te escuchan",
        });
      }
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

  const sendTextMessage = () => {
    if (!wsConnection || !inputMessage.trim()) return;
    
    // Create a message object for text input
    const message = {
      type: "text",
      data: inputMessage
    };
    
    wsConnection.send(JSON.stringify(message));
    setInputMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#3B5B43] p-4 text-white">
      {/* Header with logo and image */}
      <div className="w-full flex justify-between items-start mb-6">
        <img src="/placeholder.svg" alt="Left Image" className="h-16" />
        <img src="/logo.png" alt="Logo" className="h-16" />
      </div>
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
        {/* Welcome heading and call button in 70-30 layout */}
        <div className="flex items-center mb-8 w-full">
          <div className="w-[70%] text-center text-white">
            <h1 className="text-2xl font-bold">¡Hola!</h1>
            <p className="text-xl">¿Cómo puedo ayudarte hoy?</p>
          </div>
          <div className="w-[30%] pl-4">
            <Button 
              className={`w-full border-2 border-white text-white py-4 rounded-lg text-lg font-medium flex items-center justify-center
                ${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-[#F5AA1F] hover:bg-[#e09d1d]'}`}
              onClick={isConnected ? disconnectFromAgent : connectToAgent}
              disabled={isConnecting}
            >
              <Phone className="mr-2" />
              {isConnecting ? "Conectando..." : isConnected ? "Colgar" : "Iniciar llamada"}
            </Button>
          </div>
        </div>
        
        {/* Mic toggle button (only shows when connected) */}
        {isConnected && (
          <div className="w-full flex justify-center mb-2">
            <Button 
              className={`border-2 border-white text-white rounded-full p-2 w-12 h-12 flex items-center justify-center
                ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              onClick={toggleMicrophone}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
          </div>
        )}
        
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
            disabled={!isConnected || !inputMessage.trim()}
            onClick={sendTextMessage}
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
