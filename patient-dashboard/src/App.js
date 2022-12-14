import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import {pages} from "./pages";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<pages.Login/>} />
          <Route path="/dashboard" element={<pages.Dashboard/>}/>
          <Route path="/myAppointments" element={<pages.MyAppointment/>}/>
          <Route path="/doctor/:id" element={<pages.DoctorInfo/>}/>
          <Route path="/myAppointment/:appointmentId" element={<pages.EditAppointment/>}/>
          <Route path="/profile" element={<pages.Profile/>}/>
          <Route path="/healthyHabits" element={<pages.HealthyHabits/>}/>
          <Route path="/myDoctors" element={<pages.MyDoctors/>}/>
          <Route path="/signup" element={<pages.SignUp/>} />
          <Route path="/error" element={<pages.Error/>} />
          <Route path="*" element={<Navigate  to="/dashboard"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;