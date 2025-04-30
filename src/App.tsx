import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "./components/FormPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
