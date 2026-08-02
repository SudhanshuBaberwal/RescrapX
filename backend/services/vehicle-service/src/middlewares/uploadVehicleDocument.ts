import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadVehicleDocument = upload.fields([
  {
    name: "rcbook",
    maxCount: 1,
  },
  {
    name: "loan_closure",
    maxCount: 1,
  },
  {
    name: "puc",
    maxCount: 1,
  },
  {
    name: "insurance",
    maxCount: 1,
  },
  {
    name: "other",
    maxCount: 1,
  },
]);

export const uploadVehiclePhotos = upload.fields([
    { name:"front", maxCount:1 },
    { name:"rear", maxCount:1 },
    { name:"left", maxCount:1 },
    { name:"right", maxCount:1 },
    { name:"dashboard", maxCount:1 },
    { name:"interior", maxCount:1 },
    { name:"engine", maxCount:1 },
    { name:"odometer", maxCount:1 },
    { name:"chassisNumber", maxCount:1 },
]);

export default uploadVehicleDocument;