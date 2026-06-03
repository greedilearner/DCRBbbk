import { useState } from "react";
import Arrow from "../assets/arrow";
import { useAuth } from "../AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
const Dataentery = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const [formData, setFormData] = useState({
    Name: "",
    "पिता का नाम": "",
    पता: "",
    "गाँव/मोहल्ला": "",
    "पुलिस स्टेशन": "",
    ज़िला: "",
    "सत्यापन विवरण": "",
  });

  const [criminalHistory, setCriminalHistory] = useState([
    {
      "Crime No.": "",
      धारा: "",
      "पुलिस स्टेशन": "",
      ज़िला: "",
      Criminal_type: "",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:8787/addaccused`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        criminalHistory: criminalHistory.filter((c) => c["Crime No."]), // Only send non-empty history records
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Record Saved");
      console.log(result);

      setFormData({
        Name: "",
        "पिता का नाम": "",
        पता: "",
        "गाँव/मोहल्ला": "",
        "पुलिस स्टेशन": "",
        ज़िला: "",
        "सत्यापन विवरण": "",
      });

      setCriminalHistory([
        {
          "Crime No.": "",
          धारा: "",
          "पुलिस स्टेशन": "",
          ज़िला: "",
          Criminal_type: "",
        },
      ]);
    } else {
      alert(result.error || "Failed to save");
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Records`);
  };

  // Criminal History management functions
  const addCriminalHistory = () => {
    setCriminalHistory([
      ...criminalHistory,
      {
        "Crime No.": "",
        धारा: "",
        "पुलिस स्टेशन": "",
        ज़िला: "",
        Criminal_type: "",
      },
    ]);
  };

  const removeCriminalHistory = (index: number) => {
    setCriminalHistory(criminalHistory.filter((_, i) => i !== index));
  };

  const updateCriminalHistory = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...criminalHistory];
    updated[index] = { ...updated[index], [field]: value };
    setCriminalHistory(updated);
  };
  return (
    <>
      <nav className="flex flex-row bg-black w-full top-0 print:hidden ">
        <div className="p-4 text-black" onClick={handleClick}>
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
        <form
          onSubmit={handleSubmit}
          className="shadow-black flex flex-col rounded-md font-bold font-serif text-black bg-white min-h-screen w-full p-4 gap-6"
        >
          {/* PERSONAL INFORMATION */}
          <div>
            <p className="font-bold text-lg mb-3">Personal Information</p>

            <div className="flex flex-row w-full gap-3 border border-black p-4">
              {/* Photo Upload */}
              <div className="w-40 h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center p-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />

                <label htmlFor="photo-upload" className="cursor-pointer">
                  Upload
                  <br />
                  Photo
                </label>
              </div>

              <div className="w-px bg-black" />

              <div className="flex flex-1 flex-row gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <label className="text-left">Name :</label>
                    <input
                      type="text"
                      value={formData["Name"]}
                      onChange={(e) =>
                        setFormData({ ...formData, Name: e.target.value })
                      }
                      className="flex-1 border border-black p-2 rounded"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-left">पिता का नाम :</label>
                    <input
                      type="text"
                      value={formData["पिता का नाम"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          "पिता का नाम": e.target.value,
                        })
                      }
                      className="flex-1 border border-black p-2 rounded"
                    />
                  </div>

                  <div className="flex items-start gap-4">
                    <label className="text-left">पता :</label>
                    <textarea
                      rows={3}
                      value={formData["पता"]}
                      onChange={(e) =>
                        setFormData({ ...formData, पता: e.target.value })
                      }
                      className="flex-1 border border-black p-2 rounded"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <label className="text-left">गाँव/मोहल्ला :</label>
                    <input
                      type="text"
                      value={formData["गाँव/मोहल्ला"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          "गाँव/मोहल्ला": e.target.value,
                        })
                      }
                      className="flex-1 border border-black p-2 rounded"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-left">पुलिस स्टेशन :</label>
                    <input
                      type="text"
                      value={formData["पुलिस स्टेशन"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          "पुलिस स्टेशन": e.target.value,
                        })
                      }
                      className="flex-1 border border-black p-2 rounded"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-left">ज़िला :</label>
                    <input
                      type="text"
                      value={formData["ज़िला"]}
                      onChange={(e) =>
                        setFormData({ ...formData, ज़िला: e.target.value })
                      }
                      className="flex-1 border border-black p-2 rounded"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-left">सत्यापन विवरण :</label>
                    <select
                      value={formData["सत्यापन विवरण"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          "सत्यापन विवरण": e.target.value,
                        })
                      }
                      className="border border-black p-2 rounded"
                    >
                      <option>choose option</option>
                      <option>जेल</option>
                      <option>लापता</option>
                      <option>जमानत</option>
                      <option>मृत</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CRIMINAL RECORD */}

          {/* CRIMINAL HISTORY TABLE */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-lg">Criminal History Table</p>

              <button
                type="button"
                onClick={addCriminalHistory}
                className="bg-black text-white px-4 py-2 rounded"
              >
                + Add Row
              </button>
            </div>

            <table className="w-full border border-black overflow-y-auto">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="p-3 border">मुकदमा अपराध संख्या</th>
                  <th className="p-3 border">धारा</th>
                  <th className="p-3 border">पुलिस स्टेशन</th>
                  <th className="p-3 border">ज़िला</th>
                  <th className="p-3 border">Criminal Type</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {criminalHistory.map((history, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={history["Crime No."]}
                        onChange={(e) =>
                          updateCriminalHistory(
                            idx,
                            "Crime No.",
                            e.target.value,
                          )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Crime No."
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        type="text"
                        value={history["धारा"]}
                        onChange={(e) =>
                          updateCriminalHistory(idx, "धारा", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                        placeholder="धारा"
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        type="text"
                        value={history["पुलिस स्टेशन"]}
                        onChange={(e) =>
                          updateCriminalHistory(
                            idx,
                            "पुलिस स्टेशन",
                            e.target.value,
                          )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="पुलिस स्टेशन"
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        type="text"
                        value={history["ज़िला"]}
                        onChange={(e) =>
                          updateCriminalHistory(idx, "ज़िला", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                        placeholder="ज़िला"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={history["Criminal_type"]}
                        onChange={(e) =>
                          updateCriminalHistory(
                            idx,
                            "Criminal_type",
                            e.target.value,
                          )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Criminal Type"
                      />
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCriminalHistory(idx)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="reset"
              onClick={() =>
                setFormData({
                  Name: "",
                  "पिता का नाम": "",
                  पता: "",
                  "गाँव/मोहल्ला": "",
                  "पुलिस स्टेशन": "",
                  ज़िला: "",
                  "सत्यापन विवरण": "",
                })
              }
              className="border border-black px-6 py-2 rounded"
            >
              Reset
            </button>

            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded"
            >
              Save Record
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Dataentery;
