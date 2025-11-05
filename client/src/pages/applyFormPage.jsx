import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificateFormSchema } from "../schema/certificateSchema";
import api from "../api/axios";
import ProgressStepper from "../components/ProgressStepper";

const FORM_STORAGE_KEY = "applyFormData";

// ✅ Reusable Input Component
const RHFInput = ({ label, path, type = "text", required = true }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = path.split(".").reduce((acc, key) => acc?.[key], errors);

  return (
    <div>
      <label htmlFor={path} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={path}
        type={type}
        {...register(path)}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
};

export default function ApplyFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState("");
  const [editMode, setEditMode] = useState(false);

  const methods = useForm({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      personalDetail: {
        fatherName: "",
        motherName: "",
        course: "",
        classRollNo: "",
        session: "",
        examRollNo: "",
        registrationNo: "",
        registrationYear: "",
        examType: "",
        resultStatus: "",
        passingYear: "",
        passingDivisionGrade: "",
        boardUnivName: "",
        mobileNumber: "",
        email: "",
      },
      address: {
        village: "",
        postOffice: "",
        policeStation: "",
        district: "",
        state: "",
        pinCode: "",
      },
      marksheet: null,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  // ✅ Detect edit mode from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("edit") === "true") setEditMode(true);
  }, [location.search]);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!student) navigate("/login", { replace: true });
  }, [student, navigate]);

  // ✅ Restore local data (if not in edit mode)
  useEffect(() => {
    if (editMode) return;
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed);
        if (parsed.preview) setPreview(parsed.preview);
      } catch (err) {
        console.error("Failed to restore saved form:", err);
      }
    }
  }, [reset, editMode]);

  // ✅ Save data to localStorage on change
  useEffect(() => {
    if (editMode) return; // don’t overwrite during edit mode
    const sub = watch((val) => {
      localStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify({ ...val, preview })
      );
    });
    return () => sub.unsubscribe();
  }, [watch, preview, editMode]);

  // ✅ Fetch application data in edit mode
  useEffect(() => {
    if (!editMode) return;

    const fetchApp = async () => {
      try {
        const res = await api.get("/applications/my-application");
        const app = res.data?.data;
        if (app) {
          reset({
            personalDetail: {
              fatherName: app.fatherName || "",
              motherName: app.motherName || "",
              course: app.course || "",
              classRollNo: app.classRollNo || "",
              session: app.session || "",
              examRollNo: app.examRollNo || "",
              registrationNo: app.registrationNo || "",
              registrationYear: app.registrationYear || "",
              examType: app.examType || "",
              resultStatus: app.resultStatus || "",
              passingYear: app.passingYear || "",
              passingDivisionGrade: app.passingDivisionGrade || "",
              boardUnivName: app.boardUnivName || "",
              mobileNumber: app.mobileNumber || "",
              email: app.email || "",
            },
            address: app.address || {},
            marksheet: null,
          });

          if (app.marksheetUrl) setPreview(app.marksheetUrl);
        }
      } catch (err) {
        console.error("Failed to load existing application:", err);
      }
    };

    fetchApp();
  }, [editMode, reset]);

  // ✅ Handle file preview
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setValue("marksheet", files, { shouldValidate: true });

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(files[0]);
  };

  // ✅ Handle Submit
  const onSubmit = async (data) => {
    if (!editMode && (!data.marksheet || data.marksheet.length === 0)) {
      alert("Please select a marksheet file.");
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(data.personalDetail).forEach(([key, value]) =>
        formData.append(key, value)
      );
      Object.entries(data.address).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (data.marksheet && data.marksheet.length > 0) {
        formData.append("marksheet", data.marksheet[0]);
      }

      if (editMode) {
        await api.put("/applications/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Application updated successfully!");
        localStorage.removeItem(FORM_STORAGE_KEY);
        navigate("/application", { replace: true }); // ✅ Fixed
      } else {
        await api.post("/applications/submit", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        localStorage.removeItem(FORM_STORAGE_KEY);
        navigate("/payment");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Form submission failed.");
    }
  };

  const personalFields = [
    { name: "fatherName", label: "Father's Name" },
    { name: "motherName", label: "Mother's Name" },
    { name: "course", label: "Course" },
    { name: "classRollNo", label: "Class Roll No." },
    { name: "session", label: "Session (e.g., 2020–2023)" },
    { name: "examRollNo", label: "Exam Roll No." },
    { name: "registrationNo", label: "Registration No." },
    { name: "registrationYear", label: "Registration Year" },
    { name: "examType", label: "Exam Type" },
    { name: "resultStatus", label: "Result Status" },
    { name: "passingYear", label: "Passing Year" },
    { name: "passingDivisionGrade", label: "Passing Division/Grade" },
    { name: "boardUnivName", label: "Board/University Name" },
    { name: "mobileNumber", label: "Mobile Number", type: "tel" },
    { name: "email", label: "Email", type: "email" },
  ];

  const addressFields = [
    { name: "village", label: "Village/AT" },
    { name: "postOffice", label: "Post Office" },
    { name: "policeStation", label: "Police Station" },
    { name: "district", label: "District" },
    { name: "state", label: "State" },
    { name: "pinCode", label: "Pin Code" },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <ProgressStepper currentStepIndex={0} />

      {editMode && (
        <div className="bg-blue-100 border border-blue-400 text-blue-800 p-3 rounded mb-4 text-center">
          ✏️ You are editing your previously submitted application
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* --- Marksheet Upload --- */}
          <section className="bg-white shadow-lg rounded-lg overflow-hidden">
            <header className="bg-blue-600 text-white p-3">
              <h2 className="text-xl font-semibold">
                Upload Final Year Marksheet
              </h2>
            </header>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="marksheet"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Final Year Marksheet <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="marksheet"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editMode}
                />
                <ul className="text-xs text-gray-500 mt-2 list-disc list-inside">
                  <li>File size: 100KB–500KB</li>
                  <li>Resolution: 200 DPI</li>
                  <li>Formats: .jpg, .jpeg, .png</li>
                </ul>
                {errors.marksheet && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.marksheet.message}
                  </p>
                )}
              </div>

              {preview && (
                <div className="flex justify-center items-center">
                  <img
                    src={preview}
                    alt="Marksheet Preview"
                    className="max-h-48 border rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </section>

          {/* --- Personal Info --- */}
          <section className="bg-white shadow-lg rounded-lg overflow-hidden">
            <header className="bg-blue-600 text-white p-3">
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </header>
            <div className="p-6 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reference ID
                </label>
                <input
                  type="text"
                  value={student?.referenceId || ""}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <input
                  type="text"
                  value={student?.studentName || ""}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>

              {personalFields.map((f) => (
                <RHFInput
                  key={f.name}
                  {...f}
                  path={`personalDetail.${f.name}`}
                />
              ))}
            </div>
          </section>

          {/* --- Address --- */}
          <section className="bg-white shadow-lg rounded-lg overflow-hidden">
            <header className="bg-blue-600 text-white p-3">
              <h2 className="text-xl font-semibold">Permanent Address</h2>
            </header>
            <div className="p-6 grid md:grid-cols-3 gap-4">
              {addressFields.map((f) => (
                <RHFInput key={f.name} {...f} path={`address.${f.name}`} />
              ))}
            </div>
          </section>

          {/* --- Submit --- */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 transition duration-150 ease-in-out"
            >
              {isSubmitting
                ? "Submitting..."
                : editMode
                ? "Update & Next"
                : "Save & Next"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
