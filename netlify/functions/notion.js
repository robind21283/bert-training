const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || "34ac97ba4ee0806d82e1ce83d3467738";
const NOTION_VERSION = "2022-06-28";
const BASE_URL = "https://api.notion.com/v1";

async function notionRequest(path, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, options);
  return res.json();
}

async function ensureSchema() {
  const db = await notionRequest(`/databases/${NOTION_DATABASE_ID}`);
  const existing = Object.keys(db.properties || {});

  const required = {
    Date: { date: {} },
    Behavior: { select: { options: [] } },
    Status: {
      select: {
        options: [
          { name: "Done", color: "green" },
          { name: "Skipped", color: "red" },
          { name: "Snoozed", color: "purple" },
        ],
      },
    },
    "Rep Type": {
      select: {
        options: [
          { name: "Easy", color: "blue" },
          { name: "Distance", color: "orange" },
        ],
      },
    },
    "Snooze Detail": { rich_text: {} },
    "Logged At": { rich_text: {} },
    "Energy Level": {
      select: {
        options: [
          { name: "Low", color: "blue" },
          { name: "Medium", color: "yellow" },
          { name: "High", color: "red" },
        ],
      },
    },
    Notes: { rich_text: {} },
    "Rep Number": { number: {} },
  };

  const toAdd = {};
  for (const [key, val] of Object.entries(required)) {
    if (!existing.includes(key)) toAdd[key] = val;
  }

  if (Object.keys(toAdd).length > 0) {
    await notionRequest(`/databases/${NOTION_DATABASE_ID}`, "PATCH", {
      properties: toAdd,
    });
  }
}

async function logRep(data) {
  const { behavior, status, repNumber, repType, snoozeDetail, energyLevel, notes, date, loggedAt } = data;
  const title = `${behavior} — Rep ${repNumber} — ${status}`;

  const page = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Name: { title: [{ text: { content: title } }] },
      Date: { date: { start: date } },
      Behavior: { select: { name: behavior } },
      Status: { select: { name: status } },
      "Rep Type": { select: { name: repType || "Easy" } },
      "Rep Number": { number: repNumber },
      "Logged At": { rich_text: [{ text: { content: loggedAt || "" } }] },
    },
  };

  if (snoozeDetail) page.properties["Snooze Detail"] = { rich_text: [{ text: { content: snoozeDetail } }] };
  if (energyLevel) page.properties["Energy Level"] = { select: { name: energyLevel } };
  if (notes) page.properties["Notes"] = { rich_text: [{ text: { content: notes } }] };

  return notionRequest("/pages", "POST", page);
}

async function getTodayReps(date) {
  const result = await notionRequest(`/databases/${NOTION_DATABASE_ID}/query`, "POST", {
    filter: { property: "Date", date: { equals: date } },
    sorts: [{ property: "Logged At", direction: "ascending" }],
  });
  return result.results || [];
}

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const action = event.queryStringParameters?.action || "";
    const body = event.body ? JSON.parse(event.body) : {};

    if (event.httpMethod === "GET" && action === "today") {
      const date = event.queryStringParameters?.date || new Date().toISOString().split("T")[0];
      const reps = await getTodayReps(date);
      return { statusCode: 200, headers, body: JSON.stringify({ reps }) };
    }

    if (event.httpMethod === "POST" && action === "log") {
      await ensureSchema();
      const result = await logRep(body);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: result.id }) };
    }

    if (event.httpMethod === "POST" && action === "setup") {
      await ensureSchema();
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Schema ready" }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Unknown action" }) };
  } catch (err) {
    console.error("Notion function error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};