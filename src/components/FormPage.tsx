import { useState } from "react";
import ResidentsList from "./ResidentsList";
import ResidentForm from "./ResidentForm";
import ExcelService from "../utils/excelUtils";
import { useResidents } from '../contexts/ResidentContext';

const FormPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { residents } = useResidents();


  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Gauche */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 gap-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                     py-4 px-8 rounded-2xl shadow-md text-xl transition"
        >
          ➕ Ajouter un résident
        </button>
        <button
          onClick={() => {
            const excelService = new ExcelService();
            excelService.generateExcelFile(residents);
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold
                     py-4 px-8 rounded-2xl shadow-md text-lg transition"
        >
          📄 Générer fichier Excel
        </button>
      </div>

      {/* Droite */}
      <ResidentsList />

      {/* Modale */}
      <ResidentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
export default FormPage;
