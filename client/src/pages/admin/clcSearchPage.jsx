import React, { useState } from "react";
import { searchCLC } from "@/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function CLCSearchPage() {
  const navigate = useNavigate();
  const [referenceId, setReferenceId] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!referenceId.trim()) return;

    try {
      const results = await searchCLC(referenceId.trim());
      setData(results ?? []);
      setError(results?.length === 0 ? "No record found" : "");
    } catch {
      setData([]);
      setError("No record found");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-6xl w-full bg-white p-6 rounded-md">

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6">CLC Search</h2>

        {/* Search Box */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <label className="font-medium whitespace-nowrap">
            Reference Id<span className="text-red-600">*</span>
          </label>

          <Input
            className="w-64"
            placeholder="Enter Reference ID"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
          />

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Results */}
        {data.length > 0 && (
          <div className="border rounded-md shadow-sm p-4 overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto text-sm border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-100 font-medium">
                  <th className="border p-2">Reference</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Father's Name</th>
                  <th className="border p-2">Mobile</th>
                  <th className="border p-2">Course</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((r) => (
                  <tr key={r._id} className="text-center even:bg-gray-50">
                    <td className="border p-2">{r.student.referenceId}</td>
                    <td className="border p-2 text-left">{r.student.studentName}</td>
                    <td className="border p-2 text-left">{r.fatherName}</td>
                    <td className="border p-2">{r.mobileNumber}</td>
                    <td className="border p-2">{r.course}</td>

                    <td className="border p-2 text-center">
                      <td className="border p-2 text-center">
  {r.status === "printed" ? (
    <span className="text-red-600 font-semibold">Printed</span>
  ) : (
    <Button
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 text-white"
      onClick={() => navigate(`/admin/clc2/${r._id}`)}
    >
      View / Print
    </Button>
  )}
</td>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
