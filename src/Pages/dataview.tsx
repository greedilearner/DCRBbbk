import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext.tsx";
import Navbar from "../Components/navbar.tsx";
const Dataview = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const [bailers, setBailers] = useState([]);
  const [rows, setRows] = useState<any[]>([]);
  const [isselected, setisselected] = useState(true);
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const activeData = isselected ? rows : bailers;
  const filterOptions = isselected
    ? ["Accused Name", "Criminal_type", "धारा", "पुलिस स्टेशन", "ज़िला"]
    : [
        "Bailer Name",
        "मुकदमा अपराध संख्या",
        "Father Name",
        "Case Number",
        "Case Date",
        "Case Status",
      ];
  const [filteredRows, setFilteredRows] = useState<typeof rows>([]);
  const [searched, setSearched] = useState(false);
  const rowsToDisplay = searched ? filteredRows : activeData;
  const handleSearch = () => {
    const result = activeData.filter((row) =>
      String(row[selectedFilter] ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

    setFilteredRows(result);
    setSearched(true);
  };

  const suggestions =
    selectedFilter && activeData.length
      ? [
          ...new Set(
            activeData.map((row) => row[selectedFilter]).filter(Boolean),
          ),
        ]
      : [];
  const filteredSuggestions = suggestions.filter((item) =>
    String(item).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleClick = (id: string) => {
    navigate(`/Personal_info/${id}`);
  };
  const bailersClick = (id: string) => {
    navigate(`/BailerInfo/${encodeURIComponent(id)}`);
  };
  const addClick = () => {
    navigate("/Insertdata");
  };
  const editClick = (id: string) => {
    navigate(`/Databailer/${encodeURIComponent(id)}`);
  };
  async function fetchBailers() {
    try {
      let response;

      response = await fetch(`http://localhost:8787/bailer`);

      const data = await response.json();
      console.log(data);
      setBailers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchData() {
    try {
      let response;

      response = await fetch("http://localhost:8787/crime");

      const data = await response.json();
      console.log(data);
      setRows(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData();
    fetchBailers();
  }, [isselected]);
  return (
    <>
      {/* //navbar */}
      <div className="min-w-screen bg black">
        <Navbar background="bg-black" frame="relative" />
        {/* main sectoin of page */}

        <section className="flex flex-row w-full min-h-screen bg-gray-200">
          {/* // side nav bar */}

          <nav className="flex flex-col min-w-[40vh] z min-h-screen text-black  cursor-pointer border border-r-white/20 bg-white/10 backdrop-blur-2xl shadow-xl ">
            <p
              className={`pt-10 text-lg cursor-pointer ${
                isselected
                  ? "bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white "
                  : "hover:border-b hover:border-black "
              }`}
              onClick={() => {
                setisselected(true);
              }}
            >
              Criminal reconds
            </p>
            <p
              className={`pt-10 text-lg cursor-pointer ${
                !isselected
                  ? "bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white"
                  : "hover:border-b hover:border-black"
              }`}
              onClick={() => {
                setisselected(false);
              }}
            >
              Bailer Records
            </p>
          </nav>

          {/* // table section */}

          <div className="flex flex-col w-full min-h-screen bg-gray-200 ">
            <div>
              <div className="flex flex-row w-full max-h-[20vh] gap-4 px-4 py-10 items-center justify-between ">
                {isselected ? (
                  <p className="text-4xl font-bold text-gray-800">
                    Criminal Records
                  </p>
                ) : (
                  <p className="text-4xl font-bold text-gray-800">
                    Bailer Records
                  </p>
                )}
              </div>
              <div className=" w-full  flex flex-row justify-between  px-8">
                {(user?.role === "Admin" || user?.role === "Sub Admin") &&
                isselected ? (
                  <button
                    className=" p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white"
                    onClick={addClick}
                  >
                    Add +
                  </button>
                ) : (
                  <></>
                )}

                <div className="flex flex-row flex-1 items-end justify-end gap-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-black rounded-md px-4 py-1"
                  >
                    <option value="">Filter by Category</option>

                    {filterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="border border-black rounded-md px-4 py-1"
                    />

                    {searchTerm && filteredSuggestions.length > 0 && (
                      <div className="absolute bg-white border w-full z-50 shadow-md">
                        {filteredSuggestions.map((item) => (
                          <div
                            key={item}
                            onClick={() => setSearchTerm(item)}
                            className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSearch}
                    className=" p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {isselected ? (
              <div className="flex flex-col  px-4 py-8">
                <div className="overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="px-6 py-4 text-left font-semibold">
                          मुकदमा अपराध संख्या
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Accused Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Criminal Type
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          धारा
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          पुलिस स्टेशन
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          ज़िला
                        </th>
                        <th className="px-6 py-4 text-center font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {rowsToDisplay.map((row, index) => (
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
                          <td className="px-6 py-2 font-medium">
                            {row["मुकदमा अपराध संख्या"]}
                          </td>

                          <td className="px-6 py-2">{row["Accused Name"]}</td>

                          <td className="px-6 py-2">{row["Criminal_type"]}</td>

                          <td className="px-6 py-2">{row["धारा"]}</td>

                          <td className="px-6 py-2">{row["पुलिस स्टेशन"]}</td>

                          <td className="px-6 py-2">{row["ज़िला"]}</td>

                          <td className="px-6 py-2 text-center">
                            {user?.role != "पैरोकार" ? (
                              <button
                                className="
                  p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
                "
                                onClick={() => handleClick(row["Accused_id"])}
                              >
                                More
                              </button>
                            ) : (
                              <button
                                className="
                  p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
                "
                                onClick={() =>
                                  editClick(row["मुकदमा अपराध संख्या"])
                                }
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full px-4 py-8  ">
                <div className=" rounded-2xl border border-gray-300 bg-white shadow-lg overflow-x-auto">
                  <table className="w-full text-sm ">
                    <thead>
                      <tr className="bg-gray-900 text-white whitespace-nowrap">
                        <th className="px-6 py-4 text-left font-semibold">
                          मुकदमा अपराध संख्या
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Case Number
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Bailer Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Father Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Address
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Case Date
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Case Status
                        </th>

                        <th className="px-20 py-4 text-left font-semibold">
                          Case Remark
                        </th>
                        {user?.role != "पैरोकार" ? (
                          <th className="px-6 py-4 text-left font-semibold">
                            Actions
                          </th>
                        ) : (
                          <></>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {rowsToDisplay.map((row, index) => (
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
                          <td className="px-6 py-2 font-medium">
                            {row["मुकदमा अपराध संख्या"]}
                          </td>
                          <td className="px-6 py-2">{row["Case Number"]}</td>

                          <td className="px-6 py-2">{row["Bailer Name"]}</td>

                          <td className="px-6 py-2">{row["Father Name"]}</td>

                          <td className="px-6 py-2">{row["Address"]}</td>

                          <td className="px-6 py-2">{row["Case Date"]}</td>

                          <td className="px-6 py-2">{row["Case Status"]}</td>
                          <td className="px-6 py-2">{row["Case Remark"]}</td>
                          {user?.role != "पैरोकार" ? (
                            <td className="px-6 py-2">
                              <button
                                className="
                  p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
                "
                                onClick={() =>
                                  bailersClick(row["मुकदमा अपराध संख्या"])
                                }
                              >
                                More
                              </button>
                            </td>
                          ) : (
                            <> </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dataview;
