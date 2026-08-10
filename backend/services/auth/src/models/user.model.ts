import mongoose, { Document, Model, Schema } from "mongoose";

export enum UserRole {
  USER = "USER",
  PARTNER = "PARTNER",
  ADMIN = "ADMIN",
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}

export enum PartnerNextStep {
  UPLOAD_DOCUMENTS = "UPLOAD_DOCUMENTS",
  WAIT_APPROVAL = "WAIT_APPROVAL",
  DASHBOARD = "DASHBOARD",
  REUPLOAD_DOCUMENTS = "REUPLOAD_DOCUMENTS",
}

export enum PartnerStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
export interface IUser extends Document {
  fullName: string;
  userName?: string;
  email: string;
  password?: string;
  phoneNumber: string;
  avatar: string;

  role: UserRole;
  roleSelected: boolean;
  provider: AuthProvider;

  googleId?: string;

  isVerified: boolean;
  isActive: boolean;

  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  verificationOtpSentAt?: Date;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  refreshToken?: string;

  lastLogin?: Date;

  partnerStatus?: PartnerStatus;
  partnerNextStep?: PartnerNextStep;

  company?: {
    companyName: string;
    gstNumber: string;
    panNumber: string;
    registrationNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    pincode?: string;
  };
  documents?: {
    gstCertificate?: {
      path: string;
    };

    panCard?: {
      path: string;
    };

    registrationCertificate?: {
      path: string;
    };

    bankDetails?: {
      path: string;
    };

    rvsfCertificate?: {
      path: string;
    };

    uploadedAt?: Date;
  };

  rejectionReason: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    latitude: Number,
    longitude: Number
  },
  {
    _id: false,
  },
);

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
      default: null,
      minlength: 8,
      select: false,
    },

    roleSelected: {
      type: Boolean,
      default: false,
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

    partnerStatus: {
      type: String,
      enum: Object.values(PartnerStatus),
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },

    company: {
      type: companySchema,
      default: null,
    },
    documents: {
      rvsfCertificate: {
        path: {
          type: String,
        },
      },

      gstCertificate: {
        path: {
          type: String,
        },
      },

      panCard: {
        path: {
          type: String,
        },
      },

      registrationCertificate: {
        path: {
          type: String,
        },
      },

      bankDetails: {
        path: {
          type: String,
        },
      },

      uploadedAt: {
        type: Date,
      },
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
    phoneNumber: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    partnerNextStep: {
      type: String,
      enum: Object.values(PartnerNextStep),
      default: null,
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
