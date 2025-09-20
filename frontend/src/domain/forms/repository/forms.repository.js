// import { http } from "@/utils/request";

// export const formsRepo = {
//   create: (payload) => http.post("/forms", payload),                  // { title, data?, type? }
//   updateDraft: (id, payload) => http.patch(`/forms/${id}`, payload),  // { title?, data?, type? }
//   submit: (id) => http.post(`/forms/${id}/submit`),
//   review: (id, action) => http.post(`/forms/${id}/review`, { action }), // "approve" | "reject"
//   list: (query) => http.get("/forms", query),                   // { status?, mine? }
//   get: (id) => http.get(`/forms/${id}`),
//   remove: (id) => http.delete(`/forms/${id}`),
// };


import { http } from "@/utils/request";

export const formsRepo = {
  create: (payload) => http.post("/forms", payload),                        // {title, type?, ...}
  updateDraft: (id, payload) => http.patch(`/forms/${id}`, payload),        // {data, title?}
  submit: (id) => http.post(`/forms/${id}/submit`),                         // status: draft -> toReview
  review: (id, action) => http.post(`/forms/${id}/review`, { action }),     // action: "approve"|"reject"
  list: (query) => http.get("/forms", query),                               // {status, mine}
  get: (id) => http.get(`/forms/${id}`),
  remove: (id) => http.delete(`/forms/${id}`),
};

export default formsRepo;
