import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCLCDetails } from "@/api/admin";
import logoimg from "../../assets/logoimg.jpeg";
import { updateApplicationStatus } from "../../api/admin";
import { useDispatch } from "react-redux";
import { getCLCStats } from "../../store/adminAuthSlice";



const formatDate = (d) => {
  const x = new Date(d);
  return `${String(x.getDate()).padStart(2, "0")}-${String(
    x.getMonth() + 1
  ).padStart(2, "0")}-${x.getFullYear()}`;
};

// Dynamic underline
const UnderValue = ({ value = "" }) => (
  <div className="inline-flex flex-col items-start">
    <span className="font-semibold">{value}</span>
    <span
      className="border-b border-dotted border-black"
      style={{
        width: `${(value.length || 6) * 10}px`,
        maxWidth: "150px",
        marginTop: "-2px",
      }}
    ></span>
  </div>
);

export default function CLCPrintPage2() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const data = await getCLCDetails(id);
      setApp(data);
    })();
  }, [id]);

const handlePrint = async () => {
  try {
    // FIRST TIME PRINT
    if (app.status === "applied") {
      await updateApplicationStatus(id, { status: "approved" });
      await updateApplicationStatus(id, { status: "printed" });
      setApp(prev => ({ ...prev, status: "printed" }));
    }

    // SECOND TIME PRINT
    if (app.status === "printed") {
      console.log("Already printed");
    }

    // 🚀 REFRESH DASHBOARD
await dispatch(getCLCStats());

    window.print();
  } catch (err) {
    console.error("Print error:", err);
  }
};






  if (!app) return <p>Loading...</p>;

  const stud = app.student || {};
  const resultWord =
    app.resultStatus?.toLowerCase() === "pass" ? "passed" : "failed";

  return (
    <div className="w-full p-4 print:p-0">

      {/* PRINT FIX */}
      <style>
{`
 @media print {
    body { margin: 0 !important; padding: 0 !important; }

    #print-area {
      position: absolute;
      top: 0; left: 0;
      width: 100%;

      display: flex;
      justify-content: center;
      gap: 4px; /* bring certificates a little closer */

      transform: scale(0.70);   /* FINAL PERFECT FIT */
      transform-origin: top center;
    }

    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
 }
`}
</style>




      {/* PRINT AREA */}
      <div
  id="print-area"
  className="flex justify-center gap-2"
>
  {["OFFICE COPY", "STUDENT COPY"].map((copyType, i) => (
    <div
      key={i}
      className="px-3 py-2 text-[14px] font-serif leading-tight"

      style={{
        width: "460px",  // FITS PERFECTLY
        border: "none",  // NO BORDER
      }}
    >

      <div className="text-center leading-tight">
        <img src={logoimg} className="w-14 h-14 mx-auto" />
        <h1 className="text-lg font-bold">Gorelal Mehta College, Banmankhi</h1>
        <p>(A Constituent Unit of Purnea University, Purnia)</p>
        <p>Purnia, Bihar - 854202 (INDIA)</p>
        <p>Website: www.glmcollege.ac.in | Email: glmclg@purneau.ac.in</p>

        <h2 className="text-base font-bold underline mt-2">
          COLLEGE LEAVING CERTIFICATE
        </h2>
        <p className="text-xs">(Not in Lieu of Transfer Certificate)</p>
      </div>

      <div className="flex justify-between mt-3">
        <p>No.- GLMC/I/01</p>

        {copyType === "OFFICE COPY" && (
          <span className="px-2 py-0.5 border border-black bg-gray-200 text-xs">
            OFFICE COPY
          </span>
        )}

        <p>Date: {formatDate(new Date())}</p>
      </div>


      {/* --- BODY --- */}
      <div className="mt-4 space-y-2">

        <div className="h-[24px] flex items-center">
          Name of the Student:&nbsp; <UnderValue value={stud.studentName} />
        </div>

        <div className="h-[28px] flex items-center">
          Mother's Name:&nbsp; <UnderValue value={app.motherName} />
        </div>

        <div className="h-[28px] flex items-center">
          Father's Name:&nbsp; <UnderValue value={app.fatherName} />
        </div>

        <div className="h-[28px] flex items-center">
          Address:&nbsp; <UnderValue value={app.address?.village} />
        </div>

        <div className="h-[28px] flex items-center">
          <div style={{ width: "220px" }}>
            P.O.: <UnderValue value={app.address?.postOffice} />
          </div>

          <div style={{ width: "220px" }}>
            P.S.: <UnderValue value={app.address?.policeStation} />
          </div>
        </div>

        <div className="h-[28px] flex items-center">
          <div style={{ width: "220px" }}>
            Dist.: <UnderValue value={app.address?.district} />
          </div>

          <div style={{ width: "220px" }}>
            State: <UnderValue value={app.address?.state} />
          </div>
        </div>

        <div className="h-[28px] flex items-center">
          Class:&nbsp; <UnderValue value={app.course} />
        </div>

        <div className="h-[28px] flex items-center">
          <div style={{ width: "220px" }}>
            Class Roll No.: <UnderValue value={app.classRollNo} />
          </div>

          <div style={{ width: "220px" }}>
            Exam Roll No.: <UnderValue value={app.examRollNo} />
          </div>
        </div>

        <div className="h-[28px] flex items-center">
          <div style={{ width: "220px" }}>
            Session: <UnderValue value={app.session} />
          </div>

          <div style={{ width: "220px" }}>
            Reg. No.: <UnderValue value={app.registrationNo} />
          </div>
        </div>

        <div className="h-[28px] flex items-center gap-2">
          He/She has <UnderValue value={resultWord} /> the examination of{" "}
          <UnderValue value={app.passingYear} />
        </div>

        <div>
          Remarks if any:
          <div
            className="border-b border-black h-5 mt-1"
            style={{ width: "240px" }}
          ></div>
        </div>

      </div>

      <div className="flex justify-between mt-8 font-medium">
        <p>Assistant</p>
        <p>Head Assistant</p>
        <p>Principal</p>
      </div>

      {copyType === "OFFICE COPY" && (
  <div className="mt-2 leading-none" style={{ marginTop: "4px" }}>
    <p className="font-semibold text-[11px] leading-none" style={{ margin: 0, padding: 0 }}>
      Signature of Recipient (with date)
    </p>
  </div>

)}


    </div>
  ))}
</div>


      {/* PRINT BUTTON */}
      <div className="no-print mt-6 text-center">
        <button
  onClick={handlePrint}
  className="bg-green-600 text-white px-10 py-3 rounded-md text-lg"
>
  Print Certificates
</button>

      </div>
    </div>
  );
}
