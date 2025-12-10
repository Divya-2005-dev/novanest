// api.js

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// -------------------- Helper: Handle Responses --------------------
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || data.error || "Something went wrong");
  }
  return data;
}

// -------------------- Registration --------------------
export async function register(payload) {
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// -------------------- Login --------------------
export async function login(credentials) {
  const res = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(res);

  // Save tokens to localStorage
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  return data;
}

// -------------------- Logout --------------------
export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

// -------------------- Helper: Auth Headers --------------------
function authHeaders() {
  const token = localStorage.getItem("access");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// -------------------- Get User Profile --------------------
export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile/`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// -------------------- Update Profile --------------------
export async function updateProfile(payload) {
  const res = await fetch(`${API_BASE}/profile/`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// -------------------- Refresh Token (Optional) --------------------
export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");

  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await handleResponse(res);

  // Save new access token
  localStorage.setItem("access", data.access);

  return data;
}
