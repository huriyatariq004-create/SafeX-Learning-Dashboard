const BASE_URL = "http://localhost:5000/api/dashboard";
export async function fetchCategories(audience = "General") {
  const res = await fetch(`/api/categories?audience=${audience}`);
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function fetchHistory(userId) {
  const res = await fetch(`${BASE_URL}/history?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}

export async function fetchDashboard(userId) {
  const res = await fetch(`${BASE_URL}?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
}

export async function fetchPagedVideos({ categoryId, search, page = 1, pageSize = 8 }) {
  const params = new URLSearchParams({ page, pageSize });
  if (categoryId) params.set("categoryId", categoryId);
  if (search) params.set("search", search);
  const res = await fetch(`${BASE_URL}/videos?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load videos");
  return res.json();
}

export async function saveWatchProgress(userId, videoId, progressPercent) {
  await fetch(`${BASE_URL}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, videoId, progressPercent }),
  });
}

export async function toggleBookmark(userId, videoId, add) {
  await fetch(`${BASE_URL}/bookmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, videoId, add }),
  });
}


/*export async function addVideoFromLink(youTubeUrl, categoryId, adminUserId) {
  const res = await fetch(`${BASE_URL}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youTubeUrl, categoryId, adminUserId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add video");
  }
  return res.json();
}*/


export async function logActivity(userId, activityType, videoId = null, details = null) {
  await fetch(`${BASE_URL}/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, activityType, videoId, details }),
  });
}


