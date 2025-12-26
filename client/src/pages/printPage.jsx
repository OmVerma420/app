import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// --- Helper: Format date as DD-MM-YYYY ---
const formatDate = (s) => {
  if (!s) return "N/A";
  try {
    const d = new Date(s);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  } catch {
    return "Invalid Date";
  }
};

// --- Helper: Combine address nicely ---
const formatAddress = (a) => {
  if (!a) return "N/A";
  return `VILL/AT- ${a.village || ""}, PO- ${a.postOffice || ""}, PS- ${
    a.policeStation || ""
  }, DIST.- ${a.district || ""}, STATE- ${a.state || ""}, PIN- ${a.pinCode || ""}`;
};

// --- Helper: Rupee text ---
const numberToWords = (num) => {
  if (num === 2) return "Two Rupees Only";
  if (!num) return "N/A";
  return `${Number(num).toFixed(2)} Only`;
};

export default function PrintPage() {
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ fetch data
  useEffect(() => {
    let mounted = true;
    const fetchApp = async () => {
      try {
        setLoading(true);
        const resp = await api.get("/applications/my-application");
        if (mounted) setApplication(resp.data?.data ?? null);
      } catch (err) {
        if (mounted)
          setError(
            err?.response?.data?.message || "Failed to load application data."
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchApp();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ print logic
  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = `
        @media print {
          body * { visibility: hidden !important; }
          #print-container, #print-container * { visibility: visible !important; }
          #print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0.5in;
            border: none !important;
            box-shadow: none !important;
          }
          table, th, td {
            border-color: #000 !important;
            font-size: 10pt !important;
          }
        }
      `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Application Receipt...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl text-red-600">Error</h1>
        <p>{error}</p>
        <button
          onClick={() => navigate("/apply")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Go to Application
        </button>
      </div>
    );

  if (!application)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl">No Application Found</h1>
        <button
          onClick={() => navigate("/apply")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Apply Now
        </button>
      </div>
    );

  const app = application;
  const stud = application.student ?? {};

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div
        id="print-container"
        className="bg-white p-6 rounded-lg shadow  border-gray-900"
      >
        {/* ---- HEADER ---- */}
        <div className="text-center mb-4">
          <img
            src="https://glmcollege.ac.in/assets/images/logo.png"
            alt="logo"
            className="w-24 h-24 mx-auto"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="text-2xl font-semibold mt-2 text-blue-900">
            GORELAL MEHTA COLLEGE, BANMANKHI, PURNEA
          </h1>
          <p className="text-sm text-gray-700">
            (A Constituent Unit of Purnea University, Purnia (Bihar))
          </p>
        </div>

        <h3 className="text-xl font-semibold text-center mb-1">
          College Leaving Certificate
        </h3>
        <h4 className="text-lg font-semibold text-center mb-4">
          Application-cum-Fee Receipt (Student Copy)
        </h4>

        {/* ✅ ---- TABLE ---- */}
        {/* ✅ ---- TABLE ---- */}
<div className="border ">
  <table className="w-full text-sm border-collapse">
    <tbody>
      {/* First line */}
      <tr className="border border-black">
        <th className="p-2 font-semibold w-[30%] border border-black">
          Reference Id
        </th>
        <td className="p-2 border border-black">{stud.referenceId}</td>
        <th className="p-2 font-semibold w-[20%] border border-black">
          Apply Date
        </th>
        <td className="p-2 border border-black">
          {formatDate(app.createdAt)}
        </td>
      </tr>
        


      {/* FULL WIDTH */}
      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Student Name
        </th>
        <td className="p-2 border border-black" colSpan={3}>
          {stud.studentName}
        </td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Father&apos;s Name
        </th>
        <td className="p-2 border border-black" colSpan={3}>
          {stud.fatherName}
        </td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Mother&apos;s Name
        </th>
        <td className="p-2 border border-black" colSpan={3}>
          {stud.motherName}
        </td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">course</th>
        <td className="p-2 border border-black" colSpan={3}>
          {app.course}
        </td>
      </tr>

      {/* 2-column Rows */}
      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Class Roll No.
        </th>
        <td className="p-2 border border-black">{app.classRollNo}</td>
        <th className="p-2 font-semibold border border-black">Session</th>
        <td className="p-2 border border-black">{app.session}</td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Exam Roll No.
        </th>
        <td className="p-2 border border-black">{app.examRollNo}</td>
        <th className="p-2 font-semibold border border-black">
          Registration No.
        </th>
        <td className="p-2 border border-black">{app.registrationNo}</td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Registration Year
        </th>
        <td className="p-2 border border-black">{app.registrationYear}</td>
        <th className="p-2 font-semibold border border-black">
          Exam Type
        </th>
        <td className="p-2 border border-black">{app.examType}</td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Result Status
        </th>
        <td className="p-2 border border-black">{app.resultStatus}</td>
        <th className="p-2 font-semibold border border-black">
          Passing Year
        </th>
        <td className="p-2 border border-black">{app.passingYear}</td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Division/Grade
        </th>
        <td className="p-2 border border-black" colSpan={3}>
          {app.passingDivisionGrade}
        </td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Board/University Name
        </th>
        <td className="p-2 border border-black" colSpan={3}>
          {app.boardUnivName}
        </td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Mobile Number
        </th>
        <td className="p-2 border border-black">{app.mobileNumber}</td>
        <th className="p-2 font-semibold border border-black">Email Id</th>
        <td className="p-2 border border-black">{app.email}</td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Payment Id
        </th>
        <td className="p-2 border border-black">{app.paymentId}</td>
        <th className="p-2 font-semibold border border-black">
          Payment Date
        </th>
        <td className="p-2 border border-black">
          {formatDate(app.paymentDate)}
        </td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">
          Total Amount
        </th>
        <td className="p-2 border border-black">
          ₹
          {app.paymentAmount
            ? Number(app.paymentAmount).toFixed(2)
            : "N/A"}{" "}
          <span className="text-xs italic">
            ({numberToWords(app.paymentAmount)})
          </span>
        </td>
        <th className="p-2 font-semibold border border-black">Payment Mode</th>
        <td className="p-2 border border-black">{app.paymentMode}</td>
      </tr>

      <tr className="border border-black">
        <th className="p-2 font-semibold border border-black">Address</th>
        <td className="p-2 border border-black" colSpan={3}>
          {formatAddress(app.address)}
        </td>
      </tr>
    </tbody>
  </table>
</div>


        {/* NOTE */}
        <div className="mt-6 text-sm">
          <p>
            <strong>Note: </strong>
            CLC Application Form अप्लाई करने के बाद 3 कार्य दिवस के उपरांत महाविद्यालय आ कर CLC प्राप्त कर लें।
          </p>
          <p className="mt-4 text-center font-semibold">
            This Application-cum-Fee Receipt is computer generated and does not
            require physical signature.
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 no-print">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded transition"
        >
          Print Application
        </button>

        <button
          onClick={() => navigate("/apply?edit=true")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded transition"
        >
          Edit Application
        </button>
      </div>
    </div>
  );
}
