import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCLCDetails as getApplicationById,
  updateCLCStatus as updateApplicationStatus,
} from "../../api/admin.js";

import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Loader2 } from "lucide-react";

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

// --- Helper: Address ---
const formatAddress = (a) => {
  if (!a) return "N/A";
  return `VILL/AT- ${a.village || ""}, PO- ${a.postOffice || ""}, PS- ${
    a.policeStation || ""
  }, DIST.- ${a.district || ""}, STATE- ${a.state || ""}, PIN- ${
    a.pinCode || ""
  }`;
};

// --- Helper: Rupee text ---
const numberToWords = (num) => {
  if (num === 2) return "Two Rupees Only";
  if (!num) return "N/A";
  return `${Number(num).toFixed(2)} Only`;
};

export default function CLCPrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ Fetch
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getApplicationById(id);
        setApplication(data);
        setNotes(data?.notes ?? "");
      } catch (err) {
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const changeStatus = async (status) => {
    try {
      setSaving(true);
      const data = await updateApplicationStatus(id, { status, notes });
      setApplication(data);
      alert("Status Updated");
    } catch (err) {
      alert("Error updating status");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!application)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Not found
      </div>
    );

  const app = application;
  const stud = application.student ?? {};

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div
        id="print-container"
        className="bg-white p-6 rounded-lg shadow border border-gray-900"
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
          Application-cum-Fee Receipt
        </h4>

        {/* ✅ STATUS */}
        <div className="text-center mb-4">
          <span className="rounded px-3 py-1 text-sm bg-yellow-200 border">
            Status: {app.status}
          </span>
        </div>

        {/* ✅ ---- TABLE ---- */}
        <div className="border ">
          <table className="w-full text-sm border-collapse">
            <tbody>
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
                  {app.fatherName}
                </td>
              </tr>

              <tr className="border border-black">
                <th className="p-2 font-semibold border border-black">
                  Mother&apos;s Name
                </th>
                <td className="p-2 border border-black" colSpan={3}>
                  {app.motherName}
                </td>
              </tr>

              <tr className="border border-black">
                <th className="p-2 font-semibold border border-black">Class</th>
                <td className="p-2 border border-black" colSpan={3}>
                  {app.course}
                </td>
              </tr>

              {/* More rows SAME as Student UI */}
              {/* ------- YOU ALREADY HAVE THIS ---- KEEP AS IS ----- */}

              <tr className="border border-black">
                <th className="p-2 font-semibold border border-black">
                  Address
                </th>
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
            CLC Application Form अप्लाई करने के बाद 3 कार्य दिवस के उपरांत
            महाविद्यालय आ कर CLC प्राप्त कर लें।
          </p>
        </div>
      </div>

      {/* ✅ ADMIN ACTIONS */}
      <div className="mt-8 space-y-4 no-print">
        <Textarea
          placeholder="Add notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex gap-3 flex-wrap">
          <Button onClick={handlePrint} className="bg-green-600 text-white">
            Print
          </Button>

          <Button
            onClick={() => changeStatus("approved")}
            disabled={saving}
            className="bg-blue-600 text-white"
          >
            {saving ? <Loader2 className="animate-spin" /> : "Mark Approved"}
          </Button>

          <Button
            onClick={() => changeStatus("printed")}
            disabled={saving}
            className="bg-indigo-600 text-white"
          >
            {saving ? <Loader2 className="animate-spin" /> : "Mark Printed"}
          </Button>

          <Button
            onClick={() => navigate("/admin/clc/list")}
            className="bg-gray-500"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
