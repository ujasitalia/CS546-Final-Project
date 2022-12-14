import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import {pages} from "./pages";
// import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<pages.Login/>} />
          <Route path="/" element={<Navigate  to="/login"/>}/>
          <Route path="/dashboard" element={<pages.Dashboard/>}/>
          <Route path="/myAppointments" element={<pages.MyAppointment/>}/>
          {/* Edit below Route for healthy habits page */}
          {/* <Route path="/healthyHabits" element={<pages./>}/> */}
          <Route path="/doctor/:id" element={<pages.DoctorInfo/>}/>
          <Route path="/myAppointment/:appointmentId" element={<pages.EditAppointment/>}/>
          <Route path="/profile" element={<pages.Profile/>}/
          <Route path="/healthyHabits" element={<pages.HealthyHabits/>}/>
          <Route path="/signup" element={<pages.SignUp/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;