// ✅ src/api/admin.js
import api from "./axios";

// ✅ DASHBOARD STATS
export const getCLCStats = async () => {
  const res = await api.get("/admin/clc/stats");
  return res.data?.data;
};

// ✅ LIST CLC APPLICATIONS
// optional filters → { page, limit, startDate, endDate, status, q }
export const getCLCList = async (params = {}) => {
  const res = await api.get("/admin/applications", { params });
  return res.data?.data;
};

// ✅ SEARCH CLC BY REFERENCE ID
export const searchCLC = async (referenceId) => {
  const res = await api.get("/admin/applications/search", {
    params: { referenceId },
  });
  return res.data?.data;
};

// ✅ GET FULL DETAILS BY APPLICATION ID
export const getCLCDetails = async (id) => {
  const res = await api.get(`/admin/applications/${id}`);
  return res.data?.data;
};

// ✅ UPDATE STATUS (applied → approved → printed)
export const updateCLCStatus = async (id, body) => {
  // body = { status: "approved", notes: "OK" }
  const res = await api.put(`/admin/applications/${id}/status`, body);
  return res.data?.data;
};
