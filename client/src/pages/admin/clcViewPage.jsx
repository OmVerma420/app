import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCLCDetails,
  updateCLCStatus
} from "../../api/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CLCViewPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetching CLC details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCLCDetails(id);
        setApplication(res);
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Update CLC status
  const handleUpdateStatus = async (status) => {
    try {
      await updateCLCStatus(id, { status, notes });
      alert("Status updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!application) return <p>No application found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">CLC Application Details</h1>

      <div className="bg-white shadow rounded p-4 space-y-2">
        <p><strong>Name:</strong> {application?.name}</p>
        <p><strong>Course:</strong> {application?.course}</p>
        <p><strong>Roll No:</strong> {application?.rollNo}</p>
        <p><strong>Status:</strong> {application?.status}</p>

        {/* Add more details as needed */}
      </div>

      <div className="my-4">
        <label className="font-medium">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter remarks / notes"
        />
      </div>

      <div className="flex gap-4 mt-4">
        <Button onClick={() => handleUpdateStatus("approved")}>Approve</Button>
        <Button variant="destructive" onClick={() => handleUpdateStatus("rejected")}>
          Reject
        </Button>
      </div>
    </div>
  );
}
