import mongoose, { Document, Schema, Types } from "mongoose";

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
}

export interface IUserDocuments extends Document {
  owner: Types.ObjectId;
  isVerfiedProfile: boolean;
  documents: {
    rcbook: IDocuments;
    insurance: IDocuments;
    puc: IDocuments;
    loanClosure: IDocuments;
    other?: IDocuments;
    currentPic: IDocuments;
    verification_document: IDocuments;
  };
}

const DocumentSchema = new Schema<IDocuments>(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const UserDocumentsSchema = new Schema<IUserDocuments>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    isVerfiedProfile: {
      type: Boolean,
      default: false,
    },

    documents: {
      rcbook: {
        type: DocumentSchema,
        required: true,
      },

      insurance: {
        type: DocumentSchema,
        required: true,
      },

      puc: {
        type: DocumentSchema,
        required: true,
      },

      loanClosure: {
        type: DocumentSchema,
        required: true,
      },

      other: {
        type: DocumentSchema,
        required: false,
      },

      currentPic: {
        type: DocumentSchema,
        required: true,
      },

      verification_document: {
        type: DocumentSchema,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const UserDocuments =
  mongoose.models.UserDocuments ||
  mongoose.model<IUserDocuments>("UserDocuments", UserDocumentsSchema);

export default UserDocuments;
