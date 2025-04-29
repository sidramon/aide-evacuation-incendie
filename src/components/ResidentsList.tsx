// src/components/ResidentsList.tsx
import React from 'react';
import { useResidents } from '../contexts/ResidentContext';

const ResidentsList: React.FC = () => {
  const { residents, removeResident } = useResidents();

  return (
    <div className="w-[300px] bg-white border-l border-gray-300 shadow-xl p-6 flex flex-col overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Résidents</h2>
      {residents.length === 0 ? (
        <p className="text-gray-600 text-center">Aucun résident pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {residents.map((r) => (
            <li
              key={r.roomNumber}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-baseline">
                <strong className="font-bold text-gray-800">{r.name}&nbsp;</strong>
                <em className="text-sm text-gray-600">(App. {r.roomNumber})</em>
              </div>
              <button
                onClick={() => removeResident(r.roomNumber)}
                className="opacity-0 hover:opacity-100 text-red-500 hover:text-red-700 transition"
                aria-label="Supprimer résident"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResidentsList;
