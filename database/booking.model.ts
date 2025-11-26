import { Schema, model, models, Document, Types } from "mongoose";
import Event from "./event.model";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Also index here for ref performance
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

// MODERN ASYNC MIDDLEWARE — NO MORE "next is not a function" ERROR
BookingSchema.pre("save", async function () {
  const booking = this as IBooking;

  // Only validate event existence if eventId is new or modified
  if (!booking.isNew && !booking.isModified("eventId")) return;

  // Validate that the event actually exists
  const eventExists = await Event.findById(booking.eventId).select("_id");

  if (!eventExists) {
    throw new Error(`Event with ID ${booking.eventId} does not exist`);
  }
});

// Unique compound index: one booking per event per email
BookingSchema.index(
  { eventId: 1, email: 1 },
  {
    unique: true,
    name: "uniq_event_email",
  }
);

// Additional useful indexes
BookingSchema.index({ eventId: 1, createdAt: -1 }); // Get recent bookings per event
BookingSchema.index({ email: 1, createdAt: -1 }); // User's booking history
BookingSchema.index({ createdAt: -1 }); // Global recent bookings

// Optional: Add a virtual to populate event easily
BookingSchema.virtual("event", {
  ref: "Event",
  localField: "eventId",
  foreignField: "_id",
  justOne: true,
});

// Enable virtuals when converting to JSON/API
BookingSchema.set("toJSON", { virtuals: true });
BookingSchema.set("toObject", { virtuals: true });

// Model
const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
