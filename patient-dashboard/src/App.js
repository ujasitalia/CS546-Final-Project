import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import {pages} from "./pages";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<pages.Login/>} />
          <Route path="/signup" element={<pages.SignUp/>} />
          {/* <Route path="/create-account" element={<CreateAccount/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;