import Navbar from "../Components/navbar";
import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "../Components/Model";
import heroBg from "../assets/herobg.jpeg";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Home = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";

  async function findPending() {
    console.log(user.police_station);
    const response = await fetch(`${API_URL}/pending/${user.police_station}`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    alert(`You Have ${data.data.length} Pending Enteries for Today `);
  }

  const isMobile = window.innerWidth < 400;
  useEffect(() => {
    const sectionId = "home";
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
    if (user.role === "पैरोकार") {
      findPending();
    }
  }, []);
  return (
    <>
      <Navbar background="bg-transparent" home={true} />
      <section className="flex flex-row min-h-screen ">
        <div
          className="flex absolute inset-0 "
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="flex absolute inset-0 bg-linear-to-r from-[#08080a]/80 to-transparent" />
        <div className="absolute inset-0 items-center">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, -3] }}>
            <ambientLight intensity={2} />

            <directionalLight position={[2, 2, 2]} />

            <Model
              scale={isMobile ? 6 : 10}
              position={isMobile ? [0, -0.5, -1] : [0, -1, -1]}
            />
          </Canvas>
        </div>
        <div
          className={`flex flex-col w-full justify-center items-center gap-6 px-[10vw] max-[800px]:px-[5vw] z-10`}
        >
          <p className=" text-8xl max-[800px]:text-3xl text-white font-bold font-sans  ">
            DCRB-Barabanki
          </p>
          <p className="text-lg max-[800px]:text-md text-white tracking-wide font-sans ">
            lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
            dicta!
          </p>
        </div>
      </section>
      <section
        id="about"
        className="flex flex-col gap-4  bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] justify-around  shadow-lg "
      >
        <div>
          <p className="flex text-6xl max-[800px]:text-lg font-serif py-10 px-[10%] max-[800px]:px-[5%] items-start italic underline text-white">
            About Section
          </p>
        </div>

        <div className="flex flex-col gap-3  px-[10%] py-10">
          <div className="flex flex-col gap-3 max-[800px]:gap-2 text-md max-[800px]:text-xs p-4 justify-between  bg-transparent text-white text-justify rounded-2xl">
            <p>
              The District Crime Records Bureau (DCRB), Barabanki, serves as a
              central unit for maintaining, organizing, and managing criminal
              records across the district. It plays a vital role in supporting
              law enforcement agencies by ensuring accurate record keeping,
              facilitating data sharing between police stations, and assisting
              in crime analysis and investigations. Through systematic
              documentation of criminal history, case details, and offender
              information, DCRB helps improve operational efficiency and
              strengthens public safety initiatives within the district.
            </p>
            <p>
              This Criminal Records Management Portal has been developed to
              provide a secure and centralized platform for managing accused,
              bailer, and case-related information. The system enables
              authorized personnel to efficiently record, search, update, and
              retrieve criminal records while reducing reliance on manual
              paperwork. Features such as user role management, record
              verification, case tracking, and administrative approval workflows
              help ensure data accuracy, accountability, and controlled access
              to sensitive information. By digitizing record management
              processes, the portal enhances productivity, improves information
              accessibility, and supports informed decision-making for law
              enforcement operations.
            </p>
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="bg-black text-white py-20 px-[10%] max-[800px]:px-[5%]"
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-5xl max-[800px]:text-lg font-bold mb-4 border-b border-white/20 pb-4">
            Contact Us
          </p>

          <p className=" max-w-5xl mx-auto text-center text-gray-300 text-xl max-[800px]:text-sm leading-relaxed">
            For technical assistance, account-related queries, record management
            support, or any issues regarding the Criminal Records Management
            Portal, please contact the District Crime Records Bureau (DCRB),
            Barabanki.
          </p>

          <div className="grid md:grid-cols-3 p-4 max-[800px]:p-2 gap-8 max-[800px]:gap-4 ">
            {/* Office */}
            <div className="border border-white/10 rounded-2xl p-6 max-[800px]:p-2 bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl max-[800px]:text-sm font-semibold mb-4">
                Office Address
              </h3>
              <p className="text-gray-300 max-[800px]:text-xs leading-relaxed">
                District Crime Records Bureau (DCRB)
                <br />
                Police Office Campus
                <br />
                Barabanki, Uttar Pradesh
              </p>
            </div>

            {/* Phone */}
            <div className="border border-white/10 rounded-2xl p-6 max-[800px]:p-2 bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl max-[800px]:text-sm font-semibold mb-4">
                Phone
              </h3>
              <p className="text-gray-300 max-[800px]:text-xs">
                +91 XXXXX XXXXX
                <br />
                Mon – Sat
                <br />
                10:00 AM – 6:00 PM
              </p>
            </div>

            {/* Email */}
            <div className="border border-white/10 rounded-2xl p-6 max-[800px]:p-2 bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl max-[800px]:text-sm font-semibold mb-4">
                Email
              </h3>
              <p className="text-gray-300 max-[800px]:text-xs">
                support@dcrbbarabanki.gov.in
                <br />
                admin@dcrbbarabanki.gov.in
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 max-[800px]:pt-2 max-[800px]:mt-6">
            <p className="text-gray-400 text-sm max-[800px]:text-xs">
              Criminal Records Management Portal • District Crime Records
              Bureau, Barabanki
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
