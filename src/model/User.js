import mongoose from "mongoose";

//  (Next.js hot reload bug fix by mongoose.models.User ||  mongoose.model)

const UserSchema =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, "Name is required"],
        },

        email: {
          type: String,
          required: [true, "Email is required"],
          unique: true, // same email again not allowed
        },

        password: {
          type: String,
          required: [true, "Password is required"],
        },
        techRole: {
          type: String,
          enum: ["frontend", "backend", "fullstack", "database"],
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "employee"],
          default: "employee",
        },
      },
      { timestamps: true }
    )
  );

export default UserSchema;
