// src/pages/admin/CLCListPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function CLCListPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  // filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [status, setStatus] = useState(""); // applied | approved | printed

  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/applications", {
        params: {
          page,
          limit,
          startDate,
          endDate,
          q: searchQ,
          status,
        },
      });

      setApps(res.data?.data?.docs || []);
      setTotal(res.data?.data?.total || 0);
    } catch (err) {
      console.error("Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchData();
  };

  return (
    <div className="w-full space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>CLC Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ✅ Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">

            {/* Start Date */}
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Search */}
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Reference ID / Exam Roll"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="border rounded p-2 w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="applied">Applied</option>
                <option value="approved">Approved</option>
                <option value="printed">Printed</option>
              </select>
            </div>

            {/* Button */}
            <div className="flex items-end">
              <Button className="w-full" onClick={handleFilter}>
                Filter
              </Button>
            </div>
          </div>

          {/* ✅ Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr className="border">
                  <th className="p-2 border">Ref ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Course</th>
                  <th className="p-2 border">Applied On</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">View</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  apps?.map((a) => (
                    <tr key={a._id} className="border">
                      <td className="p-2 border">{a.student?.referenceId}</td>
                      <td className="p-2 border">{a.student?.studentName}</td>
                      <td className="p-2 border">{a.course}</td>
                      <td className="p-2 border">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>

                      {/* status badge */}
                      <td className="p-2 border">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs ${
                            a.status === "printed"
                              ? "bg-green-600"
                              : a.status === "approved"
                              ? "bg-blue-600"
                              : "bg-gray-500"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      <td className="p-2 border text-center">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/applications/${a._id}`)
                          }
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}

                {loading && (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      <Loader2 className="animate-spin inline-block" /> Loading
                      ...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <span>
              Page {page} of {Math.ceil(total / limit)}
            </span>

            <Button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
