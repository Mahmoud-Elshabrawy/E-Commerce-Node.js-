const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: [true, "email must be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
      trim: true,
    },
    passwordChangedAt: Date,
    phone: String,
    profileImg: String,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// when Create User only
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing User Password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp
  }
  return false
};

const User = mongoose.model("User", userSchema);
module.exports = User;
