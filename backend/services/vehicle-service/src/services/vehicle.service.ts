import vehicleRepository from "../repositories/vehicle.repository.js";
import { IVehicle, RegistrationStep } from "../models/vehicle.model.js";
import ApiError from "../lib/ApiError.js";
import {
  UploadedFiles,
  UploadedPhoto,
  UploadedPhotos,
  vehicleBasicDto,
  vehicleConditionDto,
  vehicleDocumentSchema,
  vehicleMajorComponentsDto,
} from "../validations/vehicle.validation.js";
import getEditableVehicle from "../helper/editableVehicle.js";
import supabaseService from "./supabase.service.js";
const createPhoto = (upload: any, file: Express.Multer.File) => ({
  path: upload.path,

  originalName: file.originalname,

  mimeType: file.mimetype,

  size: file.size,

  uploadedAt: new Date(),
});
class VehicleService {
  private validateStep(vehicle: IVehicle, requiredStep: number) {
    if (vehicle.currentStep < requiredStep) {
      throw new ApiError(400, `Complete Step ${requiredStep} first.`);
    }

    if (vehicle.isRegistered) {
      throw new ApiError(400, "Vehicle already submitted.");
    }
  }

  async createDraftVehicle(userId: string): Promise<IVehicle | null> {
    const existingDraft = await vehicleRepository.findDraftByUserId(userId);

    if (existingDraft) {
      throw new ApiError(409, "You already have an unfinished vehicle draft.");
    }

    return vehicleRepository.createDraftCar(userId);
  }
  async basicDetails(userId: string, data: vehicleBasicDto, vehicleId: string) {
    const vehicle = await getEditableVehicle(vehicleId, userId);

    this.validateStep(vehicle, 0);
    if (vehicle.owner.toString() !== userId) {
      throw new ApiError(404, "Unauthorized For this Vehicle");
    }

    if (vehicle.currentStep < 0) {
      throw new ApiError(400, "Create Draft first");
    }
    vehicle.vehicleDetails = {
      registrationNumber: data.registrationNumber,
      manufacturer: data.carName,
      model: data.model,
      variant: data.variant,
      fuelType: data.fuelType,
      transmission: data.transmission,
      manufacturingYear: data.manufacturingYear,
      kmsDriven: data.odometerReading,
      ownership: data.ownership,
    };

    vehicle.currentStep = Math.max(vehicle.currentStep, 1);
    await vehicleRepository.saveVehicle(vehicle);
    return vehicle;
  }

  async vehicleCondition(
    userId: string,
    vehicleId: string,
    data: vehicleConditionDto,
  ) {
    const vehicle = await getEditableVehicle(vehicleId, userId);
    this.validateStep(vehicle, 1);
    vehicle.vehicleCondition = {
      accidentType: data.accidentType,
      structure: data.structuralDamage,
      airbagsDeployed: data.airbagsDeployed,
      description: data.description ?? "",
    };

    vehicle.currentStep = Math.max(vehicle.currentStep, 2);

    await vehicleRepository.saveVehicle(vehicle);

    return vehicle;
  }

  async majorComponents(
    userId: string,
    vehicleId: string,
    data: vehicleMajorComponentsDto,
  ) {
    const vehicle = await getEditableVehicle(vehicleId, userId);
    this.validateStep(vehicle, 2);
    vehicle.majorComponents = {
      engine: data.engine,
      radiator: data.radiator,
      fuelSystem: data.fuelSystem,
      gearbox: data.gearbox,
      suspension: data.suspension,
      steering: data.steering,
      electrical: data.electrical,
      exhaust: data.exhaust,
      tyres: data.tyres,
      ac: data.ac,
      bodyPanels: data.bodyPanels,
      glass: data.glass,
      lights: data.lights,
      interior: data.interior,
    };
    vehicle.currentStep = Math.max(vehicle.currentStep, 3);
    await vehicleRepository.saveVehicle(vehicle);
    return vehicle;
  }

  async uploadDocument(
    userId: string,
    vehicleId: string,
    files: UploadedFiles,
  ) {
    vehicleDocumentSchema(files);
    const vehicle = await vehicleRepository.findByVehicleId(vehicleId);

    if (!vehicle) {
      throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.owner.toString() !== userId) {
      throw new ApiError(403, "Unauthorized");
    }

    // Step 3 must be completed first
    if (vehicle.currentStep < 3) {
      throw new ApiError(
        400,
        "Please complete previous registration steps first.",
      );
    }

    // const extension = file.originalname.split(".").pop();

    const filePath = `vehicles/${userId}/document${vehicleId}`;

    const [rcbook, insurance, puc, loan_closure, other] = await Promise.all([
      supabaseService.uploadToSupabase(files.rcbook[0], filePath, "rcbook"),
      supabaseService.uploadToSupabase(
        files.insurance[0],
        filePath,
        "insurance",
      ),
      supabaseService.uploadToSupabase(
        files.loan_closure[0],
        filePath,
        "loan_closure",
      ),
      supabaseService.uploadToSupabase(files.puc[0], filePath, "puc"),
      supabaseService.uploadToSupabase(files.other[0], filePath, "other"),
    ]);

    vehicle.documents = {
      rcbook: {
        path: rcbook.path,
        originalName: files.rcbook[0].originalname,
        mimeType: files.rcbook[0].mimetype,
        size: files.rcbook[0].size,
        uploadedAt: new Date(),
      },

      insurance: {
        path: insurance.path,
        originalName: files.insurance[0].originalname,
        mimeType: files.insurance[0].mimetype,
        size: files.insurance[0].size,
        uploadedAt: new Date(),
      },

      puc: {
        path: puc.path,
        originalName: files.puc[0].originalname,
        mimeType: files.puc[0].mimetype,
        size: files.puc[0].size,
        uploadedAt: new Date(),
      },

      loanClosure: {
        path: loan_closure.path,
        originalName: files.loan_closure[0].originalname,
        mimeType: files.loan_closure[0].mimetype,
        size: files.loan_closure[0].size,
        uploadedAt: new Date(),
      },

      other: {
        path: other.path,
        originalName: files.other[0].originalname,
        mimeType: files.other[0].mimetype,
        size: files.other[0].size,
        uploadedAt: new Date(),
      },
    };

    // vehicle.documents = document as any;

    // Move to next step only after mandatory RC upload
    if (vehicle.documents.rcbook) {
      vehicle.currentStep = Math.max(vehicle.currentStep, 4);
    }

    await vehicle.save();

    return vehicle;
  }

  async uploadPhotos(userId: string, vehicleId: string, files: UploadedPhotos) {
    const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
    if (!vehicle) {
      throw new ApiError(400, "Vehicle Not Found");
    }
    if (vehicle.owner.toString() !== userId) {
      throw new ApiError(403, "Unauthrorized");
    }

    if (vehicle.currentStep < RegistrationStep.DOCUMENTS) {
      throw new ApiError(400, "Complete previous step first.");
    }

    const folder = `vehicles/${userId}/${vehicleId}/photos`;

    const [front, rear, left, right, dashboard, interior, engine, odometer] =
      await Promise.all([
        supabaseService.uploadToSupabase(files.front[0], folder, "front"),
        supabaseService.uploadToSupabase(files.rear[0], folder, "rear"),
        supabaseService.uploadToSupabase(files.left[0], folder, "left"),
        supabaseService.uploadToSupabase(files.right[0], folder, "right"),
        supabaseService.uploadToSupabase(
          files.dashboard[0],
          folder,
          "dashboard",
        ),
        supabaseService.uploadToSupabase(files.interior[0], folder, "interior"),
        supabaseService.uploadToSupabase(files.engine[0], folder, "engine"),
        supabaseService.uploadToSupabase(files.odometer[0], folder, "odometer"),
      ]);

    vehicle.photos = {
      front: createPhoto(front, files.front[0]),
      rear: createPhoto(rear, files.rear[0]),
      left: createPhoto(left, files.left[0]),
      right: createPhoto(right, files.right[0]),
      dashboard: createPhoto(dashboard, files.dashboard[0]),
      interior: createPhoto(interior, files.interior[0]),
      engine: createPhoto(engine, files.engine[0]),
      odometer: createPhoto(odometer, files.odometer[0]),
    };

    if (files.chassisNumber) {
      const chassis = await supabaseService.uploadToSupabase(
        files.chassisNumber[0],
        folder,
        "chassis",
      );
      vehicle.photos.chassisNumber = createPhoto(
        chassis,
        files.chassisNumber[0],
      );
    }
    vehicle.currentStep = Math.max(
      vehicle.currentStep,
      RegistrationStep.PHOTOS,
    );
    await vehicle.save();
    return vehicle;
  }
}

export default new VehicleService();
