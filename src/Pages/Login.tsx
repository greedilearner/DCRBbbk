import { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("Admin");

  const handleLogin = async () => {
    const response = await fetch("http://localhost:8787/Login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email,
        Password,
        Role,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      return alert(result.error || "Login failed");
    } else {
      alert(result.message);
    }

    const meResponse = await fetch("http://localhost:8787/me", {
      credentials: "include",
    });

    const meData = await meResponse.json();

    setUser(meData.user);

    navigate("/home");
  };
  function Clickhandle(route: string) {
    navigate(route);
  }

  return (
    <>
      <nav className="flex flex-row top-0 bg-black text-white w-full p-3 justify-center items-center">
        <p className="text-xl font-bold">Login</p>
      </nav>
      <section className="flex flex-col bg-gray-200 min-h-screen w-full items-center px-[50vh] py-[10vh] max-[500px]:px-[10vh] max-[500px]:py-[5vh]">
        <div className="flex flex-col gap-3 bg-white/20 border border-white/20 text-black backdrop:backdrop-blur-2xl shadow rounded-md p-5">
          <div className="p-4">
            <img
              src={logo}
              className="h-[20vh] w-[40vh] max-[500px]:h-[15vh] max-[500px]:w-[30vh] mx-auto px-2 py-1"
            />
          </div>
          <div className="flex flex-row  gap-3 items-center">
            <label className="flex-1/2 text-left">Email :</label>
            <input
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1/2 border border-black p-1 rounded-md"
              placeholder="Enter Email"
            />
          </div>
          <div className="flex flex-row  gap-2 items-center">
            <label className="flex-1/2 text-left">Password :</label>
            <input
              type="text"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1/2 border border-black p-1 rounded-md"
              placeholder="Enter Password"
            />
          </div>
          <div className="flex flex-row  gap-2 items-center">
            <label className="flex-1/2 text-left">Role :</label>
            <select
              value={Role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1/2 border border-black p-1 rounded-md"
            >
              <option>Admin</option>
              <option>पैरोकार</option>
              <option>Officer</option>
            </select>
          </div>
          <button
            className="m-2 p-2 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
   "
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <div className="flex flex-row justify-center items-center ">
          <p>For New User</p>{" "}
          <button
            className="m-2 p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
   "
            onClick={() => Clickhandle("/signup")}
          >
            Sign Up
          </button>
        </div>
      </section>
    </>
  );
};

export default Login;
