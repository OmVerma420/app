// src/pages/admin/CLCPrintPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCLCDetails } from "@/api/admin";

const formatDate = (s) => {
  if (!s) return "";
  const d = new Date(s);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

const formatAddress = (a) => {
  if (!a) return "";
  return `VILL/AT - ${a.village || ""}, PO-${a.postOffice || ""}, PS-${
    a.policeStation || ""
  }, DIST.-${a.district || ""}, STATE-${a.state || ""}, PIN-${a.pinCode || ""}`;
};

export default function CLCPrintPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getCLCDetails(id);
      setApp(data);
    })();
  }, [id]);

  if (!app) return <p>Loading...</p>;

  const stud = app.student ?? {};

  return (
    <div className="w-full max-w-5xl mx-auto p-4 print:p-0 print:m-0">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute; inset: 0; width: 100%; margin: 0; padding: 0;
          }
          .no-print { display: none !important; }
          table, th, td { border: 1px solid #000 !important; }
        }
      `}</style>

      <div id="print-area" className="text-sm leading-tight">
        {/* Header */}
        <div className="text-center mb-4">
          <img
            src="https://glmcollege.ac.in/assets/images/logo.png"
            alt="logo"
            className="w-24 h-24 mx-auto"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="text-2xl font-bold text-blue-900">
            GORELAL MEHTA COLLEGE, BANMANKHI, PURNEA
          </h1>
          <p className="text-sm">(A Constituent Unit of Purnea University, Purnia (Bihar))</p>
        </div>

        <h2 className="text-xl font-semibold text-center">College Leaving Certificate</h2>
        <h3 className="text-md font-semibold text-center mb-4">
          Application cum Fee Receipt (Student Copy)
        </h3>

        {/* OUTER BIG BOX */}
        <div className="border border-black">
          {/* BOX 1: Certificate details */}
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <th className="border p-2 w-[25%]">Reference Id</th>
                <td className="border p-2">{stud.referenceId}</td>
                <th className="border p-2">Apply Date</th>
                <td className="border p-2">{formatDate(app.createdAt)}</td>
              </tr>
              <tr>
                <th className="border p-2">Student Name</th>
                <td className="border p-2" colSpan={3}>{stud.studentName}</td>
              </tr>
              <tr>
                <th className="border p-2">Father's Name</th>
                <td className="border p-2" colSpan={3}>{app.fatherName}</td>
              </tr>
              <tr>
                <th className="border p-2">Mother's Name</th>
                <td className="border p-2" colSpan={3}>{app.motherName}</td>
              </tr>
              <tr>
                <th className="border p-2">Course</th>
                <td className="border p-2" colSpan={3}>{app.course}</td>
              </tr>
              <tr>
                <th className="border p-2">Class Roll No.</th>
                <td className="border p-2">{app.classRollNo}</td>
                <th className="border p-2">Session</th>
                <td className="border p-2">{app.session}</td>
              </tr>
              <tr>
                <th className="border p-2">Exam Roll No.</th>
                <td className="border p-2">{app.examRollNo}</td>
                <th className="border p-2">Registration No.</th>
                <td className="border p-2">{app.registrationNo}</td>
              </tr>
              <tr>
                <th className="border p-2">Registration Year</th>
                <td className="border p-2">{app.registrationYear}</td>
                <th className="border p-2">Exam Type</th>
                <td className="border p-2">{app.examType}</td>
              </tr>
              <tr>
                <th className="border p-2">Result Status</th>
                <td className="border p-2">{app.resultStatus}</td>
                <th className="border p-2">Passing Year</th>
                <td className="border p-2">{app.passingYear}</td>
              </tr>
              <tr>
                <th className="border p-2">Passing Division/Grade</th>
                <td className="border p-2" colSpan={3}>{app.passingDivisionGrade}</td>
              </tr>
              <tr>
                <th className="border p-2">Board / Univ. Name</th>
                <td className="border p-2" colSpan={3}>{app.boardUnivName}</td>
              </tr>
              <tr>
                <th className="border p-2">Mobile Number</th>
                <td className="border p-2">{app.mobileNumber}</td>
                <th className="border p-2">Email ID</th>
                <td className="border p-2">{app.email}</td>
              </tr>
              <tr>
                <th className="border p-2">Payment Id</th>
                <td className="border p-2">{app.paymentId}</td>
                <th className="border p-2">Date</th>
                <td className="border p-2">{formatDate(app.paymentDate)}</td>
              </tr>
              <tr>
                <th className="border p-2">Total Amount</th>
                <td className="border p-2">₹{app.paymentAmount}</td>
                <th className="border p-2">Payment Mode</th>
                <td className="border p-2">{app.paymentMode}</td>
              </tr>
              <tr>
                <th className="border p-2">Address</th>
                <td className="border p-2" colSpan={3}>{formatAddress(app.address)}</td>
              </tr>
            </tbody>
          </table>

          {/* EXACT CENTERED TITLE BETWEEN BOXES */}
          <div className="border-t border-black">
            <div className="text-center font-semibold py-2">
              NO DUES
            </div>

            {/* BOX 2: No-Dues table */}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Signature & Date</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Signature & Date</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">1. Library</td><td className="border p-2"></td><td className="border p-2">6. Common Room</td><td className="border p-2"></td></tr>
                <tr><td className="border p-2">2. Physics</td><td className="border p-2"></td><td className="border p-2">7. Sports</td><td className="border p-2"></td></tr>
                <tr><td className="border p-2">3. Chemistry</td><td className="border p-2"></td><td className="border p-2">8. NCC</td><td className="border p-2"></td></tr>
                <tr><td className="border p-2">4. Botany</td><td className="border p-2"></td><td className="border p-2">9. NSS</td><td className="border p-2"></td></tr>
                <tr><td className="border p-2">5. Zoology</td><td className="border p-2"></td><td className="border p-2">10. Examination</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature footer */}
        <div className="mt-10 text-right pr-4">
          <p>Signature of College Authority</p>
        </div>
      </div>

      {/* Print button (hidden in print) */}
      <div className="no-print text-center mt-6">
        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-8 py-3 rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
}
