// src/services/questionnaire.ts

import { Resident } from "../models/resident";
import { addResident} from "../contexts/ResidentContext";  // Importe la fonction du contexte

// Objet Resident pour stocker les informations du résident
let resident: Resident | null = null;

/**
 * Initialise les informations du résident.
 * @param name Nom du résident
 * @param roomNumber Numéro de la chambre
 * @param additionalDetails Informations supplémentaires
 */
export function initializeResident(
  name: string,
  roomNumber: string,
  additionalDetails: string = ""
): void {
  resident = new Resident(name, roomNumber, "default", [], additionalDetails);
}

/**
 * Récupère les informations du résident.
 */
export function getResident(): Resident | null {
  return resident;
}

/**
 * Structure d'une question du questionnaire.
 */
export interface Question {
  id: string;
  text: string;
  skipIf?: (answers: Record<string, string>) => boolean;
}

/**
 * Liste des questions du questionnaire.
 */
const questions: Question[] = [
  // Section 1 – Mobilité
  { id: "1A", text: "Le résident est-il en mesure de passer de la position couchée à assise seul ?" },
  { id: "1B", text: "Le résident est-il en mesure de se lever debout ou d'effectuer ses transferts seul ?" },
  { id: "1C", text: "Si non, le transfert requiert-il un équipement ?", skipIf: answers => answers["1B"]?.toLowerCase() === "oui" },
  { id: "1D", text: "Le résident peut-il se déplacer seul jusqu'à un lieu sécuritaire (ex. : la cage d'escalier) ?" },
  { id: "1E", text: "Le résident est-il capable de monter ou descendre l'escalier seul ?" },
  { id: "1F", text: "Si non, pourrait-il le faire en s'asseyant sur les fesses ?", skipIf: answers => answers["1E"]?.toLowerCase() === "oui" },
  { id: "1G", text: "Si non, serait-il en mesure de le faire avec l'aide d'une autre personne ?", skipIf: answers => answers["1E"]?.toLowerCase() === "oui" },
  { id: "1H", text: "Est-ce que le résident est totalement dépendant d'un apport supplémentaire en oxygène (bombonne ou concentrateur) ?" },

  // Section 2 – Compréhension / Jugement
  { id: "2A", text: "Est-ce que le résident réagit au son de l'alarme ?" },
  { id: "2B", text: "Est-ce qu'il sort de sa chambre au son de l'alarme ?" },
  { id: "2C", text: "Si non, a-t-il des comportements opposants qui nécessiteraient une intervention particulière ?", skipIf: answers => answers["2B"]?.toLowerCase() === "oui" },
  { id: "2D", text: "Est-ce qu'il sait par où se diriger ?" },
  { id: "2E", text: "Est-ce qu'il suivrait les autres résidents en les voyant ou en entendant les consignes ?" },
  { id: "2F", text: "Est-ce que la personne prend des médicaments qui pourraient compromettre son évacuation ?" },

  // Section 3 – Surdité
  { id: "3A", text: "Est-ce que le résident entend l'alarme ?" },
  { id: "3B", text: "Est-ce qu'il entend parce qu'il a des appareils auditifs ?" },
  { id: "3C", text: "Si oui, porte-t-il ses appareils auditifs la nuit ?", skipIf: answers => answers["3B"]?.toLowerCase() === "non" },
  { id: "3D", text: "Y a-t-il un équipement qui compense le problème d'audition lorsqu'il n'a pas ses appareils ?", skipIf: answers => answers["3B"]?.toLowerCase() === "non" },

  // Section 4 – Vision
  { id: "4A", text: "Est-ce que le résident est autonome dans ses déplacements en temps normal (dans son quotidien) ?" },
];

// État interne du questionnaire
let currentIndex = 0;
const answers: Record<string, string> = {};

/**
 * Réinitialise le questionnaire.
 */
export function resetQuestionnaire(): void {
  currentIndex = 0;
  for (const key in answers) {
    delete answers[key];
  }
}

/**
 * Récupère la question courante.
 */
export function getCurrentQuestion(): Question | null {
  while (currentIndex < questions.length) {
    const q = questions[currentIndex];
    if (q.skipIf && q.skipIf(answers)) {
      currentIndex++;
      continue;
    }
    return q;
  }
  return null;
}

/**
 * Enregistre la réponse et passe à la suivante.
 */
export function answerCurrentQuestion(answer: string): void {
  const q = getCurrentQuestion();
  if (!q) return;
  answers[q.id] = answer;
  currentIndex++;
}

/**
 * Indique si le questionnaire est terminé.
 */
export function isQuestionnaireComplete(): boolean {
  return getCurrentQuestion() === null;
}

/**
 * Interprète les réponses et met à jour le Resident (code couleur, issues, détails).
 */
export function interpretResponses(): void {
    if (!resident) return;
    // Initialisation
    resident.colorCode = 'vert';
    resident.issues = [];
    const actions = new Set<string>();
  
    // Flags pour catégories
    let mobilityIssue = false;
    let comprehensionIssue = false;
    let hearingIssue = false;
    let visionIssue = false;
  
    // Section 1 – Mobilité
    const a = answers['1A'];
    const b = answers['1B'];
    const c = answers['1C'];
    const d = answers['1D'];
    const f = answers['1F'];
    const g = answers['1G'];
    const h = answers['1H'];
  
    if (a === 'non') {
      actions.add('Lever');
      mobilityIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (b === 'non') {
      actions.add('Transférer');
      mobilityIssue = true;
      resident.colorCode = 'rouge';
    }
    if (c === 'oui') {
      actions.add('Transporter avec drap');
      mobilityIssue = true;
      resident.colorCode = 'rouge';
    }
    if (d === 'non') {
      actions.add('Amener en lieu sûr');
      mobilityIssue = true;
      resident.colorCode = 'rouge';
    }
    if (f === 'non') {
      actions.add('Aider à descendre');
      mobilityIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (g === 'non') {
      actions.add('Descendre à 2 personnes avec équipement');
      mobilityIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (h === 'oui') {
      actions.add('Prévoir la disponibilité d\'oxygène');
      mobilityIssue = true;
      resident.colorCode = 'rouge';
    }
    if (mobilityIssue) resident.issues.push(1);
  
    // Section 2 – Compréhension / Jugement
    if (answers['2A'] === 'non') {
      actions.add('Aller chercher');
      comprehensionIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (answers['2B'] === 'non') {
      actions.add('Aller chercher');
      comprehensionIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (answers['2F'] === 'oui') {
      actions.add('Aller chercher');
      comprehensionIssue = true;
      resident.colorCode = 'rouge';
    }
    if (answers['2C'] === 'oui') {
      actions.add('Forcer évacuation au besoin et si possible');
      comprehensionIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (answers['2D'] === 'non') {
      actions.add('Diriger');
      comprehensionIssue = true;
      resident.colorCode = 'rouge';
    }
    if (answers['2E'] === 'non') {
      actions.add('Accompagner');
      comprehensionIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (comprehensionIssue) resident.issues.push(2);
  
    // Section 3 – Surdité
    if (answers['3A'] === 'non') {
      actions.add('Aller aviser');
      hearingIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (answers['3C'] === 'non') {
      actions.add('Aller aviser');
      hearingIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (answers['3D'] === 'non') {
      actions.add('Équipement à prévoir');
      hearingIssue = true;
      if (resident.colorCode === 'vert') resident.colorCode = 'jaune';
    }
    if (hearingIssue) resident.issues.push(3);
  
    // Section 4 – Vision
    if (answers['4A'] !== 'oui') {
      actions.add('Accompagner');
      visionIssue = true;
      resident.colorCode = 'rouge';
    }
    if (visionIssue) resident.issues.push(4);
  
    // Mets à jour additionalDetails sans doublon
    const detailStr = Array.from(actions).join('; ');
    if (detailStr) {
      const existing = resident.additionalDetails || '';
      resident.additionalDetails = existing
        ? `${existing} ${detailStr}.`
        : `${detailStr}.`;
    }
  }

/**
 * Soumet le résident actuel dans le contexte global via addResident du ResidentContext.
 * Utilise directement le resident stocké sans paramètre.
 */
export function submitResident(): void {
  if (resident) {
    addResident(resident);
  } else {
    console.warn("Aucun resident initialisé à soumettre.");
  }
}
