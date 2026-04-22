// Client-side API calls to our Netlify Function proxy

const BASE = "/api/notion";

export async function logRep(data) {
  try {
    const res = await fetch(`${BASE}?action=log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error("logRep failed:", err);
    return false;
  }
}

export async function getTodayReps(date) {
  try {
    const res = await fetch(`${BASE}?action=today&date=${date}`);
    const data = await res.json();
    return data.reps || [];
  } catch (err) {
    console.error("getTodayReps failed:", err);
    return [];
  }
}

export async function setupSchema() {
  try {
    const res = await fetch(`${BASE}?action=setup`, { method: "POST" });
    return res.ok;
  } catch (err) {
    console.error("setupSchema failed:", err);
    return false;
  }
}