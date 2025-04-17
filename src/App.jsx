// App.jsx
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/LoginSignup";
import UserData from "./components/UserData";
import Appoinments from "./components/Appoinments";
import Patients from "./components/Patients"; // Import the new component
import Events from "./components/Events"; // Import the new component
import DocumentPreview from "./components/DocumentPreview";
import { MedContext } from "./context/MedContext";
import Error from "./pages/Error";


const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, login } = useContext(MedContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<Login login={login} />} />
          
        </Routes>
      ) : (
        <div className="px-2 bg-custom-gradient dark:bg-custom-gradient-d overflow-x-hidden  min-h-screen ">
          {isAuthenticated && <Navbar handleLogout={logout} />}
          {/* <div className="flex flex-col absolute z-100 top-0 left-0 bg-white h-screen w-[20vw]">

          </div> */}
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<Appoinments />} />
              <Route path="patients" element={<Patients />} />
              <Route path="events" element={<Events />} />
              <Route path="user/:id" element={<UserData />} />
            </Route>
            <Route path="/error" element={<Error/>} />
          </Routes>

          {/* Document Preview Component */}
          <DocumentPreview />
        </div>
      )}
    </>
  );
};

export default App;