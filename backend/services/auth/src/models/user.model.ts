import mongoose, { Document, Model, Schema } from "mongoose";

export enum UserRole {
  USER = "USER",
  PARTNER = "PARTNER",
  ADMIN = "ADMIN",
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
}

export interface IUser extends Document {
  fullName: string;
  userName: string;
  email: string;
  password: string;

  avatar: string;

  role: UserRole;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;

  refreshToken: string;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationOtpSentAt?: Date;
  isActive: boolean;
  lastLogin: Date;

  provider: AuthProvider;

  googleId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    userName: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // required: true,
      minlength: 8,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtpSentAt: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.LOCAL,
    },

    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },

    verificationTokenExpiresAt: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    const { password, __v, ...user } = ret;
    return user;
  },
});

userSchema.set("toObject", {
  transform: (_doc, ret: any) => {
    const { password, __v, ...user } = ret;
    return user;
  },
});
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
