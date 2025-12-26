import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCLCStats } from "@/store/adminAuthSlice";
import { Loader2 } from "lucide-react";


export default function CLCDashboard() {
  const dispatch = useDispatch();
  const { stats, statsStatus } = useSelector((s) => s.adminAuth);

  useEffect(() => {
    dispatch(getCLCStats());
  }, [dispatch]);

  if (statsStatus === "loading") {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  const Box = ({ title, rows }) => (
    <div className="border shadow-sm rounded-md overflow-hidden bg-white max-w-[500px] w-full">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white text-center">
            <th colSpan={2} className="py-2 font-semibold text-sm">
              {title}
            </th>
          </tr>

          <tr className="bg-blue-600 text-white text-sm">
            <th className="py-2 border-r border-white w-[65%]">course</th>
            <th className="py-2 w-[35%]">Count</th>
          </tr>
        </thead>

        <tbody>
          {rows?.map((r, i) => (
            <tr
              key={i}
              className={`
                text-sm
                ${r.total ? "bg-gray-700 text-white font-bold" : i % 2 === 0 ? "bg-gray-100" : "bg-white"}
                border-b
              `}
            >
              <td className="px-3 py-2">{r.course}</td>
              <td className="px-3 py-2 text-center">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-6xl w-full bg-white p-6 rounded-md border">
        <h2 className="text-xl font-bold mb-4">Dashboard CLC</h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
          <Box
            title="CLC Apply Status"
            rows={[
              { course: "B.A.", value: stats?.baApply },
              { course: "B.Sc.", value: stats?.bscApply },
              { course: "I.Sc", value: stats?.iscApply },
              {
                course: "Total Apply CLC",
                value: stats?.applied,
                total: true,
              },
            ]}
          />

          <Box
            title="CLC Approve Status"
            rows={[
              { course: "B.A.", value: stats?.baApprove },
              { course: "B.Sc.", value: stats?.bscApprove },
              { course: "I.Sc", value: stats?.iscApprove },
              {
                course: "Total Approve CLC",
                value: stats?.approved,
                total: true,
              },
            ]}
          />

          <Box
            title="Character Apply Status"
            rows={[
              { course: "B.A.", value: stats?.baCharApply },
              { course: "B.Sc.", value: stats?.bscCharApply },
              {
                course: "Total Apply Character",
                value: stats?.charApplied,
                total: true,
              },
            ]}
          />

          <Box
            title="Character Approve Status"
            rows={[
              { course: "B.A.", value: stats?.baCharApprove },
              { course: "B.Sc.", value: stats?.bscCharApprove },
              {
                course: "Total Approve Character",
                value: stats?.charApproved,
                total: true,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
