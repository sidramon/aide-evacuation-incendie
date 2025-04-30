import React, { useState } from 'react';
import { useResidents } from '../contexts/ResidentContext';
import { Resident } from '../models/resident';
import { ResidentSummaryTable } from './ResidentSummaryTable';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  width: '720px',
  borderRadius: '16px',
  padding: '24px',
  position: 'relative',
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  border: 'none',
  background: 'gray',
  color: '#fff',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
};

const ResidentsList: React.FC = () => {
  const { residents, removeResident } = useResidents();
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const renderModal = () => {
    if (!selectedResident) return null;
    return (
      <div style={overlayStyle} onClick={() => setSelectedResident(null)}>
        <div style={modalStyle} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setSelectedResident(null)}
            style={closeBtnStyle}
            aria-label="Fermer"
          >
            ✕
          </button>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Informations du résident</h3>
          <ResidentSummaryTable resident={selectedResident} />
        </div>
      </div>
    );
  };

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
              onClick={() => setSelectedResident(r)}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-baseline">
                <strong className="font-bold text-gray-800">{r.name}&nbsp;</strong>
                <em className="text-sm text-gray-600">(App. {r.roomNumber})</em>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeResident(r.roomNumber);
                }}
                className="opacity-0 hover:opacity-100 text-red-500 hover:text-red-700 transition"
                aria-label="Supprimer résident"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      {renderModal()}
    </div>
  );
};

export default ResidentsList;
export { ResidentSummaryTable };
