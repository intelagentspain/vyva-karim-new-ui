
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Medicine = () => {
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
          <Pill className="w-24 h-24 mx-auto mb-6 text-[#F5AA1F]" />
          <h1 className="text-3xl font-bold text-[#F5AA1F] mb-4">Mi Medicina</h1>
          <p className="text-lg mb-6">
            Aquí puedes gestionar tu medicación y recordatorios.
          </p>
          
          <div className="bg-white/10 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold mb-4">Funciones disponibles:</h2>
            <ul className="space-y-2">
              <li>• Programar recordatorios de medicación</li>
              <li>• Ver historial de medicamentos</li>
              <li>• Consultar interacciones</li>
              <li>• Contactar con farmacia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicine;
