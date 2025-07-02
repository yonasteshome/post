import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 5
  },
  picturePath: {
    type: String,
    default: ""
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId], // this will store User IDs as references
    ref: "User",
    default: []
  },
  location: String,
  occupation: String,
  viewedProfile: Number,
  impressions: Number
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
