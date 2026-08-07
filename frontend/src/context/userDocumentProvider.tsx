
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
   USER KYC DOCUMENT
========================= */

export interface IVerificationDocument {
  type: VERIFICATION_DOCUMENTS;

  front: IDocuments;

  back?: IDocuments;

  submittedAt: Date;

  status: VerificationStatus;
}

/* =========================
   VEHICLE DOCUMENTS
========================= */

export interface IVehicleDocuments {
  vehicleId: string;

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
  owner: string;

  isVerifiedProfile: boolean;

  // Live photo captured from camera
  currentPic?: IDocuments;

  // Aadhaar / PAN / Passport / Voter ID / Driving License
  verificationDocument?: IVerificationDocument;

  // All vehicles owned by the user
  vehicles: IVehicleDocuments[];

  createdAt?: Date;
  updatedAt?: Date;
}
