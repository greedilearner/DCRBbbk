import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext.tsx";
import Navbar from "../Components/navbar.tsx";
const Dataview = () => {
  const { user } = useAuth();

  async function findPending() {
    try {
      console.log(user.police_station);
      const response = await fetch(
        `${API_URL}/pending/${user.police_station}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      console.log(data);
      setPending(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";

  const [bailers, setBailers] = useState([]);
  const [courtRecords, setCourtRecords] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [isselected, setisselected] = useState<"criminal" | "bailer" | "court">(
    "criminal",
  );
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getActiveData = () => {
    switch (isselected) {
      case "criminal":
        return rows;
      case "bailer":
        return bailers;
      case "court":
        if (user.role != "पैरोकार") {
          return courtRecords;
        } else {
          return pending;
        }

      default:
        return [];
    }
  };
  const activeData = getActiveData();

  const getFilterOptions = () => {
    switch (isselected) {
      case "criminal":
        return [
          "Accused Name",
          "Criminal_type",
          "धारा",
          "पुलिस स्टेशन",
          "ज़िला",
          "मुकदमा अपराध संख्या",
        ];
      case "bailer":
        return [
          "Bailer Name",
          "मुकदमा अपराध संख्या",
          "Father Name",
          "Case Number",
          "Case Date",
          "Case Status",
        ];
      case "court":
        return [
          "Date",
          "मुकदमा अपराध संख्या",
          "Status",
          "Remark",
          "PoliceStation",
          "Accused_status",
        ];
      default:
        return [];
    }
  };
  const filterOptions = getFilterOptions();
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
  const editClick = (id: string, page: string, crimeid: string) => {
    navigate(
      `/Databailer/${encodeURIComponent(id)}/${page}/${encodeURIComponent(crimeid)}`,
    );
  };
  async function fetchBailers() {
    try {
      let response;
      if (user?.role != "Admin") {
        response = await fetch(`${API_URL}/bailer/${user?.police_station}`, {
          credentials: "include",
        });
      } else {
        response = await fetch(`${API_URL}/bailer`, {
          credentials: "include",
        });
      }

      const data = await response.json();
      console.log(data);
      setBailers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchCourtRecords() {
    try {
      let response;

      response = await fetch(
        `${API_URL}/court_records/${user?.police_station}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();
      console.log(data);
      setCourtRecords(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching court records:", error);
    }
  }
  async function fetchData() {
    try {
      let response;
      if (user?.role != "Admin") {
        response = await fetch(`${API_URL}/crimes/${user?.police_station}`, {
          credentials: "include",
        });
      } else {
        response = await fetch(`${API_URL}/crime`, {
          credentials: "include",
        });
      }
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
    fetchCourtRecords();
    if (
      user.role === "पैरोकार" ||
      user.role === "Admin" ||
      user.role === "sub Admin"
    ) {
      findPending();
    }
    // Reset search and filter states on tab switch
    setSearchTerm("");
    setSelectedFilter("");
    setSearched(false);
    setFilteredRows([]);
  }, [isselected]);
  return (
    <>
      {/* //navbar */}
      <div className="min-w-screen bg black">
        <Navbar background="bg-black" frame="relative" />
        {/* main sectoin of page */}

        <section className="flex flex-row w-full min-h-screen bg-gray-200">
          {/* // side nav bar */}

          <nav className="flex flex-col  z min-h-screen text-black  cursor-pointer border border-r-white/20 bg-white/10 backdrop-blur-2xl shadow-xl whitespace-nowrap  shadow-black ">
            <p
              className={`pt-10 text-lg cursor-pointer px-3 ${
                isselected === "criminal"
                  ? "bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] shadow-md shadow-black text-white "
                  : "hover:border-b hover:border-black "
              }`}
              onClick={() => {
                setisselected("criminal");
              }}
            >
              Criminal reconds
            </p>
            <p
              className={`pt-10 text-lg cursor-pointer px-3 ${
                isselected === "bailer"
                  ? "bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] shadow-md shadow-black text-white"
                  : "hover:border-b hover:border-black"
              }`}
              onClick={() => {
                setisselected("bailer");
              }}
            >
              Bailer Records
            </p>
            <p
              className={`pt-10 text-lg cursor-pointer px-3 ${
                isselected === "court"
                  ? "bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] shadow-md shadow-black text-white"
                  : "hover:border-b hover:border-black"
              }`}
              onClick={() => {
                setisselected("court");
              }}
            >
              Court Data
            </p>
          </nav>

          {/* // table section */}

          <div className="flex flex-col w-full min-h-screen bg-gray-200 ">
            <div>
              <div className="flex flex-row w-full max-h-[20vh] gap-4 px-4 py-10 items-center justify-between ">
                {(() => {
                  switch (isselected) {
                    case "criminal":
                      return (
                        <p className="text-4xl font-bold text-gray-800 ">
                          Criminal Records
                        </p>
                      );
                    case "bailer":
                      return (
                        <p className="text-4xl font-bold text-gray-800">
                          Bailer Records
                        </p>
                      );
                    case "court":
                      return (
                        <p className="text-4xl font-bold text-gray-800">
                          Court Data
                        </p>
                      );
                    default:
                      return null;
                  }
                })()}
              </div>
              <div className=" w-full  flex flex-row justify-between gap-2  px-8">
                {(user?.role === "Admin" || user?.role === "Sub Admin") &&
                isselected === "criminal" ? (
                  <button
                    className=" p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] shadow-md shadow-black text-white 
    hover:ring-2 hover:ring-white"
                    onClick={addClick}
                  >
                    Add +
                  </button>
                ) : (
                  <></>
                )}
                <div className="flex flex-row rounded-md items-start p-2 border border-white bg-white text-black">
                  <p>Pending Enter :</p>
                  <p>{pending.length}</p>
                </div>
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

            {(() => {
              switch (isselected) {
                case "criminal":
                  return (
                    <div className="flex flex-col  px-4 py-8">
                      <div className="overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-lg">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-900 text-white">
                              <th className="px-6 py-4 text-left font-semibold">
                                Crime Number
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
                              {user?.role === "पैरोकार" ? (
                                <>
                                  {" "}
                                  <th className="px-6 py-4 text-center font-semibold">
                                    Add Bailer
                                  </th>{" "}
                                  <th className="px-6 py-4 text-center font-semibold">
                                    Add Court
                                  </th>
                                </>
                              ) : (
                                <>
                                  <th className="px-6 py-4 text-center font-semibold">
                                    Action
                                  </th>
                                </>
                              )}
                            </tr>
                          </thead>
                          {rows ? (
                            <tbody>
                              {rowsToDisplay.map((row, index) => {
                                const isPending = pending.some(
                                  (item) =>
                                    item["मुकदमा अपराध संख्या"]?.trim() ===
                                    row["मुकदमा अपराध संख्या"]?.trim(),
                                );
                                console.log(
                                  row["मुकदमा अपराध संख्या"],
                                  isPending,
                                );
                                return (
                                  <tr
                                    key={index}
                                    className={`border-b border-gray-200 transition-all text-left duration-150 cursor-pointer ${
                                      isPending
                                        ? "bg-red-400 text-black hover:bg-red-200"
                                        : " hover:bg-gray-200"
                                    }`}
                                  >
                                    <td className="px-6 py-2 font-medium">
                                      {row["मुकदमा अपराध संख्या"]}
                                    </td>

                                    <td className="px-6 py-2">
                                      {row["Accused Name"]}
                                    </td>

                                    <td className="px-6 py-2">
                                      {row["Criminal_type"]}
                                    </td>

                                    <td className="px-6 py-2">{row["धारा"]}</td>

                                    <td className="px-6 py-2">
                                      {row["पुलिस स्टेशन"]}
                                    </td>

                                    <td className="px-6 py-2">
                                      {row["ज़िला"]}
                                    </td>

                                    {user?.role != "पैरोकार" ? (
                                      <>
                                        <td className="px-6 py-2 text-center">
                                          {" "}
                                          <button
                                            className="
                        p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
          hover:ring-2 hover:ring-white
                      "
                                            onClick={() =>
                                              handleClick(row["Accused_id"])
                                            }
                                          >
                                            More
                                          </button>
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="px-6 py-2 text-center">
                                          <button
                                            className="
                        p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
          hover:ring-2 hover:ring-white
                      "
                                            onClick={() =>
                                              editClick(
                                                row["Accused_id"],
                                                "bailers",
                                                row["मुकदमा अपराध संख्या"],
                                              )
                                            }
                                          >
                                            Bailer
                                          </button>
                                        </td>
                                        <td className="px-6 py-2 text-center">
                                          <button
                                            className="
                        p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
          hover:ring-2 hover:ring-white
                      "
                                            onClick={() =>
                                              editClick(
                                                row["Accused_id"],
                                                "court",
                                                row["मुकदमा अपराध संख्या"],
                                              )
                                            }
                                          >
                                            Court
                                          </button>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          ) : (
                            <></>
                          )}
                        </table>
                      </div>
                    </div>
                  );
                case "bailer":
                  return (
                    <div className="flex flex-col w-full px-4 py-8  ">
                      <div className=" rounded-2xl border border-gray-300 bg-white shadow-lg overflow-x-auto">
                        <table className="w-full text-sm ">
                          <thead>
                            <tr className="bg-gray-900 text-white whitespace-nowrap">
                              <th className="px-6 py-4 text-left font-semibold">
                                Crime Number
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
                                Date
                              </th>

                              <th className="px-20 py-4 text-left font-semibold">
                                Remark
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
                            {rowsToDisplay.map((row, index) => {
                              return (
                                <tr
                                  key={index}
                                  className={`border-b border-gray-200 transition-all duration-150 cursor-pointer 
                                    hover:bg-gray-200
                                  `}
                                >
                                  <td className="px-6 py-2 font-medium">
                                    {row["मुकदमा अपराध संख्या"]}
                                  </td>
                                  <td className="px-6 py-2">
                                    {row["Case Number"]}
                                  </td>

                                  <td className="px-6 py-2">
                                    {row["Bailer Name"]}
                                  </td>

                                  <td className="px-6 py-2">
                                    {row["Father Name"]}
                                  </td>

                                  <td className="px-6 py-2">
                                    {row["Address"]}
                                  </td>

                                  <td className="px-6 py-2">
                                    {row["Case Date"]}
                                  </td>

                                  <td className="px-6 py-2">{row["Remark"]}</td>
                                  {user?.role != "पैरोकार" ? (
                                    <td className="px-6 py-2">
                                      <button
                                        className="
                        p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
          hover:ring-2 hover:ring-white
                      "
                                        onClick={() =>
                                          bailersClick(
                                            row["मुकदमा अपराध संख्या"],
                                          )
                                        }
                                      >
                                        More
                                      </button>
                                    </td>
                                  ) : (
                                    <> </>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                case "court":
                  return (
                    <div className="flex flex-col w-full px-4 py-8  ">
                      <div className=" rounded-2xl border border-gray-300 bg-white shadow-lg overflow-x-auto">
                        <table className="w-full text-sm ">
                          <thead>
                            <tr className="bg-gray-900 text-white whitespace-nowrap">
                              <th className="px-6 py-4 text-left font-semibold">
                                Date
                              </th>
                              <th className="px-6 py-4 text-left font-semibold">
                                मुकदमा अपराध संख्या
                              </th>
                              <th className="px-6 py-4 text-left font-semibold">
                                Status
                              </th>
                              <th className="px-6 py-4 text-left font-semibold">
                                Remark
                              </th>

                              <th className="px-6 py-4 text-left font-semibold">
                                Accused_status
                              </th>
                              <th className="px-6 py-4 text-left font-semibold">
                                Case Number
                              </th>

                              {user?.role === "पैरोकार" ? (
                                <>
                                  <th className="px-6 py-4 text-center font-semibold">
                                    Action
                                  </th>
                                </>
                              ) : (
                                <></>
                              )}
                            </tr>
                          </thead>

                          <tbody>
                            {rowsToDisplay.map((row, index) => {
                              return (
                                <tr
                                  key={index}
                                  className={`border-b border-gray-200 transition-all duration-150 text-left cursor-pointer 
                                    hover:bg-gray-200 ${user.role != "पैरोकार" ? "" : "bg-red-400 text-black hover:bg-red-200"}
                                  `}
                                >
                                  <td className="px-6 py-2 font-medium">
                                    {row["Date"]}
                                  </td>
                                  <td className="px-6 py-2">
                                    {row["मुकदमा अपराध संख्या"]}
                                  </td>
                                  <td className="px-6 py-2">{row["Status"]}</td>
                                  <td className="px-6 py-2">{row["Remark"]}</td>

                                  <td className="px-6 py-2">
                                    {row["Accused_status"]}
                                  </td>
                                  <td className="px-6 py-2">
                                    {row["Case Number"]}
                                  </td>
                                  {user?.role === "पैरोकार" ? (
                                    <>
                                      <td className="px-6 py-2 text-center">
                                        {" "}
                                        <button
                                          className="
                        p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
          hover:ring-2 hover:ring-white
                      "
                                          onClick={() =>
                                            editClick(
                                              row["Accused_id"],
                                              "bailers",
                                              row["मुकदमा अपराध संख्या"],
                                            )
                                          }
                                        >
                                          Update Data
                                        </button>
                                      </td>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dataview;
