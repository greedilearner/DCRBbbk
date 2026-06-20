import { useState, useEffect } from "react";
import Arrow from "../assets/arrow";
import nullphoto from "../assets/nullphoto.png";
import { useAuth } from "../AuthContext.tsx";
import { Navigate, useNavigate, useParams } from "react-router-dom";

type AccusedRecord = Record<string, any>;

const Datapage = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  const { accusedId } = useParams();
  const [accused, setAccused] = useState<AccusedRecord | null>(null);
  const [bailers, setBailers] = useState([]);
  const [history, setHistory] = useState([]);
  const [courtRecords, setCourtRecords] = useState<any[]>([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";

  async function fetchHistory() {
    try {
      let response;

      response = await fetch(`${API_URL}/criminal_history/${accusedId}`, {
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setHistory(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchBailers() {
    try {
      let response;

      response = await fetch(`${API_URL}/Court1/${accusedId}`, {
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setBailers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchAccused() {
    try {
      let response;

      response = await fetch(`${API_URL}/Accused/${accusedId}`, {
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setAccused(data.data?.[0] ?? null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchCourtRecords() {
    try {
      let response;

      response = await fetch(`${API_URL}/court_records/${accusedId}`, {
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setCourtRecords(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching court records:", error);
    }
  }
  useEffect(() => {
    fetchAccused();
    fetchBailers();
    fetchHistory();
    fetchCourtRecords();
  }, []);
  const handelClick = () => {
    navigate(`/Records`);
  };
  const handleEditClick = () => {
    navigate(`/Editdata/${accusedId}`);
  };
  const accusedPhotoUrl =
    typeof accused?.["Baseurl"] === "string" && accused["Baseurl"].trim()
      ? accused["Baseurl"].trim()
      : nullphoto;

  return (
    <>
      <nav className="flex flex-row bg-black w-full top-0 print:hidden ">
        <div className="p-4 text-black" onClick={handelClick}>
          <Arrow className="size-6 text-white" />
        </div>
        <div className="flex-1 text-white items-center p-4">
          <p>Accused Detail</p>
        </div>
        <div className="items-end p-4 flex gap-2">
          <button
            className=" p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white print:hidden"
            onClick={handleEditClick}
          >
            Edit
          </button>
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
            <div className="p-4 border border-black">
              <img
                src={accusedPhotoUrl}
                alt="Accused"
                className="h-[30vh] w-[20vh] object-fit"
                onError={(event) => {
                  event.currentTarget.src = nullphoto;
                }}
              />
            </div>
            <div className="min-h-[10vh]  w-px bg-black " />
            <div className="flex flex-1 flex-row gap-10 p-4 ">
              <div className="flex-1/2 flex-col justify-between items-start text-left">
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>Name :</p>
                  <p>{accused?.["Accused Name"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>Criminal Type :</p>
                  <p>{accused?.["Criminal Type"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>पिता का नाम :</p>
                  <p>{accused?.["पिता का नाम"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>modus operandi :</p>
                  <p>{accused?.["पता"]}</p>
                </div>
              </div>
              <div className="flex-1/2 flex-col justify-between items-start">
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>सत्यापन विवरण :</p>
                  <p>{accused?.["सत्यापन विवरण"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>गाँव/मोहल्ला :</p>
                  <p>{accused?.["गाँव/मोहल्ला"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>पुलिस स्टेशन :</p>
                  <p>{accused?.["पुलिस स्टेशन"]}</p>
                </div>
                <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                  <p>ज़िला :</p>
                  <p>{accused?.["ज़िला"]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* crime history table */}
          <div className="p-4">
            <div className="text-black p-1 ">
              <p className="font-bold font-serif">Criminal History Table</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">
                    मुकदमा अपराध संख्या
                  </th>

                  <th className="px-6 py-4 text-left font-semibold">धारा</th>

                  <th className="px-6 py-4 text-left font-semibold">ज़िला</th>
                </tr>
              </thead>

              <tbody>
                {history.map((row, index) => (
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

                    <td className="px-6 py-2 text-left">{row["धारा"]}</td>

                    <td className="px-6 py-2 text-left">{row["ज़िला"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* bailer info */}

          <div className="p-4">
            <div className="text-black p-1 ">
              <p className="font-bold font-serif">Bailer Table</p>
            </div>
            <table className=" text-xs  mx-auto">
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

                  <th className="px-6 py-4 text-left font-semibold">Date</th>

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
                    <td className="px-6 py-2 text-left">{row["Date"]}</td>

                    <td className="px-6 py-2 text-left">{row["Remark"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Court Data*/}
          <div className="p-4">
            <div className="text-black p-1 ">
              <p className="font-bold font-serif">Court Table</p>
            </div>
            <table className=" text-xs mx-auto">
              <thead>
                <tr className="bg-gray-900 text-white whitespace-nowrap">
                  <th className="px-6 py-4 text-left font-semibold whitespace-normal">
                    मुकदमा अपराध संख्या
                  </th>
                  <th className="px-6 py-4 text-left font-semibold whitespace-normal">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>

                  <th className="px-6 py-4 text-left font-semibold">
                    Accused_status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Case Number
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Remark</th>
                </tr>
              </thead>

              <tbody>
                {courtRecords.map((row, index) => (
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

                    <td className="px-6 py-2 text-left">{row["Date"]}</td>

                    <td className="px-6 py-2 text-left">{row["Status"]}</td>

                    <td className="px-6 py-2 text-left">
                      {row["Accused_status"]}
                    </td>

                    <td className="px-6 py-2 font-medium text-left">
                      {row["Case Number"]}
                    </td>
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

export default Datapage;
