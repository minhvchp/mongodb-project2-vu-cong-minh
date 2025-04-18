import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import StudentDetail from "./components/StudentDetail";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/:studentId" element={<StudentDetail />} />
      </Routes>
    </Router>
  );
}

export default App;