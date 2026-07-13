import { IUser } from "../models/user.model.js";

export const sanitizeUser = (user: IUser) => {
  const obj = user.toObject();

  const {
    password,
    __v,
    resetPasswordToken,
    resetPasswordExpires,
    emailVerificationToken,
    emailVerificationExpires,
    ...safeUser
  } = obj;

  return safeUser;
};