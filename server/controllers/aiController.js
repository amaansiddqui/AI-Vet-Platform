
import Pet from "../models/pet.js";
import MedicalRecord from "../models/medicalRecord.js";
import { chatComplete, isProviderConfigured } from "../config/aiService.js";

const pickProvider = (req) =>
  req.body?.provider === "nvidia" ? "nvidia" : "openrouter";

const aiError = (res, error) => {
  const message = error.message || "AI request failed";
  const status = message.includes("not configured") ? 503 : 502;
  return res.status(status).json({
    success: false,
    message: "AI request failed",
    error: message,
  });
};

const findOwnedPet = async (petId, userId) => {
  const pet = await Pet.findOne({ _id: petId, owner: userId });
  if (!pet) return null;
  return pet;
};

// 1. AI PET HEALTH ASSISTANT
export const healthAssistant = async (req, res) => {
  try {
    const { question, petId, history } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "A question is required",
      });
    }

    let petContext = "The owner did not specify a pet.";
    if (petId) {
      const pet = await findOwnedPet(petId, req.user._id);
      if (pet) {
        petContext = `Pet details: name ${pet.name}, species ${pet.species}, breed ${pet.breed || "unknown"}, age ${pet.age ?? "unknown"}, weight ${pet.weightKg ?? "unknown"} kg.`;
      }
    }

    const messages = [
      {
        role: "system",
        content:
          "The owner is asking a general pet health question. Give practical, safe next steps. Never diagnose or prescribe. Include a brief reminder to see a veterinarian.",
      },
      ...(Array.isArray(history) ? history.slice(-6) : []),
      { role: "user", content: `${petContext}\n\nQuestion: ${question}` },
    ];

    const reply = await chatComplete(messages, {
      provider: pickProvider(req),
    });

    return res.json({ success: true, reply });
  } catch (error) {
    return aiError(res, error);
  }
};

// 2. AI NUTRITION ASSISTANT
export const nutritionAssistant = async (req, res) => {
  try {
    const { petId, provider } = req.body;
    const providerName = provider === "nvidia" ? "nvidia" : "openrouter";

    const pet = await findOwnedPet(petId, req.user._id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const reply = await chatComplete(
      [
        {
          role: "system",
          content:
            "You are a pet nutrition guide. Suggest general food types, portion thinking and feeding tips based on species, breed, age and weight. Never prescribe medical diets for a diagnosed condition without a vet.",
        },
        {
          role: "user",
          content: `Give general nutrition guidance for this pet: species ${pet.species}, breed ${pet.breed || "unknown"}, age ${pet.age ?? "unknown"}, weight ${pet.weightKg ?? "unknown"} kg.`,
        },
      ],
      { provider: providerName }
    );

    return res.json({ success: true, reply });
  } catch (error) {
    return aiError(res, error);
  }
};

// 3. SMART APPOINTMENT ASSISTANT
export const appointmentAssistant = async (req, res) => {
  try {
    const { concern, petId, provider } = req.body;
    const providerName = provider === "nvidia" ? "nvidia" : "openrouter";

    if (!concern || !concern.trim()) {
      return res.status(400).json({ message: "Describe the concern" });
    }

    let petContext = "No specific pet was selected.";
    if (petId) {
      const pet = await findOwnedPet(petId, req.user._id);
      if (pet) {
        petContext = `Pet: ${pet.species} named ${pet.name}, age ${pet.age ?? "unknown"}.`;
      }
    }

    const reply = await chatComplete(
      [
        {
          role: "system",
          content:
            "You help pet owners decide whether their concern needs a routine vet visit, an urgent (same-day) visit, or is likely minor and can be monitored at home. Explain the reasoning briefly, suggest what type of vet specialist to book if relevant, and remind them it is not a diagnosis.",
        },
        { role: "user", content: `${petContext}\n\nConcern: ${concern}` },
      ],
      { provider: providerName }
    );

    return res.json({ success: true, reply });
  } catch (error) {
    return aiError(res, error);
  }
};

// 4. AI MEDICAL HISTORY SUMMARY
export const historySummary = async (req, res) => {
  try {
    const { petId, provider } = req.body;
    const providerName = provider === "nvidia" ? "nvidia" : "openrouter";

    const pet = await findOwnedPet(petId, req.user._id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const records = await MedicalRecord.find({ pet: petId })
      .sort({ visitDate: 1 })
      .limit(20)
      .lean();

    if (records.length === 0) {
      return res.json({
        success: true,
        reply:
          "No medical records found for this pet yet. Add records after vet visits and the AI summary will be generated from them.",
        recordCount: 0,
      });
    }

    const recordText = records
      .map(
        (r) =>
          `- ${r.visitDate?.toISOString?.().slice(0, 10) || "unknown date"} | diagnosis: ${r.diagnosis || "n/a"} | treatment: ${r.treatment || "n/a"} | prescription: ${r.prescription || "n/a"} | notes: ${r.notes || "n/a"}`
      )
      .join("\n");

    const reply = await chatComplete(
      [
        {
          role: "system",
          content:
            "Summarize a pet's medical history in plain language for the owner: overall health picture, recurring issues, current medications, and anything the vet should watch. Do not diagnose or add medical advice beyond the records.",
        },
        {
          role: "user",
          content: `Pet: ${pet.name}, ${pet.species}. Medical records:\n${recordText}`,
        },
      ],
      { provider: providerName }
    );

    return res.json({ success: true, reply, recordCount: records.length });
  } catch (error) {
    return aiError(res, error);
  }
};

// Provider status (used by AI Settings page)
export const providerStatus = async (req, res) => {
  return res.json({
    openrouter: isProviderConfigured("openrouter"),
    nvidia: isProviderConfigured("nvidia"),
  });
};
