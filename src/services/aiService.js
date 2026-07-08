const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function processQuery(query) {
  // Sanitize query
  const sanitizedQuery = query.replace(/[<>]/g, "").trim().toLowerCase();
  
  if (!sanitizedQuery) {
    return "Please ask a question.";
  }

  // Simulated logic based on sanitized query
  if (sanitizedQuery.includes("water") || sanitizedQuery.includes("drink")) {
    return "Water stations are located near Block A and the North Washrooms.";
  }
  
  if (sanitizedQuery.includes("bathroom") || sanitizedQuery.includes("washroom")) {
    return "The nearest washrooms are in the North and South corridors.";
  }

  if (sanitizedQuery.includes("hola") || sanitizedQuery.includes("español")) {
    return "¡Hola! Bienvenido al Estadio Azteca. ¿Cómo puedo ayudarte hoy?";
  }
  
  if (sanitizedQuery.includes("emergency") || sanitizedQuery.includes("help")) {
    return "For emergencies, please use the SOS button on your screen immediately.";
  }

  // Simulated API latency
  await new Promise(resolve => setTimeout(resolve, 800));

  return `I am your virtual stadium assistant. You asked: "${sanitizedQuery}". (Mock LLM response).`;
}
