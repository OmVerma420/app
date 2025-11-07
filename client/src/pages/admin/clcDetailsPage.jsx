// src/pages/admin/CLCDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString() : "N/A";

export default function CLCDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchApp = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/applications/${id}`);
      setApplication(res.data?.data);
      setNotes(res.data?.data?.notes || "");
    } catch (err) {
      console.error("error fetching", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
    // eslint-disable-next-line
  }, [id]);

  const updateStatus = async (status) => {
    setStatusLoading(true);
    try {
      await api.put(`/admin/applications/${id}/status`, {
        status,
        notes,
      });
      await fetchApp();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );

  if (!application)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Not found
      </div>
    );

  const stud = application.student ?? {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CLC Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* HEADER INFO */}
          <div className="flex justify-between text-sm">
            <div>
              <div className="font-semibold">
                Ref ID: {stud.referenceId}
              </div>
              <div>Student: {stud.studentName}</div>
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded text-white text-xs ${
                  application.status === "printed"
                    ? "bg-green-600"
                    : application.status === "approved"
                    ? "bg-blue-600"
                    : "bg-gray-500"
                }`}
              >
                {application.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* TABLE */}
          <div className="border border-black">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border border-black">
                  <th className="border p-2 w-[30%]">Student Name</th>
                  <td className="border p-2" colSpan={3}>
                    {stud.studentName}
                  </td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Father&apos;s Name</th>
                  <td className="border p-2" colSpan={3}>
                    {application.fatherName}
                  </td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Mother&apos;s Name</th>
                  <td className="border p-2" colSpan={3}>
                    {application.motherName}
                  </td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Course</th>
                  <td className="border p-2">{application.course}</td>
                  <th className="border p-2">Roll No</th>
                  <td className="border p-2">{application.classRollNo}</td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Session</th>
                  <td className="border p-2">{application.session}</td>
                  <th className="border p-2">Exam Roll No</th>
                  <td className="border p-2">{application.examRollNo}</td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Registration No</th>
                  <td className="border p-2">{application.registrationNo}</td>
                  <th className="border p-2">Reg Year</th>
                  <td className="border p-2">
                    {application.registrationYear}
                  </td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Exam Type</th>
                  <td className="border p-2">{application.examType}</td>
                  <th className="border p-2">Result</th>
                  <td className="border p-2">{application.resultStatus}</td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Passing Year</th>
                  <td className="border p-2">{application.passingYear}</td>
                  <th className="border p-2">Grade</th>
                  <td className="border p-2">
                    {application.passingDivisionGrade}
                  </td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Board/University</th>
                  <td className="border p-2" colSpan={3}>
                    {application.boardUnivName}
                  </td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Mobile No</th>
                  <td className="border p-2">{application.mobileNumber}</td>
                  <th className="border p-2">Email</th>
                  <td className="border p-2">{application.email}</td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Address</th>
                  <td className="border p-2" colSpan={3}>
                    {application.address?.village},{" "}
                    {application.address?.postOffice},{" "}
                    {application.address?.policeStation},{" "}
                    {application.address?.district},{" "}
                    {application.address?.state} -
                    {application.address?.pinCode}
                  </td>
                </tr>

                {/* Payment */}
                <tr className="border border-black">
                  <th className="border p-2">Payment ID</th>
                  <td className="border p-2">{application.paymentId}</td>
                  <th className="border p-2">Payment</th>
                  <td className="border p-2">
                    ₹{application.paymentAmount}
                  </td>
                </tr>

                <tr className="border border-black">
                  <th className="border p-2">Applied On</th>
                  <td className="border p-2">
                    {formatDate(application.createdAt)}
                  </td>
                  <th className="border p-2">Payment Date</th>
                  <td className="border p-2">
                    {formatDate(application.paymentDate)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ✅ Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* ✅ Buttons */}
          <div className="flex gap-3">
            <Button
              disabled={statusLoading}
              onClick={() => updateStatus("approved")}
            >
              {statusLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Mark Approved"
              )}
            </Button>

            <Button
              disabled={statusLoading}
              onClick={() => updateStatus("printed")}
              className="bg-green-600 hover:bg-green-700"
            >
              {statusLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Mark Printed"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
