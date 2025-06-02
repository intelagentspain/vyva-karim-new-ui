
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Mood = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#642A97] p-4 text-white">
      <div className="w-full max-w-md mx-auto">
        <Button 
          onClick={() => navigate("/")}
          className="mb-6 bg-white/20 hover:bg-white/30 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        
        <div className="text-center">
          <Brain className="w-24 h-24 mx-auto mb-6 text-[#F5AA1F]" />
          <h1 className="text-3xl font-bold text-[#F5AA1F] mb-4">Memoria y Ánimo</h1>
          <p className="text-lg mb-6">
            Herramientas para cuidar tu bienestar mental y cognitivo.
          </p>
          
          <div className="bg-white/10 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold mb-4">Servicios disponibles:</h2>
            <ul className="space-y-2">
              <li>• Ejercicios de memoria</li>
              <li>• Seguimiento del estado de ánimo</li>
              <li>• Técnicas de relajación</li>
              <li>• Recursos de apoyo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mood;
