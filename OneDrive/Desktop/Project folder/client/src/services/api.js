import axios from "axios";

const apiOrigin = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const api = axios.create({ baseURL: apiOrigin ? `${apiOrigin}/api` : "/api", timeout: 30000 });

export function getAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return apiOrigin ? `${apiOrigin}${path.startsWith("/") ? "" : "/"}${path}` : path;
}

export async function requestData(request) {
  const response = await request;
  return response.data;
}

export function getErrorMessage(error) {
  return error.response?.data?.error || error.message || "Something went wrong. Please try again.";
}

export default api;
