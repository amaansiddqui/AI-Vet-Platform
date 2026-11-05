
import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visitDate: { type: Date, default: Date.now },

    diagnosis: { type: String, trim: true },

    treatment: { type: String, trim: true },

    prescription: { type: String, trim: true },

    notes: { type: String, trim: true },

    vetName: { type: String, trim: true },
  },
  { timestamps: true }
);

const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);

export default MedicalRecord;
