import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import FormPage from "./components/FormPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/update" element={<div>Page mise à jour à venir</div>} />
      </Routes>
    </Router>
  );
}

export default App;
