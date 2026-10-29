import { Schema, model, models } from "mongoose";

export interface IConsultation {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  message?: string;
  startAt: Date;
  endAt: Date;
  /** Visitor's own timezone, used only to word the emails. */
  timezone: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  /** SHA-256 of the secret in the visitor's manage/cancel link. */
  manageTokenHash: string;
  ipHash?: string;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const consultationSchema = new Schema<IConsultation>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, maxlength: 254, index: true },
    phone: { type: String, maxlength: 30 },
    company: { type: String, maxlength: 120 },
    service: { type: String, required: true, maxlength: 100 },
    budget: { type: String, maxlength: 60 },
    message: { type: String, maxlength: 2000 },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    timezone: { type: String, required: true, maxlength: 64 },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "no_show"],
      default: "confirmed",
    },
    manageTokenHash: { type: String, required: true, unique: true, select: false },
    ipHash: { type: String, select: false },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

// Two confirmed bookings can never share a start time, even under a race.
// Cancelling frees the slot because the index only covers confirmed bookings.
consultationSchema.index(
  { startAt: 1 },
  {
    name: "uniq_confirmed_startAt",
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  }
);
consultationSchema.index({ status: 1, startAt: 1 });

const ConsultationModel =
  models.Consultation || model<IConsultation>("Consultation", consultationSchema);
export default ConsultationModel;
