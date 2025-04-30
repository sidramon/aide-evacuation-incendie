import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  getCurrentQuestion,
  answerCurrentQuestion,
  initializeResident,
  resetQuestionnaire,
  isQuestionnaireComplete,
  interpretResponses,
  submitResident,
  getResident,
} from "../services/questionnaire";
import { ResidentSummaryTable } from "./ResidentSummaryTable";

interface ResidentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | "questions" | "confirm";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  width: "800px",
  height: "500px",
  borderRadius: "16px",
  padding: "24px",
  position: "relative",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "16px",
  left: "16px",
  border: "none",
  background: "gray",
  color: "#fff",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
  cursor: "pointer",
  padding: 0,
  lineHeight: 1,
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 24px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  margin: "8px",
};

const yesStyle: React.CSSProperties = { ...buttonStyle, backgroundColor: "#10b981", color: "#fff" };
const noStyle: React.CSSProperties = { ...buttonStyle, backgroundColor: "#ef4444", color: "#fff" };
const confirmStyle: React.CSSProperties = { ...buttonStyle, backgroundColor: "#1e40af", color: "#fff" };
const textInputStyle: React.CSSProperties = {
  width: "70%",
  padding: "4px",
  fontSize: "0.875rem",
  backgroundColor: "#fff",
  color: "#000",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginBottom: "16px",
};

const ResidentForm: React.FC<ResidentFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [questionKey, setQuestionKey] = useState(0);
  const [residentData, setResidentData] = useState(() => getResident());

  if (!isOpen) return null;
  const question = step === "questions" ? getCurrentQuestion() : null;

  const handleFormSubmit = () => {
    resetQuestionnaire();
    initializeResident(name, roomNumber);
    setResidentData(getResident());
    setStep("questions");
  };

  const handleAnswer = (value: "oui" | "non") => {
    answerCurrentQuestion(value);
    if (isQuestionnaireComplete()) {
      interpretResponses();
      setResidentData(getResident());
      setStep("confirm");
    } else {
      setQuestionKey(k => k + 1);
    }
  };

  const handleConfirm = () => {
    submitResident();
    setStep("form");
    setName("");
    setRoomNumber("");
    setResidentData(null);
    onClose();
  };

  const handleClose = () => {
    resetQuestionnaire();
    setStep("form");
    setName("");
    setRoomNumber("");
    setResidentData(null);
    onClose();
  };

  return createPortal(
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} style={closeBtnStyle} aria-label="Fermer">✕</button>

        {step === "form" && (
          <div style={{ width: "100%", textAlign: "center" }}>
            <h2>Informations du résident</h2>
            <input
              type="text"
              placeholder="Nom du résident"
              value={name}
              onChange={e => setName(e.target.value)}
              style={textInputStyle}
            />
            <input
              type="text"
              placeholder="Numéro de chambre"
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              style={textInputStyle}
            />
            <button onClick={handleFormSubmit} style={confirmStyle}>Commencer le questionnaire</button>
          </div>
        )}

        {step === "questions" && question && (
          <div key={questionKey} style={{ textAlign: "center", color: "#333" }}>
            <h2>{question.text}</h2>
            <div>
              <button onClick={() => handleAnswer("oui")} style={yesStyle}>Oui</button>
              <button onClick={() => handleAnswer("non")} style={noStyle}>Non</button>
            </div>
          </div>
        )}

        {step === "confirm" && residentData && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <h2>Toutes les réponses sont enregistrées.</h2>
            <ResidentSummaryTable resident={residentData} />
            <button onClick={handleConfirm} style={confirmStyle}>Enregistrer le résident</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ResidentForm;