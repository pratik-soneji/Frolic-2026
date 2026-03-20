import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isCordinator: {
    type: Boolean,
    default: false
  },
  coordinatorType: {
    type: String,
    enum: ["student", "institute", "department", "event", null],
    default: null,
  },
  userPassword: {
    type: String,
    required: [true, 'password is required']
  },
  refreshToken: {
    type: String,
  }
}, { timestamps: true });

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.userPassword)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model('User', userSchema)