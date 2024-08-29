const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [EMAIL_REGEX, "Please provide valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
    // maxLength: 50,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);

  // next(); - optional for mongoose 5.x and later version
});

//* schema instance method
//* using 'Schema.methods' object
UserSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFE_TIME }
  );
  return token;
};

// OR
//* using Schema.method function
UserSchema.method("createJWT2", function () {
  const token = jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
});

// instance method to compare password
UserSchema.methods.comparePass = async function(inpPass) {
  const isSame = bcryptjs.compare(inpPass, this.password);
  return isSame;
}

module.exports = mongoose.model("User", UserSchema);
