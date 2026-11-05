
import express from "express";

import {
  healthAssistant,
  nutritionAssistant,
  appointmentAssistant,
  historySummary,
  providerStatus,
} from "../controllers/aiController.js";

import Pet from "../models/pet.js";
import Appointment from "../models/appointment.js";
import MedicalRecord from "../models/medicalRecord.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All AI + data routes require a logged-in user
router.use(protect);

// AI features
router.post("/assistant/health", healthAssistant);
router.post("/assistant/nutrition", nutritionAssistant);
router.post("/assistant/appointment", appointmentAssistant);
router.post("/assistant/history-summary", historySummary);
router.get("/providers", providerStatus);

// Pet CRUD (the AI features read from these)
router.post("/pets", async (req, res) => {
  try {
    const pet = await Pet.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, pet });
  } catch (error) {
    res.status(400).json({ message: "Could not create pet", error: error.message });
  }
});

router.get("/pets", async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, pets });
});

// Appointments
router.post("/appointments", async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ message: "Could not book appointment", error: error.message });
  }
});

router.get("/appointments", async (req, res) => {
  const appointments = await Appointment.find({ owner: req.user._id })
    .populate("pet", "name species")
    .sort({ scheduledAt: 1 });
  res.json({ success: true, appointments });
});

// Medical records
router.post("/records", async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, record });
  } catch (error) {
    res.status(400).json({ message: "Could not add record", error: error.message });
  }
});

router.get("/records", async (req, res) => {
  const records = await MedicalRecord.find({ owner: req.user._id })
    .populate("pet", "name species")
    .sort({ visitDate: -1 });
  res.json({ success: true, records });
});

router.post("/records/delete", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Record id is required" });
    }
    const record = await MedicalRecord.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    res.status(400).json({ message: "Could not delete record", error: error.message });
  }
});

export default router;
