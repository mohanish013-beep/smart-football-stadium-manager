const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function processQuery(query) {
  // 1. Sanitize query
  const sanitizedQuery = query.replace(/[<>]/g, "").trim();

  if (!sanitizedQuery) {
    return "Please ask a question.";
  }

  // 2. Fallback check if API key is missing
  if (!API_KEY) {
    return "System Error: Gemini API Key is not configured in environment variables.";
  }

  try {
    // 3. Connect directly to the real Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an elite, helpful AI stadium assistant for Estadio Azteca during the FIFA World Cup. 
                  Answer the following user query professionally, keeping it concise and relevant to a football fan visiting the stadium:
                  
                  User query: "${sanitizedQuery}"`
                }
              ]
            }
          ]
        })
      }
    );

    // 4. Parse response data
    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", data);
      return "I ran into a hitch parsing that response. Let's try again!";
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection failed. Please check your internet or API key configuration.";
  }
}