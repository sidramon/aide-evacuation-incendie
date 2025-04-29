import * as XLSX from 'xlsx';
import { Resident } from '../models/resident';

class ExcelService {
    public generateExcelFile(data: Resident[]): void {
        const issueMap: Record<number, string> = {
          1: 'Mobilité',
          2: 'Compréhension',
          3: 'Surdité',
          4: 'Vision',
        };
      
        // 1. Préparation des données
        const rows = data.map(r => ({
          'Appartement': r.roomNumber,
          'Nom du résident': r.name,
          'Précisions': (r.additionalDetails || '').split(';').map(d => d.trim()).join('\n'),
          'Problèmes': r.issues.map(i => issueMap[i]).filter(Boolean).join('\n'),
          'code couleur': r.colorCode,
        }));
      
        // 2. Création du workbook / worksheet
        const worksheet = XLSX.utils.json_to_sheet(rows, {
          header: [
            'Appartement',
            'Nom du résident',
            'Précisions',
            'Problèmes',
            'code couleur',
          ],
          skipHeader: false,
        });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Résidents');
      
        // 3. Ajustement automatique largeur / hauteur
        const range = XLSX.utils.decode_range(worksheet['!ref']!);
      
        worksheet['!cols'] = [
          { wch: 15 },  // Appartement
          { wch: 25 },  // Nom du résident
          { wch: 40 },  // Précisions
          { wch: 30 },  // Problèmes
          { wch: 15 },  // code couleur
        ];
      
        worksheet['!rows'] = Array.from({ length: range.e.r + 1 }, () => ({ hpt: 30 }));
      
        // 4. Style des en-têtes
        for (let c = range.s.c; c <= range.e.c; ++c) {
          const addr = XLSX.utils.encode_cell({ r: range.s.r, c });
          const cell = worksheet[addr];
          if (cell) {
            cell.s = {
              font: { bold: true, color: { rgb: 'FFFFFFFF' } },
              fill: { fgColor: { rgb: 'FF4F46E5' } },
              alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
              border: {
                top: { style: 'thin', color: { rgb: 'FF000000' } },
                bottom: { style: 'thin', color: { rgb: 'FF000000' } },
                left: { style: 'thin', color: { rgb: 'FF000000' } },
                right: { style: 'thin', color: { rgb: 'FF000000' } },
              },
            };
          }
        }
      
        // 5. Style de la colonne "code couleur"
        let colorCol = -1;
        for (let c = range.s.c; c <= range.e.c; ++c) {
          const addr = XLSX.utils.encode_cell({ r: range.s.r, c });
          if (worksheet[addr]?.v === 'code couleur') {
            colorCol = c;
            break;
          }
        }
        if (colorCol >= 0) {
          for (let r = range.s.r + 1; r <= range.e.r; ++r) {
            const addr = XLSX.utils.encode_cell({ r, c: colorCol });
            const cell = worksheet[addr];
            if (cell && cell.v) {
              const val = cell.v.toString().toLowerCase();
              let bg = 'FF00FF00'; // vert
              if (val === 'rouge') bg = 'FFFF0000';
              else if (val === 'jaune') bg = 'FFFFFF00';
              cell.s = {
                fill: { fgColor: { rgb: bg } },
                font: { color: { rgb: 'FF000000' } },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: {
                  top: { style: 'thin', color: { rgb: 'FF000000' } },
                  bottom: { style: 'thin', color: { rgb: 'FF000000' } },
                  left: { style: 'thin', color: { rgb: 'FF000000' } },
                  right: { style: 'thin', color: { rgb: 'FF000000' } },
                },
              };
            }
          }
        }
      
        // 6. Style général toutes cellules (grille + wrapText)
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[addr];
            if (cell) {
              cell.s = cell.s || {};
              cell.s.border = {
                top: { style: 'thin', color: { rgb: 'FF000000' } },
                bottom: { style: 'thin', color: { rgb: 'FF000000' } },
                left: { style: 'thin', color: { rgb: 'FF000000' } },
                right: { style: 'thin', color: { rgb: 'FF000000' } },
              };
              cell.s.alignment = {
                ...cell.s.alignment,
                wrapText: true,
                vertical: 'center',
              };
            }
          }
        }
      
        // 7. Auto filter
        if (worksheet['!ref']) {
          worksheet['!autofilter'] = { ref: worksheet['!ref'] };
        }
      
        // 8. Génération et téléchargement
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
          cellStyles: true,
        });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        this.downloadExcelFile(blob, 'aide-evacuation-incendie.xlsx');
      }
      

    private downloadExcelFile(blob: Blob, fileName: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    }
}

export default ExcelService;