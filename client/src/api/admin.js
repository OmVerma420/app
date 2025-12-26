import api from "./axios";

/* ---------------------------------------------------
   APPROVE CLC (OLD SYSTEM)
----------------------------------------------------*/
export const approveCLC = async (id) => {
  const res = await api.patch(`/admin/clc/approve/${id}`);
  return res.data;
};

/* ---------------------------------------------------
   SEARCH BY REFERENCE ID
----------------------------------------------------*/
export const searchCLC = async (referenceId) => {
  const res = await api.get(`/admin/applications/search`, {
    params: { referenceId },
  });
  return res.data?.data;
};

/* ---------------------------------------------------
   FILTER BY DATE RANGE
----------------------------------------------------*/
export const getCLCByDate = async (startDate, endDate) => {
  const res = await api.get(`/admin/applications`, {
    params: { startDate, endDate },
  });
  return res.data?.data?.docs ?? [];
};

/* ---------------------------------------------------
   FETCH ONE CLC FULL DETAILS
----------------------------------------------------*/
export const getCLCDetails = async (id) => {
  const res = await api.get(`/admin/applications/${id}`);
  return res.data?.data;
};

/* ---------------------------------------------------
   UPDATE STATUS (approved / printed)
----------------------------------------------------*/
export const updateApplicationStatus = async (id, body) => {
  const res = await api.put(`/admin/applications/${id}/status`, body);
  return res.data?.data;
};

/* ---------------------------------------------------
   GET DASHBOARD STATS (Applied / Approved)
----------------------------------------------------*/
export const getCLCStats = async () => {
  const res = await api.get(`/admin/clc/stats`);
  return res.data?.data;
};
