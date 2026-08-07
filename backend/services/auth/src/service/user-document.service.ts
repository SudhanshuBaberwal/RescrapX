import UserDocuments, {
  IVehicleDocuments,
  VERIFICATION_DOCUMENTS,
  VerificationStatus,
} from "../models/user-documents.js";
import axios from "axios";
import vehicleClient from "../clients/vehicle.client.js";
import adminRepository from "../repository/admin.repository.js";
import {
  UpdateUserProfileInput,
  validateDocumentType,
  validateUserDocuments,
} from "../validations/user-document.validation.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";
import ApiError from "../lib/ApiError.js";
import mongoose from "mongoose";

type DocumentType = keyof IVehicleDocuments["documents"];

interface VehicleDocument {
  vehicleId: string;
  model: string;
  type: DocumentType;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

interface SaveUserVerificationData {
  currentPic: {
    path: string;
  };

  verificationDocument: {
    type: VERIFICATION_DOCUMENTS;
    front: {
      path: string;
    };
    back?: {
      path: string;
    };
  };
}

class UserDocumentsClass {
  async getAllVehiclesDocuments(userId: string): Promise<VehicleDocument[]> {
    try {
      const response = await vehicleClient.get("/register/user-vehicles", {
        headers: {
          "x-user-id": userId,
        },
      });

      const vehicles = response.data.data as any[];

      return vehicles.flatMap((vehicle) =>
        Object.entries(vehicle.documents)
          .filter(([_, doc]) => doc)
          .map(([type, doc]) => {
            const document = doc as Omit<
              VehicleDocument,
              "vehicleId" | "type" | "model"
            >;

            return {
              vehicleId: vehicle._id,
              model: vehicle.vehicleDetails.model,
              type: type as DocumentType,
              ...document,
            };
          }),
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data ?? err.message);
      }

      throw err;
    }
  }

  async syncVehicleDocuments(owner: string) {
    const documents = await this.getAllVehiclesDocuments(owner);

    const vehicleMap = new Map<
      string,
      {
        vehicleId: string;
        model: string;
        documents: Partial<IVehicleDocuments["documents"]>;
      }
    >();

    for (const doc of documents) {
      let vehicle = vehicleMap.get(doc.vehicleId);

      if (!vehicle) {
        vehicle = {
          vehicleId: doc.vehicleId,
          model: doc.model,
          documents: {},
        };

        vehicleMap.set(doc.vehicleId, vehicle);
      }

      vehicle.documents[doc.type] = {
        path: doc.path,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        size: doc.size,
        uploadedAt: doc.uploadedAt,
      };
    }

    const vehicles = [...vehicleMap.values()];

    let userDoc = await UserDocuments.findOne({ owner });

    if (!userDoc) {
      userDoc = new UserDocuments({
        owner,
        vehicles,
      });

      await userDoc.save();

      return userDoc;
    }

    for (const incomingVehicle of vehicles) {
      const existingVehicle = userDoc.vehicles.find((v: any) =>
        v.vehicleId.equals(incomingVehicle.vehicleId),
      );

      if (!existingVehicle) {
        userDoc.vehicles.push(incomingVehicle);
        continue;
      }

      existingVehicle.model = incomingVehicle.model;
      existingVehicle.documents = incomingVehicle.documents;
    }

    await userDoc.save();

    return userDoc;
  }

  async getAllCustomers() {
    const customers = await adminRepository.getAllCustomers();
    return customers;
  }

  async KYC(owner: string, documentType: VERIFICATION_DOCUMENTS, files: any) {
    validateDocumentType(documentType);
    validateUserDocuments(files);

    const currentPic = files.currentPic?.[0];
    const frontDocument = files.front?.[0];
    const backDocument = files.back?.[0];

    if (!currentPic) {
      throw new Error("Current picture is required");
    }

    if (!frontDocument) {
      throw new Error("Front document is required");
    }

    /*
     * Upload files
     */

    const folder = `users/${owner}/kyc`;

    const [currentPicUpload, frontUpload, backUpload] = await Promise.all([
      uploadToSupabase(currentPic, folder, "currentPic"),

      uploadToSupabase(frontDocument, folder, "front"),

      backDocument
        ? uploadToSupabase(backDocument, folder, "back")
        : Promise.resolve(null),
    ]);

    /*
     * Prepare document metadata
     */

    const currentPicData = {
      path: currentPicUpload.path,
      originalName: currentPic.originalname,
      mimeType: currentPic.mimetype,
      size: currentPic.size,
      uploadedAt: new Date(),
    };

    const frontData = {
      path: frontUpload.path,
      originalName: frontDocument.originalname,
      mimeType: frontDocument.mimetype,
      size: frontDocument.size,
      uploadedAt: new Date(),
    };

    const backData = backUpload
      ? {
          path: backUpload.path,
          originalName: backDocument.originalname,
          mimeType: backDocument.mimetype,
          size: backDocument.size,
          uploadedAt: new Date(),
        }
      : undefined;

    /*
     * Find existing user document
     */

    let userDoc = await UserDocuments.findOne({
      owner,
    });

    /*
     * Verification document
     *
     * IMPORTANT:
     * type is explicitly added here.
     */

    const verificationDocument = {
      type: documentType,

      front: frontData,

      ...(backData && {
        back: backData,
      }),

      submittedAt: new Date(),

      status: VerificationStatus.PENDING,
    };

    /*
     * Create new UserDocuments
     */

    if (!userDoc) {
      userDoc = new UserDocuments({
        owner,

        isVerifiedProfile: false,

        currentPic: currentPicData,

        verificationDocument,

        vehicles: [],
      });
    } else {
      /*
       * Update existing KYC
       */

      userDoc.currentPic = currentPicData;

      userDoc.verificationDocument = verificationDocument;
    }

    await userDoc.save();

    return userDoc;
  }
  async updateUserProfile(
    owner: string,
    data: UpdateUserProfileInput,
  ) {
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      throw new ApiError(400, "Invalid user ID");
    }

    /*
     * Convert date string to Date
     */
    const dateOfBirth = new Date(data.dateOfBirth);

    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new ApiError(
        400,
        "Invalid date of birth",
      );
    }

    /*
     * Normalize phone number
     */
    const phoneNumber = data.phoneNumber
      .replace(/[\s-]/g, "")
      .trim();

    let userDocument = await UserDocuments.findOne({
      owner,
    });

    if (!userDocument) {
      userDocument = new UserDocuments({
        owner,
        dateOfBirth,
        phoneNumber,
        gender: data.gender,

        address: {
          type: data.addressType,
          addressDetails: data.addressDetails.trim(),
          pincode: data.pincode.trim(),
          landmark:
            data.landmark?.trim() || undefined,
        },

        isVerifiedProfile: false,
        vehicles: [],
      });

      await userDocument.save();

      return userDocument;
    }
    userDocument.dateOfBirth = dateOfBirth;

    userDocument.phoneNumber = phoneNumber;

    userDocument.gender = data.gender;

    userDocument.address = {
      type: data.addressType,
      addressDetails: data.addressDetails.trim(),
      pincode: data.pincode.trim(),
      landmark:
        data.landmark?.trim() || undefined,
    };

    await userDocument.save();

    return userDocument;
  }

  async getUserProfile(owner: string) {
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      throw new ApiError(400, "Invalid user ID");
    }
    const userDocument = await UserDocuments.findOne({
      owner,
    }).lean();
    if (!userDocument) {
      return null;
    }

    return userDocument;
  }
}

export default new UserDocumentsClass();
