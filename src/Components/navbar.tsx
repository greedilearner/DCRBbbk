import { useState } from "react";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";

type Props = {
  background?: string;
  frame?: string;
  home?: boolean;
};
const Navbar = ({
  background = "bg-transparent",
  frame = "absolute",
  home = false,
}: Props) => {
  const { user } = useAuth();
  const { setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <nav
        className={`flex flex-row w-full px-[10vw] py-4.5 ${frame} top-0 z-110  ${
          menuOpen ? "bg-black text-white" : `${background} text-white`
        }
   `}
      >
        <div className="flex   w-full">
          <div className=" content-center justify-start">
            <img src={logo} alt="Logo" className="h-20 w-auto bg-none" />
          </div>
          <div className="hidden min-[985px]:flex flex-1 items-center justify-end  px-10 ">
            <ul className="flex flex-row  items-center tracking-wider uppercase justify-between text-white  gap-8">
              <Link
                to="/home"
                className="font-sans hover:border-b-2 hover:border-white"
              >
                Home
              </Link>
              <Link
                to={`/Records`}
                className="font-sans hover:border-b-2 hover:border-white"
              >
                Records
              </Link>
              {user?.role === "Admin" ? (
                <Link
                  to={"/Adminpanel"}
                  className="font-sans hover:border-b-2 hover:border-white"
                >
                  Admin Panel
                </Link>
              ) : null}
              {home ? (
                <>
                  <a
                    href="#about"
                    className="font-sans hover:border-b-2 hover:border-white"
                  >
                    About
                  </a>
                  <a
                    href="#contact"
                    className="font-sans hover:border-b-2 hover:border-white"
                  >
                    Contact
                  </a>
                </>
              ) : (
                <>
                  <Link
                    to="/home#about"
                    className="font-sans hover:border-b-2 hover:border-white"
                  >
                    About
                  </Link>
                  <Link
                    to="/home#contact"
                    className="font-sans hover:border-b-2 hover:border-white"
                  >
                    Contact
                  </Link>
                </>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="m-2 p-2 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
   "
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
          {/* Mobile Hamburger */}
          <div className="flex flex-1 justify-end items-center min-[985px]:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-3xl"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md text-white min-[985px]:hidden">
            <ul className="flex flex-col items-center gap-6 py-8 uppercase tracking-wider">
              <Link
                to="/home"
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-400"
              >
                Home
              </Link>

              <Link
                to={`/Records`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-400"
              >
                Records
              </Link>
              {user?.role === "Admin" ? (
                <Link
                  to="/Adminpanel"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-pink-400"
                >
                  Admin Panel
                </Link>
              ) : null}
              {}
              <Link
                to="/home#about"
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-400"
              >
                About
              </Link>

              <Link
                to="/home#contact"
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-400"
              >
                Contact
              </Link>

              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-linear-to-r from-[#fd3fb3] to-[#fd3e4f] rounded"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
