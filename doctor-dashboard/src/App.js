import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {pages} from "./pages";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<pages.Login/>} />
          <Route path="/dashboard" element={<pages.Dashboard/>}/>
          <Route path="/dashboard/appointment/:appointmentId" element={<pages.EditAppointment/>}/>
          <Route path="/profile" element={<pages.Profile/>}/>
          <Route path="/signup" element={<pages.SignUp/>} />
          <Route path="/patient" element={<pages.MyPatients/>}/>
          <Route path="/patient/:id" element={<pages.PatientInfo/>}/>
          <Route path="/error" element={<pages.Error/>} />
          <Route path="*" element={<Navigate  to="/dashboard"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;