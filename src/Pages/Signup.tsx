import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Arrow from "../assets/arrow";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [Role, setRole] = useState("Admin");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [Police_station, setPoliceStation] = useState("");
  function handelClick() {
    navigate("/");
  }
  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";

  const handleSubmit = async () => {
    const userData = {
      Email: Email,
      Password: Password,
      Name: Name,
      Police_station: Police_station,
      role: Role,
    };

    const response = await fetch(`${API_URL}/Signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (!response.ok) {
      return alert(result.error || "Signup failed");
    } else {
      alert(
        "your response has been submitted to the admin wait for 24hr then try to login ",
      );
    }
  };
  return (
    <>
      <nav className="flex flex-row top-0 bg-black text-white w-full p-3  items-center">
        <div className=" justify-start p-4 text-black " onClick={handelClick}>
          <Arrow className="size-6 text-white" />
        </div>
        <div className="flex flex-1 justify-center">
          <p className="text-xl font-bold">Sign In</p>
        </div>
      </nav>
      <section className="flex flex-col bg-gray-200 min-h-screen w-full items-center px-[50vh] py-[10vh] max-[500px]:px-[10vh] max-[500px]:py-[5vh]">
        <div className="flex flex-col gap-3 bg-white/20 border border-white/20 text-black backdrop:backdrop-blur-2xl shadow rounded-md p-5">
          <div className="p-4">
            <img
              src={logo}
              className="h-[20vh] w-[40vh] max-[500px]:h-[15vh] max-[500px]:w-[30vh] mx-auto px-2 py-1"
            />
          </div>
          <form className="flex flex-col gap-3">
            <div className="flex flex-row  gap-3 items-center">
              <label className="flex-1/2 text-left">Name :</label>
              <input
                type="text"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1/2 border border-black p-1 rounded-md"
                placeholder="Enter Name"
              />
            </div>

            <div className="flex flex-row  gap-3 items-center">
              <label className="flex-1/2 text-left">Email :</label>
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="flex-1/2 border border-black p-1 rounded-md"
                placeholder="Enter Email"
              />
            </div>
            <div className="flex flex-row  gap-2 items-center">
              <label className="flex-1/2 text-left">Password :</label>
              <input
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                className="flex-1/2 border border-black p-1 rounded-md"
                placeholder="Enter Password"
              />
            </div>
            <div className="flex flex-row  gap-2 items-center">
              <label className="flex-1/2 text-left">Police Station :</label>
              <select
                value={Police_station}
                onChange={(e) => setRole(e.target.value)}
                className="flex-1/2 border border-black p-1 rounded-md"
              >
                <option>Select police Station</option>
                <option>कोतवाली नगर</option>
                <option>देवा</option>
                <option>जहागीराबाद</option>
                <option>फतेहपुर</option>
                <option>मोहम्मदपुर खाला</option>
                <option>कुर्सी</option>
                <option>बडडूपुर</option>
                <option>घुघटेर</option>
                <option>रामनगर</option>
                <option>बदोसराय</option>
                <option>मसौली</option>
                <option>रामसनेहीघाट</option>
                <option>टिकैत नगर</option>
                <option>दरियाबाद</option>
                <option>असन्द्रा</option>
                <option>हैदरगढ</option>
                <option>लोनीकटरा</option>
                <option>कोठी</option>
                <option>सुबेहा</option>
                <option>सफदरगंज</option>
                <option>जैदपुर</option>
                <option>सतरिख</option>
                <option>माती</option>
                <option>DHQ</option>
              </select>
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
              type="button"
              className="m-2 p-2 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
   "
              onClick={async () => {
                await handleSubmit();
                setEmail("");
                setPassword("");
                setName("");
                setPoliceStation("");
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Signup;
