const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

//* about timestamps
// The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. 
// The type assigned is Date. By default, the names of the fields are createdAt and updatedAt. 
// Customize the field names by setting timestamps.createdAt and timestamps.updatedAt.

// Ex: 
// "createdAt": "2024-08-28T18:16:51.193Z",
// "updatedAt": "2024-08-28T18:16:51.193Z",
module.exports = mongoose.model("Job", JobSchema);
