
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

    company?: {
        companyName: string;
        gstNumber: string;
        panNumber: string;
        registrationNumber: string;
        address: string;

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