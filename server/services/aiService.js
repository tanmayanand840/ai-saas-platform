import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

export const getAIErrorMessage = (error) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message;

  console.error("[OpenRouter] request failed", { status, message, model: OPENROUTER_MODEL });

  if (status === 401 || status === 403) {
    return "The AI service rejected the server configuration. Please contact support.";
  }
  if (status === 429) {
    return "The AI service is busy or rate-limited. Please try again shortly.";
  }
  return message || "The AI service could not complete this request.";
};

export const generateText = async (prompt, { maxTokens = 1000, temperature = 0.5 } = {}) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("AI text generation is not configured.");
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const { data } = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: Math.min(maxTokens, 1800),
      },
      {
        headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
        timeout: 60000,
      }
    );

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim()) {
      return content.trim();
    }

    console.warn("[OpenRouter] empty completion, retrying", {
      attempt,
      model: data?.model || OPENROUTER_MODEL,
      finishReason: data?.choices?.[0]?.finish_reason,
    });
  }

  throw new Error("The AI model did not return a response. Please try again.");
};

export const generateStructuredText = async (prompt, options) => {
  const content = await generateText(prompt, options);
  const json = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(json);
  } catch {
    console.error("[OpenRouter] invalid JSON response");
    throw new Error("The AI returned an invalid response. Please regenerate.");
  }
};
