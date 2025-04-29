// src/contexts/ResidentContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Resident } from '../models/resident';

/**
 * Type du contexte résidents
 */
export interface ResidentContextType {
  residents: Resident[];
  addResident: (resident: Resident) => void;
  updateResident: (updated: Resident) => void;
  removeResident: (roomNumber: string) => void;
  clearResidents: () => void;
}

const ResidentContext = createContext<ResidentContextType | undefined>(undefined);

// Référence interne pour permettre un appel hors du composant
let internalAddResident: ((resident: Resident) => void) | undefined;

/**
 * Fonction à utiliser en dehors des composants pour ajouter un résident
 */
export function addResident(resident: Resident) {
  if (internalAddResident) {
    internalAddResident(resident);
  } else {
    console.warn('ResidentContext non initialisé : impossible d\'ajouter le résident.');
  }
}

/**
 * Fonction à utiliser en dehors des composants pour obtenir les résidents
 */
export function getResidents(): Resident[] {
  const context = useContext(ResidentContext);
  if (!context) {
    console.warn('ResidentContext non initialisé : impossible de récupérer les résidents.');
    return [];
  }
  return context.residents;
}

export const ResidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [residents, setResidents] = useState<Resident[]>([]);

  const add = (resident: Resident) => setResidents(prev => [...prev, resident]);
  internalAddResident = add;

  const updateResident = (updated: Resident) => setResidents(prev =>
    prev.map(r => r.roomNumber === updated.roomNumber ? updated : r)
  );

  const removeResident = (roomNumber: string) => setResidents(prev =>
    prev.filter(r => r.roomNumber !== roomNumber)
  );

  const clearResidents = () => setResidents([]);

  return (
    <ResidentContext.Provider value={{ residents, addResident: add, updateResident, removeResident, clearResidents }}>
      {children}
    </ResidentContext.Provider>
  );
};

/**
 * Hook pour accéder au contexte résidents
 */
export function useResidents(): ResidentContextType {
  const context = useContext(ResidentContext);
  if (!context) {
    throw new Error('useResidents doit être utilisé dans un ResidentProvider');
  }
  return context;
}
