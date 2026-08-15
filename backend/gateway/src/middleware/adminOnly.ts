import type{ Response, NextFunction } from "express";
import type { Request } from "express";

const adminOnly = (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.headers["x-user-id"];
  const userRole = req.headers["x-user-role"];

  console.log("Auction Service userId:", userId);
  console.log("Auction Service role:", userRole);

  if (!userId || !userRole) {
  }

  if (userRole !== "ADMIN") {
    return _res
      .status(403)
      .json({ success: false, message: "Only Admin Can Access" });
  }

  next();
};

export default adminOnly;
