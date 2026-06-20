import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useEffect } from "react";
import { useAuth } from "../AuthContext.tsx";
import Navbar from "../Components/navbar.tsx";

type UserRow = Record<string, any>;

const Adminpanel = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  const [users, setUsers] = useState<UserRow[]>([]);
  const API_URL = import.meta.env.PROD
    ? "https://backend.aryanss1417.workers.dev"
    : "http://localhost:8787";

  async function fetchUsers() {
    try {
      let response;

      response = await fetch(`${API_URL}/user`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch users (${response.status})`);
      }

      const data = await response.json();
      console.log(data);
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const getUserName = (row: UserRow) =>
    row["Name"] ?? row["name"] ?? row["Full Name"] ?? row["username"] ?? "";

  const getPoliceStation = (row: UserRow) =>
    row["Police Station"] ?? row["police_station"] ?? row["PoliceStation"] ?? "";

  const handleClick = async (Email: string, status: string) => {
    const userData = {
      status: status === "Allow" ? true : false,
      Email: Email,
    };
    const response = await fetch(`${API_URL}/allow`, {
      credentials: "include",

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      setUsers((prev) => prev.filter((user) => user["Email"] !== Email));
    }
    console.log(result);
  };

  return (
    <>
      <div className="min-w-screen bg black">
        <Navbar background="bg-black" frame="relative" />

        {/* main sectoin of page */}

        <section className="flex flex-row w-full min-h-screen bg-gray-200">
          {/* // table section */}

          <div className="flex flex-col w-full min-h-screen bg-gray-200 ">
            <div>
              <div className="flex flex-row w-full max-h-[20vh] gap-4 px-4 py-10 items-center justify-between ">
                <p className="text-4xl font-bold text-gray-800">Admin Panel</p>
              </div>
              <div className=" w-full  flex flex-row justify-between  px-8">
                <div className="flex flex-row flex-1 items-end justify-end gap-2">
                  <select className="border border-black rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Filter by Police Station</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Search..."
                    className="border border-black rounded-md px-4 text-black py-1"
                  />
                  <button
                    className=" p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full px-[30vh] py-8  ">
              <div className=" rounded-2xl border border-gray-300 bg-white shadow-lg overflow-x-auto">
                <table className=" table-fixed w-full text-sm ">
                  <thead>
                    <tr className="bg-gray-900 text-white whitespace-nowrap">
                      <th className="px-3 py-4 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-3 py-4 text-left font-semibold">
                        Police Station
                      </th>
                      <th className="px-3 py-4 text-left font-semibold">
                        Role
                      </th>
                      <th className="px-3    py-4 text-left font-semibold">
                        Email
                      </th>

                      <th className="px-4 py-4 text-center font-semibold">
                        Accecpt
                      </th>
                      <th className="px-4 py-4 text-center font-semibold">
                        reject
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((row, index) => (
                      <tr
                        key={index}
                        className="
              border-b
              border-gray-200
              transition-all
              duration-150
              text-left
              text-black
               hover:bg-gray-200 cursor-pointer 
            "
                      >
                        <td className="px-3 text:left  py-2 ">{getUserName(row)}</td>
                        <td className="px-3 text:left py-2">
                          {getPoliceStation(row)}
                        </td>
                        <td className="px-3 text:left py-2">{row["role"]}</td>
                        <td className="px-3 text:left py-2">{row["Email"]}</td>
                        <td className="px-3 text:left py-2 text-center">
                          <button
                            className="
                  p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
                "
                            onClick={() => handleClick(row["Email"], "Allow")}
                          >
                            Allow
                          </button>
                        </td>
                        <td className="px-6 py-2 text-center">
                          <button
                            className="
                  p-1 bg-linear-to-r tracking-wider  from-[#fd3fb3] to-[#fd3e4f] text-white 
    hover:ring-2 hover:ring-white
                "
                            onClick={() => handleClick(row["Email"], "Reject")}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Adminpanel;
