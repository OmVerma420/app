// src/pages/admin/CLCRecordPage.jsx
import React, { useState } from "react";
import { getCLCByDate } from "@/api/admin";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CLCRecordPage() {
  const navigate = useNavigate();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [list, setList] = useState([]);

  const handleSearch = async () => {
    if (!start || !end) return;
    const results = await getCLCByDate(start, end);
    setList(results);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">

      {/* ✅ PAGE TITLE */}
      <h2 className="text-2xl font-semibold border-b pb-2">
        Apply Record (CLC)
      </h2>

      {/* ✅ DATE FILTER ROW */}
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">Start Date</label>
          <Input
            type="date"
            className="border border-gray-500 w-48"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">End Date</label>
          <Input
            type="date"
            className="border border-gray-500 w-48"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSearch}
          className="bg-blue-600 px-6 text-white font-semibold"
        >
          Submit
        </Button>
      </div>

      {/* ✅ RECORDS TABLE */}
      {list.length > 0 && (
        <>
          {/* Header info */}
          <p className="font-medium text-sm my-2">
            <strong>Total Record:</strong> {list.length}, 
            &nbsp; Date: {start} to {end}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 text-sm min-w-[900px]">

              {/* Table Header */}
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="border p-2 text-left">Slno</th>
                  <th className="border p-2 text-left">Apply Date</th>
                  <th className="border p-2 text-left">Reference Id</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Father Name</th>
                  <th className="border p-2 text-left">Class</th>
                  <th className="border p-2 text-left">Mobile No.</th>
                  <th className="border p-2 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {list.map((it, i) => (
                  <tr key={it._id}>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">
                      {new Date(it.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="border p-2">
                      {it.student.referenceId}
                    </td>
                    <td className="border p-2">
                      {it.student.studentName}
                    </td>
                    <td className="border p-2">
                      {it.fatherName}
                    </td>
                    <td className="border p-2">
                      {it.course}
                    </td>
                    <td className="border p-2">
                      {it.mobileNumber}
                    </td>
                    <td className="border p-2 text-center">
                      <Button
                        size="sm"
                        className="bg-blue-600 text-white px-4 py-1 text-sm rounded"
                        onClick={() => navigate(`/admin/clc/${it._id}`)}
                      >
                        Print No-Dues Form
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </>
      )}
    </div>
  );
}
