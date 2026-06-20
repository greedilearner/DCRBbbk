import { useState, useEffect } from "react";
import Arrow from "../assets/arrow";

import { useAuth } from "../AuthContext.tsx";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const BailerInfo = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  const { accusedId } = useParams();

  const [accused, setAccused] = useState(null);
  const [bailers, setBailers] = useState([]);

  const navigate = useNavigate();
  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";

  async function fetchBailers() {
    try {
      if (!accusedId) return; // g
      let response;

      response = await fetch(
        `${API_URL}/Court/${encodeURIComponent(accusedId)}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();
      console.log(data);
      setAccused(data.data?.[0] ?? null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function listBailers() {
    try {
      if (accused) {
        console.log(accused);
        let response;

        response = await fetch(
          `${API_URL}/Courts/${encodeURIComponent(
            accused?.["Bailer Name"] || "",
          )}/${encodeURIComponent(accused?.["Address"] || "")}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();
        console.log(data);
        setBailers(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchBailers();
  }, [accusedId]);

  useEffect(() => {
    if (!accused) return;

    listBailers();
  }, [accused]);
  const handelClick = () => {
    navigate(`/Records`);
  };
  return (
    <>
      <nav className="flex flex-row bg-black w-full top-0 print:hidden ">
        <div className="p-4 text-black" onClick={handelClick}>
          <Arrow className="size-6 text-white" />
        </div>
        <div className="flex-1 text-white items-center p-4">
          <p>Accused Detail</p>
        </div>
        <div className="items-end p-4 ">
          <button
            className=" p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white print:hidden"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </nav>
      <section className="bg-gray-300 px-[30vh] py-[10vh] min-h-screen print:bg-white print:px-0 print:py-0">
        <div className=" shadow-black flex flex-col rounded-md font-bold font-serif text-black bg-white min-h-screen w-full p-4 gap-2">
          {/* personal info */}
          <div className="text-black p-1 ">
            <p className="font-bold font-serif">Personal Information</p>
          </div>

          <div className="flex flex-row w-full bg-white justify-items-center gap-5 border border-black p-4">
            <div className="min-h-[10vh]  w-px bg-black " />
            <div className="flex flex-1 flex-row gap-10 p-4 ">
              <div className="flex-1/2 flex-col justify-between items-start text-left">
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>Name :</p>
                  <p>{accused?.["Bailer Name"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>Father Name :</p>
                  <p>{accused?.["Father Name"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>Address :</p>
                  <p>{accused?.["Address"]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* crime history table */}

          {/* bailer info */}

          <div className="p-4">
            <div className="text-black p-1 ">
              <p className="font-bold font-serif">Bailer Table</p>
            </div>
            <table className=" text-xs">
              <thead>
                <tr className="bg-gray-900 text-white whitespace-nowrap">
                  <th className="px-6 py-4 text-left font-semibold whitespace-normal">
                    मुकदमा अपराध संख्या
                  </th>
                  <th className="px-6 py-4 text-left font-semibold whitespace-normal">
                    Case Number
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Bailer Name
                  </th>

                  <th className="px-6 py-4 text-left font-semibold">
                    Father Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Address</th>

                  <th className="px-6 py-4 text-left font-semibold">
                    Case Date
                  </th>

                  <th className="px-6 py-4 text-left font-semibold">Remark</th>
                </tr>
              </thead>

              <tbody>
                {bailers.map((row, index) => (
                  <tr
                    key={index}
                    className="
              border-b
              border-gray-200
              transition-all
              duration-150
              
               hover:bg-gray-200 cursor-pointer 
            "
                  >
                    <td className="px-6 py-2 font-medium text-left">
                      {row["मुकदमा अपराध संख्या"]}
                    </td>

                    <td className="px-6 py-2 text-left">
                      {row["Case Number"]}
                    </td>

                    <td className="px-6 py-2 text-left">
                      {row["Bailer Name"]}
                    </td>
                    <td className="px-6 py-2 font-medium text-left">
                      {row["Father Name"]}
                    </td>
                    <td className="px-6 py-2 text-left">{row["Address"]}</td>
                    <td className="px-6 py-2 text-left">{row["Case Date"]}</td>

                    <td className="px-6 py-2 text-left">{row["Remark"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default BailerInfo;
