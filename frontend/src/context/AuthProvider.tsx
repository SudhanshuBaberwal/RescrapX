
export enum UserRole {
    USER = "USER",
    PARTNER = "PARTNER",
    ADMIN = "ADMIN",
}

export enum AuthProvider {
    LOCAL = "LOCAL",
    GOOGLE = "GOOGLE",
}

export enum PartnerStatus {
    PENDING = "PENDING",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum PartnerNextStep {
    UPLOAD_DOCUMENTS = "UPLOAD_DOCUMENTS",
    WAIT_APPROVAL = "WAIT_APPROVAL",
    DASHBOARD = "DASHBOARD",
    REUPLOAD_DOCUMENTS = "REUPLOAD_DOCUMENTS",
}
export interface User {
    _id: string
    fullName: string;
    userName?: string;
    email: string;
    password?: string;
    phoneNumber: string;
    avatar: string;

    role: UserRole;
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
    partnerNextStep?: PartnerNextStep
    rejectionReason: string;
    company?: {
        companyName: string;
        gstNumber: string;
        panNumber: string;
        registrationNumber: string;
        address: string;
        latitude: number,
        longitude: number,
        city?: string;
        state?: string;
        pincode?: string;
    };
    documents?: {
        idProof: string;
        gstCertificate: string;
        panCard: string;
        registrationCertificate: string;
        bankDetails: string;
        rvsfCertificate: string;
        uploadedAt?: Date;
    };

    createdAt?: Date;
    updatedAt?: Date;
}
export interface Company {
    companyName: string;
    gstNumber: string;
    panNumber: string;
    registrationNumber: string;
    address: string;

    city?: string;
    state?: string;
    pincode?: string;
}

export interface Documents {
    //   idProof: string;
    gstCertificate: string;
    panCard: string;
    registrationCertificate: string;
    bankDetails: string;
    rvsfCertificate: string;
    uploadedAt?: string;
}
export interface Partner {
    _id: string;

    fullName: string;
    userName?: string;

    email: string;
    phoneNumber: string;
    avatar: string;

    role: UserRole;
    roleSelected: boolean;

    provider: AuthProvider;
    googleId?: string;
    PartnerStatus: PartnerStatus
    isVerified: boolean;
    isActive: boolean;

    verificationToken?: string;
    verificationTokenExpiresAt?: string;
    verificationOtpSentAt?: string;

    resetPasswordToken?: string;
    resetPasswordExpires?: string;

    lastLogin?: string;

    partnerStatus?: PartnerStatus;
    partnerNextStep?: PartnerNextStep;

    company?: Company;

    documents?: Documents;

    createdAt?: string;
    updatedAt?: string;
}