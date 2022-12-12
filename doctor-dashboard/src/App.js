import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {pages} from "./pages";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<pages.Login/>} />
          <Route path="/" element={<Navigate  to="/login"/>}/>
          <Route path="/dashboard" element={<pages.Dashboard/>}/>
          <Route path="/dashboard/appointment/:appointmentId" element={<pages.EditAppointment/>}/>
          <Route path="/profile" element={<pages.Profile/>}/>
          <Route path="/signup" element={<pages.SignUp/>} />
          {/* <Route path="/create-account" element={<CreateAccount/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;