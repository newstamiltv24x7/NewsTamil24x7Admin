export async function parseBody(request) {
  try {
    const text = await request.text();
    if (!text || text.trim() === "") return {};
    return JSON.parse(text);
  } catch (e) {
    console.warn("Failed to parse request body:", e.message);
    return {};
  }
}