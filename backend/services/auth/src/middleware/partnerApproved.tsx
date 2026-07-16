import { NextFunction, Request, Response } from "express";
import ApiError from "../lib/ApiError.js";
import { PartnerStatus } from "../models/user.model.js";
import authRepository from "../repository/auth.repository.js";


const partnerApproved = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await authRepository.findById(req.user.id);

        if (user?.partnerStatus !== PartnerStatus.APPROVED) {
            throw new ApiError(403, "Partner account is not approved");
        }

        next();
    } catch (error) {
        console.log(error)
    }
}

