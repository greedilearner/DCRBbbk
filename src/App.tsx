import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/home.tsx";
import Dataview from "./Pages/dataview.tsx";
import Datapage from "./Pages/Datapage.tsx";
import Dataentery from "./Components/Dataentery.tsx";
import Databailer from "./Components/Databailer.tsx";
import Login from "./Pages/Login.tsx";
import Signup from "./Pages/Signup.tsx";
import Adminpanel from "./Pages/Adminpanel.tsx";
import { useEffect } from "react";
import { useAuth } from "./AuthContext.tsx";
import BailerInfo from "./Pages/BailerInfo.tsx";

function App() {
  const { setUser } = useAuth();
  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${API_URL}/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);
  return (
    <BrowserRouter basename="/DCRBbbk">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Records" element={<Dataview />} />
        <Route path="/Adminpanel" element={<Adminpanel />} />
        <Route path="/Personal_info/:accusedId" element={<Datapage />} />
        <Route path="/Insertdata" element={<Dataentery />} />
        <Route path="/Editdata/:accusedId" element={<Dataentery />} />
        <Route
          path="/Databailer/:accusedId/:Page/:crimeno"
          element={<Databailer />}
        />
        <Route path="/BailerInfo/:accusedId" element={<BailerInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
