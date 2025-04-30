import { useState } from "react";
import ResidentsList from "./ResidentsList";
import ResidentForm from "./ResidentForm";

const FormPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex flex-1">
        {/* Colonne gauche */}
        <div className="flex-1 flex flex-col p-8 gap-6">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            Mesures d'aide à l'évacuation
          </h1>
          <div className="flex-1 flex justify-center items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                         py-4 px-8 rounded-2xl shadow-md text-xl transition"
            >
              ➕ Ajouter un résident
            </button>
          </div>
        </div>

        {/* Colonne droite */}
        <ResidentsList />
      </div>

      {/* Crédit */}
      <footer className="text-right text-gray-400 text-sm px-6 py-2 italic font-bold">
        Développé par Simon Aucoin
      </footer>

      {/* Modale */}
      <ResidentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FormPage;
