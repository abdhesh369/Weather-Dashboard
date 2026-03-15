// server/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    favoriteCities: {
      type: [String],
      default: [],
      validate: { validator: v => v.length <= 20, message: 'Cannot exceed 20 favourite cities.' }
    },
    refreshToken: {
      type: String,
      default: null
    },
    unitPreference: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;