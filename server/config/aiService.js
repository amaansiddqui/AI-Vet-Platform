
// Unified AI service: talks to OpenRouter and NVIDIA Build.
// Both expose an OpenAI-compatible /chat/completions endpoint, so one
// helper covers both providers; the caller picks a provider per request.

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

const NVIDIA_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";

const DEFAULT_MODELS = {
  openrouter:
    process.env.OPENROUTER_MODEL || "nvidia/nemotron-3.5-lightning:free",
  nvidia:
    process.env.NVIDIA_MODEL || "nvidia/nemotron-3.5-bolt-e4b",
};

const SYSTEM_PROMPT = `You are "AI Vet", a helpful assistant on a pet-care platform.
You give general pet health, nutrition and care information only.
You are NOT a veterinarian and never diagnose, prescribe medication or give treatment plans.
Always include a short disclaimer when the topic is medical, and advise the owner
to consult a licensed veterinarian for diagnosis or treatment. Be concise and practical.`;

const buildEndpoint = (provider) => {
  if (provider === "nvidia") {
    if (
      !process.env.NVIDIA_API_KEY ||
      process.env.NVIDIA_API_KEY === "your_nvidia_key"
    ) {
      throw new Error("NVIDIA_API_KEY is not configured");
    }
    return {
      url: NVIDIA_URL,
      key: process.env.NVIDIA_API_KEY,
      model: DEFAULT_MODELS.nvidia,
    };
  }

  if (
    !process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTER_API_KEY === "your_openrouter_key"
  ) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return {
    url: OPENROUTER_URL,
    key: process.env.OPENROUTER_API_KEY,
    model: DEFAULT_MODELS.openrouter,
  };
};

/**
 * Send a chat completion request to the selected AI provider.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{provider?: "openrouter"|"nvidia", model?: string}} options
 * @returns {Promise<string>} the assistant's reply text
 */
export const chatComplete = async (messages, options = {}) => {
  const provider = options.provider === "nvidia" ? "nvidia" : "openrouter";
  const { url, key, model } = buildEndpoint(provider);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      // OpenRouter recommends these; harmless for NVIDIA.
      "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
      "X-Title": "AI-Vet",
    },
    body: JSON.stringify({
      model: options.model || model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 700,
      // Free OpenRouter reasoning models waste tokens "thinking";
      // disabling it keeps replies fast and within max_tokens.
      reasoning: { enabled: false },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `AI provider error (${provider}, ${response.status}): ${detail.slice(0, 300)}`
    );
  }

  const data = await response.json();

  const text =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.text;

  if (!text) {
    throw new Error("AI provider returned an empty response");
  }

  return text;
};

export const isProviderConfigured = (provider) => {
  try {
    buildEndpoint(provider === "nvidia" ? "nvidia" : "openrouter");
    return true;
  } catch {
    return false;
  }
};
