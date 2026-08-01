import { z } from "zod";
import {
  structuralDamage,
  TransmissionType,
  accidentType,
  ComponentCondition,
} from "../models/vehicle.model.js";

const component = ComponentCondition

export const vehicleBasicSchema = z.object({
  carName: z.string().min(2),
  registrationNumber: z.string(),
  manufacturingYear: z.number().min(1990).max(new Date().getFullYear()),
  model: z.string(),
  variant: z.string().min(1),
  fuelType: z.enum(["PETROL", "DIESEL", "CNG", "EV", "HYBRID"]),
  transmission: z.enum(TransmissionType),
  odometerReading: z.number().min(0),
  ownership: z.number(),
});

export const vehicleConditionSchema = z.object({
  accidentType: z.enum(accidentType),
  structuralDamage: z.enum(structuralDamage),
  airbagsDeployed: z.boolean(),
  description: z.string().max(200).optional(),
});

export const vehicleMajorComponentsSchema = z.object({
  engine: z.enum(component),
  radiator:  z.enum(component),
  fuelSystem: z.enum(component),
  gearbox:  z.enum(component),
  suspension:  z.enum(component),
  steering:  z.enum(component),
  electrical:  z.enum(component),
  exhaust:  z.enum(component),
  tyres:  z.enum(component),
  ac:  z.enum(component),
  bodyPanels:  z.enum(component),
  glass:  z.enum(component),
  lights:  z.enum(component),
  interior: z.enum(component),
});

export type vehicleBasicDto = z.infer<typeof vehicleBasicSchema>;
export type vehicleConditionDto = z.infer<typeof vehicleConditionSchema>;
export type vehicleMajorComponentsDto = z.infer<typeof vehicleMajorComponentsSchema>