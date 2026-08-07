import mongoose, { Schema, Types } from "mongoose";

/* =========================
BASIC DOCUMENT
========================= */

export interface IDocuments {
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

/* =========================
VEHICLE DOCUMENT TYPES
========================= */

export enum DocumentsType {
  RC_BOOK = "RC_BOOK",
  INSURANCE = "INSURANCE",
  PUC = "PUC",
  LOAN_CLOSURE = "LOAN_CLOSURE",
  OTHER = "OTHER",
}

/* =========================
VERIFICATION DOCUMENT TYPES
========================= */

export enum VERIFICATION_DOCUMENTS {
  AADAHR_CARD = "AADAHR_CARD",
  PAN_CARD = "PAN_CARD",
  PASSPORT = "PASSPORT",
  VOTERID = "VOTERID",
  DRIVING_LICENSE = "DRIVING_LICENSE",
}

/* =========================
VERIFICATION STATUS
========================= */

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

/* =========================
USER PROFILE
========================= */

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export enum AddressType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

/* =========================
VERIFICATION DOCUMENT
========================= */

export interface IVerificationDocument {
  type: VERIFICATION_DOCUMENTS;

  front: IDocuments;

  back?: IDocuments;

  submittedAt: Date;

  status: VerificationStatus;
}

/* =========================
USER ADDRESS
========================= */

export interface IUserAddress {
  type: AddressType;

  addressDetails: string;

  pincode: string;

  landmark?: string;
}

/* =========================
VEHICLE DOCUMENTS
========================= */

export interface IVehicleDocuments {
  vehicleId: Types.ObjectId;

  model: string;

  documents: {
    rcbook?: IDocuments;
    insurance?: IDocuments;
    puc?: IDocuments;
    loanClosure?: IDocuments;
    other?: IDocuments;
  };
}

/* =========================
USER DOCUMENTS
========================= */

export interface IUserDocuments {
  owner: Types.ObjectId;

  /* Personal Information */

  dateOfBirth?: Date;

  phoneNumber?: string;

  gender?: Gender;

  /* Address Information */

  address?: IUserAddress;

  /* KYC */

  isVerifiedProfile: boolean;

  currentPic?: IDocuments;

  verificationDocument?: IVerificationDocument;

  /* Vehicle Documents */

  vehicles: IVehicleDocuments[];

  createdAt?: Date;

  updatedAt?: Date;
}

/* =========================================================
BASIC DOCUMENT SCHEMA
========================================================= */

const DocumentSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
ADDRESS SCHEMA
========================================================= */

const UserAddressSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(AddressType),
      default: AddressType.PRIMARY,
      required: true,
    },

    addressDetails: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^[1-9][0-9]{5}$/,
    },

    landmark: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
VERIFICATION DOCUMENT SCHEMA
========================================================= */

const VerificationDocumentSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(VERIFICATION_DOCUMENTS),
      required: true,
    },

    front: {
      type: DocumentSchema,
      required: true,
    },

    back: {
      type: DocumentSchema,
      required: false,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
VEHICLE DOCUMENT SCHEMA
========================================================= */

const VehicleDocumentsSchema = new Schema(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Vehicle",
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    documents: {
      rcbook: {
        type: DocumentSchema,
        required: false,
      },

      insurance: {
        type: DocumentSchema,
        required: false,
      },

      puc: {
        type: DocumentSchema,
        required: false,
      },

      loanClosure: {
        type: DocumentSchema,
        required: false,
      },

      other: {
        type: DocumentSchema,
        required: false,
      },
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
MAIN USER DOCUMENT SCHEMA
========================================================= */

const UserDocumentsSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* =====================================================
    PERSONAL INFORMATION
    ===================================================== */

    dateOfBirth: {
      type: Date,
      required: false,
    },

    phoneNumber: {
      type: String,
      required: false,
      trim: true,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      required: false,
    },

    /* =====================================================
    ADDRESS INFORMATION
    ===================================================== */

    address: {
      type: UserAddressSchema,
      required: false,
      default: null,
    },

    /* =====================================================
    KYC
    ===================================================== */

    isVerifiedProfile: {
      type: Boolean,
      default: false,
    },

    /*
     * Live photo captured using camera.
     */
    currentPic: {
      type: DocumentSchema,
      required: false,
    },

    /*
     * Government ID document.
     */
    verificationDocument: {
      type: VerificationDocumentSchema,
      required: false,
    },

    /* =====================================================
    VEHICLE DOCUMENTS
    ===================================================== */

    vehicles: {
      type: [VehicleDocumentsSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
MODEL
========================================================= */

const UserDocuments =
  mongoose.models.UserDocuments ||
  mongoose.model("UserDocuments", UserDocumentsSchema);

export default UserDocuments;