import React, { useEffect, useState } from "react";
import { getCLCStats } from "@/api/admin.js";
import { Loader2 } from "lucide-react";

export default function CLCDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const data = await getCLCStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  const Box = ({ title, rows }) => (
    <div className="border shadow-md rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th colSpan={2} className="text-center py-2">
              {title}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="px-4 py-2">{r.class}</td>
              <td className="px-4 py-2 text-center">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dashboard CLC</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Box
          title="CLC Apply Status"
          rows={[
            { class: "B.A.", value: stats?.baApply },
            { class: "B.Sc.", value: stats?.bscApply },
            { class: "I.Sc", value: stats?.iscApply },
            { class: "Total Apply", value: stats?.applied },
          ]}
        />

        <Box
          title="CLC Approve Status"
          rows={[
            { class: "B.A.", value: stats?.baApprove },
            { class: "B.Sc.", value: stats?.bscApprove },
            { class: "I.Sc", value: stats?.iscApprove },
            { class: "Total Approve", value: stats?.approved },
          ]}
        />

        <Box
          title="Character Apply Status"
          rows={[
            { class: "B.A.", value: stats?.baCharApply },
            { class: "B.Sc.", value: stats?.bscCharApply },
            { class: "Total Apply", value: stats?.charApplied },
          ]}
        />

        <Box
          title="Character Approve Status"
          rows={[
            { class: "B.A.", value: stats?.baCharApprove },
            { class: "B.Sc.", value: stats?.bscCharApprove },
            { class: "Total Approve", value: stats?.charApproved },
          ]}
        />
      </div>
    </div>
  );
}
