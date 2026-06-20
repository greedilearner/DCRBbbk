import { useEffect, useState } from "react";
import Arrow from "../assets/arrow";
import { useAuth } from "../AuthContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";
const Dataentery = () => {
  const { user } = useAuth();
  const { accusedId } = useParams();
  const isEditMode = Boolean(accusedId);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  const API_URL = import.meta.env.PROD
    ? `https://backend.aryanss1417.workers.dev`
    : `http://localhost:8787`;
  const [formData, setFormData] = useState({
    Name: "",
    "पिता का नाम": "",
    पता: "",
    "गाँव/मोहल्ला": "",
    "पुलिस स्टेशन": "",
    ज़िला: "",
    "सत्यापन विवरण": "",
    Criminal_type: "",
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
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (!isEditMode || !accusedId) {
      return;
    }

    const fetchAccused = async () => {
      try {
        const response = await fetch(`${API_URL}/Accused/${accusedId}`, {
          credentials: "include",
        });
        const result = await response.json();
        const accused = result.data?.[0];

        if (!response.ok || !accused) {
          alert(result.error || "Failed to load record");
          return;
        }

        setFormData({
          Name: accused["Accused Name"] || "",
          "पिता का नाम": accused["पिता का नाम"] || "",
          पता: accused["पता"] || "",
          "गाँव/मोहल्ला": accused["गाँव/मोहल्ला"] || "",
          "पुलिस स्टेशन": accused["पुलिस स्टेशन"] || "",
          ज़िला: accused["ज़िला"] || "",
          "सत्यापन विवरण": accused["सत्यापन विवरण"] || "",
          Criminal_type: accused["Criminal Type"] || "",
        });
      } catch (error) {
        console.error("Error fetching accused:", error);
        alert("Failed to load record");
      }
    };

    fetchAccused();
  }, [API_URL, accusedId, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract unique criminal types from the crime history table
    const criminalTypesFromHistory = Array.from(
      new Set(
        criminalHistory
          .filter((c) => c.Criminal_type && c.Criminal_type.trim() !== "")
          .map((c) => c.Criminal_type.trim()),
      ),
    );

    // Create comma-separated string
    const criminalTypesString = criminalTypesFromHistory.join(", ");

    const payload = {
      ...formData,
      criminalHistory: criminalHistory.filter((c) => c["Crime No."]), // Only send non-empty history records
      Criminal_type: criminalTypesString,
    };

    const requestBody = new FormData();
    requestBody.append("payload", JSON.stringify(payload));

    if (photo) {
      requestBody.append("photo", photo);
    }

    const response = await fetch(
      isEditMode
        ? `${API_URL}/updateaccused/${accusedId}`
        : `${API_URL}/addaccused`,
      {
        credentials: "include",
        method: isEditMode ? "PUT" : "POST",
        body: requestBody,
      },
    );

    const result = await response.json();

    if (response.ok) {
      alert(isEditMode ? "Record Updated" : "Record Saved");
      console.log(result);

      if (isEditMode && accusedId) {
        navigate(`/Personal_info/${accusedId}`);
        return;
      }

      setFormData({
        Name: "",
        "पिता का नाम": "",
        पता: "",
        "गाँव/मोहल्ला": "",
        "पुलिस स्टेशन": "",
        ज़िला: "",
        "सत्यापन विवरण": "",
        Criminal_type: "",
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
      setPhoto(null);
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
          <p>{isEditMode ? "Edit Accused Detail" : "Accused Detail"}</p>
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
      <section className="bg-gray-300 px-4 py-6 min-h-screen print:bg-white print:px-0 print:py-0">
        <form
          onSubmit={handleSubmit}
          className="shadow-black flex flex-col rounded-md font-bold font-serif text-black bg-white min-h-screen w-full max-w-212.5 mx-auto p-4 gap-6 overflow-hidden print:max-w-198.5 print:mx-auto print:shadow-none print:border print:border-black print:min-h-280"
        >
          {/* PERSONAL INFORMATION */}
          <div>
            <p className="font-bold text-lg mb-3">Personal Information</p>

            <div className="flex flex-col gap-4 border border-black p-4 md:flex-row md:gap-3">
              {/* Photo Upload */}
              <div className="w-full max-w-45 h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center p-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />

                <label htmlFor="photo-upload" className="cursor-pointer">
                  {photo ? (
                    photo.name
                  ) : (
                    <>
                      Upload
                      <br />
                      Photo
                    </>
                  )}
                </label>
              </div>

              <div className="hidden md:block w-px bg-black" />

              <div className="flex flex-1 flex-col gap-4 md:flex-row md:gap-6">
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
                    <label className="text-left">Name :</label>
                    <input
                      type="text"
                      value={formData["Name"]}
                      onChange={(e) =>
                        setFormData({ ...formData, Name: e.target.value })
                      }
                      className="flex-1 min-w-0 border border-black p-2 rounded"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
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
                      className="flex-1 min-w-0 border border-black p-2 rounded"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-start md:gap-4">
                    <label className="text-left">modus operandi:</label>
                    <textarea
                      rows={3}
                      value={formData["पता"]}
                      onChange={(e) =>
                        setFormData({ ...formData, पता: e.target.value })
                      }
                      className="flex-1 min-w-0 border border-black p-2 rounded"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
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
                      className="flex-1 min-w-0 border border-black p-2 rounded"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
                    <label className="text-left">पुलिस स्टेशन :</label>
                    <select
                      value={formData["पुलिस स्टेशन"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          "पुलिस स्टेशन": e.target.value,
                        })
                      }
                      className="flex-1 min-w-0 border border-black p-2 rounded"
                    >
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
                      <option> मसौली</option>
                      <option>रामसनेहीघाट</option>
                      <option>टिकैत नगर</option>
                      <option>दरियाबाद</option>
                      <option> असन्द्रा</option>
                      <option>हैदरगढ</option>
                      <option> लोनीकटरा</option>
                      <option>कोठी</option>
                      <option>सुबेहा</option>
                      <option>सफदरगंज</option>
                      <option>जैदपुर</option>
                      <option>सतरिख</option>
                      <option>माती</option>
                      <option>other</option>
                    </select>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
                    <label className="text-left">ज़िला :</label>
                    <input
                      type="text"
                      value={formData["ज़िला"]}
                      onChange={(e) =>
                        setFormData({ ...formData, ज़िला: e.target.value })
                      }
                      className="flex-1 min-w-0 border border-black p-2 rounded"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
                    <label className="text-left">सत्यापन विवरण :</label>
                    <select
                      value={formData["सत्यापन विवरण"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          "सत्यापन विवरण": e.target.value,
                        })
                      }
                      className="min-w-0 border border-black p-2 rounded"
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
            <div className="flex flex-col gap-3 justify-between items-start mb-3 md:flex-row md:items-center">
              <p className="font-bold text-lg">Criminal History Table</p>

              <button
                type="button"
                onClick={addCriminalHistory}
                className="bg-black text-white px-4 py-2 rounded"
              >
                + Add Row
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-black">
              <table className="min-w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="p-3 border wrap-break-word whitespace-normal">
                      मुकदमा अपराध संख्या
                    </th>
                    <th className="p-3 border wrap-break-word whitespace-normal">
                      धारा
                    </th>
                    <th className="p-3 border wrap-break-word whitespace-normal">
                      पुलिस स्टेशन
                    </th>
                    <th className="p-3 border wrap-break-word whitespace-normal">
                      ज़िला
                    </th>
                    <th className="p-3 border wrap-break-word whitespace-normal">
                      Criminal Type
                    </th>
                    <th className="p-3 border wrap-break-word whitespace-normal">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {criminalHistory.map((history, idx) => (
                    <tr key={idx}>
                      <td className="border p-2 wrap-break-word whitespace-normal">
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
                          className="min-w-0 border p-2 rounded"
                          placeholder="Crime No."
                        />
                      </td>

                      <td className="border p-2 wrap-break-word whitespace-normal">
                        <input
                          type="text"
                          value={history["धारा"]}
                          onChange={(e) =>
                            updateCriminalHistory(idx, "धारा", e.target.value)
                          }
                          className="min-w-0 border p-2 rounded"
                          placeholder="धारा"
                        />
                      </td>

                      <td className="border p-2 wrap-break-word whitespace-normal">
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
                          className="min-w-0 border p-2 rounded"
                          placeholder="पुलिस स्टेशन"
                        />
                      </td>

                      <td className="border p-2 wrap-break-word whitespace-normal">
                        <input
                          type="text"
                          value={history["ज़िला"]}
                          onChange={(e) =>
                            updateCriminalHistory(idx, "ज़िला", e.target.value)
                          }
                          className="min-w-0 border p-2 rounded"
                          placeholder="ज़िला"
                        />
                      </td>
                      <td className="border p-2 wrap-break-word whitespace-normal">
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
                          className="min-w-0 border p-2 rounded"
                          placeholder="Criminal Type"
                        />
                      </td>

                      <td className="border p-2 text-center wrap-break-word whitespace-normal">
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
                  Criminal_type: "",
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
