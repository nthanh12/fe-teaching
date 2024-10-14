import "./App.css";
import Home from "./components/Home";
import Question from "./components/Question";
import QuestionList from "./components/QuestionList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Question" element={<Question />} />
        <Route path="/QuestionList" element={<QuestionList />} />
      </Routes>
    </Router>
  );
}

export default App;
