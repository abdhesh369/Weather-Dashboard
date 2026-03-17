import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      index:     true,
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      select:   false, // never returned in queries by default
    },
    favoriteCities: {
      type:     [String],
      default:  [],
      validate: {
        validator: v => v.length <= 20,
        message:   'Maximum of 20 favourite cities allowed.',
      },
    },
    refreshToken: {
      type:    String,
      default: null,
      select:  false, // don't leak in /me responses
    },
    unitPreference: {
      type:    String,
      enum:    ['metric', 'imperial'],
      default: 'metric',
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 });

// ── Instance helper: safe public profile ─────────────────────────────────────
userSchema.methods.toPublicJSON = function () {
  return {
    id:             this._id,
    email:          this.email,
    unitPreference: this.unitPreference,
    lastLogin:      this.lastLogin,
    createdAt:      this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
export default User;
