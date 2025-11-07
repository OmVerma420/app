import React, { useState } from "react";
import api from "../../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CLCSearchPage() {
  const [refId, setRefId] = useState("");
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!refId.trim()) {
      setError("Reference ID is required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.get(`/admin/applications/search`, {
        params: { referenceId: refId },
      });

      setApps(res?.data?.data ?? []);
    } catch {
      setApps([]);
      setError("No record found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-xl font-semibold">CLC Search</h1>

      <div className="flex gap-3 max-w-xl">
        <Input
          placeholder="Enter Reference ID"
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* TABLE */}
      {apps.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Reference</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Father's Name</th>
                <th className="border p-2">Mobile</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {apps?.map((app) => (
                <tr key={app._id}>
                  <td className="border p-2">{app.student?.referenceId}</td>
                  <td className="border p-2">{app.student?.studentName}</td>
                  <td className="border p-2">{app.fatherName}</td>
                  <td className="border p-2">{app.mobileNumber}</td>
                  <td className="border p-2">{app.course}</td>
                  <td className="border p-2 text-red-600 font-semibold">
                    {app.status === "printed" ? "Printed" : app.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
