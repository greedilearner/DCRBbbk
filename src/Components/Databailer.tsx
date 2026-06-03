import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Arrow from "../assets/arrow";
import { useAuth } from "../AuthContext.tsx";
const Databailer = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  const [accused, setAccused] = useState<any>(null);
  const { accusedId } = useParams();
  const [accusedid, setAccusedid] = useState<number | null>(null);

  const navigate = useNavigate();
  async function fetchData() {
    try {
      let response;

      response = await fetch(
        `http://localhost:8787/crime/${encodeURIComponent(accusedId ?? "")}`,
      );

      const data = await response.json();
      console.log(data);

      const accusedRecord = data.data?.[0];

      setAccused(accusedRecord);
      setAccusedid(accusedRecord?.Accused_id);
      console.log(accusedRecord);
      setFormData((prev) => ({
        ...prev,
        Accused_id: accusedRecord?.Accused_id ?? null,
        "मुकदमा अपराध संख्या": accusedRecord?.["मुकदमा अपराध संख्या"] ?? "",
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const handelClick = () => {
    navigate(`/Records`);
  };
  const [formData, setFormData] = useState({
    "Case Number": "",
    "Bailer Name": "",
    "Case Status": "",
    "Father Name": "",
    Address: "",
    "Case Date": "",
    "Case Remark": "",
    "मुकदमा अपराध संख्या": "",
    Accused_id: null as number | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:8787/addCourt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Record Saved");
      console.log(result);

      setFormData({
        "Case Number": "",
        "मुकदमा अपराध संख्या": accusedId ?? "",
        "Bailer Name": "",
        "Case Status": "",
        "Father Name": "",
        Address: "",
        "Case Date": "",
        "Case Remark": "",
        Accused_id: accusedid,
      });
    } else {
      alert(result.error || "Failed to save");
    }
  };

  useEffect(() => {
    fetchData();
  }, [accusedId]);

  return (
    <>
      {" "}
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
          <div className="flex flex-row w-full bg-white justify-items-center gap-5 border border-black p-4">
            <div className="flex flex-1 flex-row gap-10 p-4 ">
              <div className="flex-1/2 flex-col justify-between items-center ">
                <div className="flex flex-row ">
                  <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                    <p>Name :</p>
                    <p>{accused?.["Accused Name"]}</p>
                  </div>
                  <div className="flex flex-1 flex-row gap-10 p-4 justify-items-center">
                    <p>मुकदमा अपराध संख्या :</p>
                    <p>{accused?.["मुकदमा अपराध संख्या"]}</p>
                  </div>
                </div>

                <div className="flex flex-row ">
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
          </div>
          <form onSubmit={handleSubmit}>
            <div className="border border-black p-4">
              <div className="grid grid-cols-2 gap-6">
                <input
                  name="Case Number"
                  value={formData["Case Number"]}
                  onChange={handleChange}
                  placeholder="Case Number"
                  className="border border-black p-2 rounded"
                />

                <input
                  name="Bailer Name"
                  value={formData["Bailer Name"]}
                  onChange={handleChange}
                  placeholder="Bailer Name"
                  className="border border-black p-2 rounded"
                />

                <select
                  name="Case Status"
                  value={formData["Case Status"]}
                  onChange={handleChange}
                  className="border border-black p-2 rounded"
                >
                  <option value="">Case Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Convicted">Convicted</option>
                  <option value="Acquitted">Acquitted</option>
                </select>

                <input
                  name="Father Name"
                  value={formData["Father Name"]}
                  onChange={handleChange}
                  placeholder="Father Name"
                  className="border border-black p-2 rounded"
                />

                <input
                  name="Address"
                  value={formData["Address"]}
                  onChange={handleChange}
                  placeholder="Address"
                  className="border border-black p-2 rounded"
                />

                <input
                  type="date"
                  name="Case Date"
                  value={formData["Case Date"]}
                  onChange={handleChange}
                  className="w-full border border-black p-2 rounded"
                />
              </div>

              <textarea
                name="Case Remark"
                value={formData["Case Remark"]}
                onChange={handleChange}
                rows={3}
                placeholder="Case Remark"
                className="w-full border border-black p-2 rounded mt-4"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="reset"
                className="border border-black px-6 py-2 rounded"
                onClick={() =>
                  setFormData({
                    "Case Number": "",
                    "Bailer Name": "",
                    "Case Status": "",
                    "Father Name": "",
                    Address: "",
                    "मुकदमा अपराध संख्या": accusedId ?? "",
                    "Case Date": "",
                    "Case Remark": "",
                    Accused_id: accusedid,
                  })
                }
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
        </div>
      </section>
    </>
  );
};

export default Databailer;
