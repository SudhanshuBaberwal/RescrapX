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
  rejectionReason?:string
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
export interface IUserDocuments {
  _id?:string
  owner: string;
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