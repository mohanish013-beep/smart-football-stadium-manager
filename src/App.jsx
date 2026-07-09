async function fetchGeminiResponse(query, venueName) {
  const sanitizedQuery = query.replace(/[<>]/g, "").trim();
  if (!sanitizedQuery) return "Please ask a valid question.";
  if (!API_KEY) return "🔑 Configuration Error: Gemini API Key is missing.";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `You are a stadium assistant for ${venueName}. Answer briefly: ${sanitizedQuery}` }]
            }
          ],
          // This tells Gemini to relax its filters so our emergency simulation text doesn't get blocked
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        })
      }
    );

    const data = await response.json();

    // 1. Success path
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    // 2. Check if it was a safety block
    if (data.candidates?.[0]?.finishReason) {
      return `⚠️ Google blocked response. Reason: ${data.candidates[0].finishReason}. (This usually means the safety filters flagged your operational prompt).`;
    }

    // 3. Check for direct API errors
    if (data.error) {
      return `❌ Google API Error: ${data.error.message}`;
    }

    // 4. Fallback debug wrap
    return `Raw Response Diagnostic: ${JSON.stringify(data).substring(0, 120)}...`;

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Network connectivity failure. Unable to contact Gemini AI servers.";
  }
}