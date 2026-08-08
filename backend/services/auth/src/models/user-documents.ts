import mongoose, { Schema, Types } from "mongoose";
export interface IDocuments {
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}
export enum DocumentsType {
  RC_BOOK = "RC_BOOK",
  INSURANCE = "INSURANCE",
  PUC = "PUC",
  LOAN_CLOSURE = "LOAN_CLOSURE",
  OTHER = "OTHER",
}
export enum VERIFICATION_DOCUMENTS {
  AADAHR_CARD = "AADAHR_CARD",
  PAN_CARD = "PAN_CARD",
  PASSPORT = "PASSPORT",
  VOTERID = "VOTERID",
  DRIVING_LICENSE = "DRIVING_LICENSE",
}
export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}
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
export interface IVerificationDocument {
  type: VERIFICATION_DOCUMENTS;
  front: IDocuments;
  back?: IDocuments;
  submittedAt: Date;
  rejectionReason?: string;
  status: VerificationStatus;
}
export interface IUserAddress {
  type: AddressType;
  addressDetails: string;
  pincode: string;
  landmark?: string;
  city: string;
  state: string;
}
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
export interface IUserDocuments {
  owner: Types.ObjectId;
  dateOfBirth?: Date;
  phoneNumber?: string;
  gender?: Gender;
  address?: IUserAddress;
  isVerifiedProfile: boolean;
  currentPic?: IDocuments;
  verificationDocument?: IVerificationDocument;
  vehicles: IVehicleDocuments[];

  createdAt?: Date;
  updatedAt?: Date;
}
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
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
  },
  {
    _id: false,
  },
);
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
    rejectionReason: {
      type: String,
      trim: true,
      default: undefined,
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
const UserDocumentsSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
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
    address: {
      type: UserAddressSchema,
      required: false,
      default: null,
    },
    rejectionReason: {
      type: String,
      deafult: "",
    },
    isVerifiedProfile: {
      type: Boolean,
      default: false,
    },
    currentPic: {
      type: DocumentSchema,
      required: false,
    },
    verificationDocument: {
      type: VerificationDocumentSchema,
      required: false,
    },
    vehicles: {
      type: [VehicleDocumentsSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
const UserDocuments =
  mongoose.models.UserDocuments ||
  mongoose.model("UserDocuments", UserDocumentsSchema);

export default UserDocuments;
