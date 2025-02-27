import { Route, Routes, useLocation,useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";


import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/LoginSignup";
import UserData from "./components/UserData";
import Patients from "./components/Patients";
import { MedContext } from "./context/MedContext";

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
        <div className="px-4 sm:px-[1vw] lg:px-[2vw] md:px-[2vw] bg-primary min-h-screen">
          {isAuthenticated && <Navbar handleLogout={logout} />}
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<Patients />} />
              <Route path="user/:id" element={<UserData />} />
            </Route>
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
