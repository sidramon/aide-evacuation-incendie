import { Resident } from "../models/resident";

export const ResidentSummaryTable: React.FC<{ resident: Resident }> = ({ resident }) => {
  const issuesMap: Record<number, string> = {
    1: "1. Mobilité",
    2: "2. Compréhension",
    3: "3. Surdité",
    4: "4. Vision",
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', color: '#000' }}>
      <thead>
        <tr style={{ backgroundColor: '#f3f4f6' }}>
          <th style={{ border: '1px solid #000', padding: '8px' }}>Appartement</th>
          <th style={{ border: '1px solid #000', padding: '8px' }}>Nom</th>
          <th style={{ border: '1px solid #000', padding: '8px' }}>Mesures d'aide</th>
          <th style={{ border: '1px solid #000', padding: '8px' }}>Problèmes</th>
          <th style={{ border: '1px solid #000', padding: '8px' }}>Code couleur</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: '1px solid #000', padding: '8px' }}>{resident.roomNumber}</td>
          <td style={{ border: '1px solid #000', padding: '8px' }}>{resident.name}</td>
          <td style={{ border: '1px solid #000', padding: '8px', whiteSpace: 'pre-line' }}>
            {resident.additionalDetails?.split(';').join('\n')}
          </td>
          <td style={{ border: '1px solid #000', padding: '8px', whiteSpace: 'pre-line' }}>
            {resident.issues.map(i => issuesMap[i]).join('\n')}
          </td>
          <td style={{ border: '1px solid #000', padding: '8px' }}>{resident.colorCode}</td>
        </tr>
      </tbody>
    </table>
  );
};