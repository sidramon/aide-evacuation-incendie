import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">
        Plan d'Évacuation Résidence
      </h1>

      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <button
          onClick={() => navigate("/form")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 rounded-2xl shadow-md transition"
        >
          ➕ Créer un nouveau document
        </button>

        <button
          onClick={() => navigate("/update")}
          className="bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-4 rounded-2xl shadow-md transition"
        >
          📝 Mettre à jour un document existant
        </button>
      </div>
    </div>
  );
};

export default HomePage;