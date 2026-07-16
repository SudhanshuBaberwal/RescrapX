import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

const uploadPartnerDocuments = upload.fields([
  {
    name: "rvsfCertificate",
    maxCount: 1,
  },
  {
    name: "gstCertificate",
    maxCount: 1,
  },
  {
    name: "panCard",
    maxCount: 1,
  },
  {
    name: "registrationCertificate",
    maxCount: 1,
  },
  {
    name: "bankDetails",
    maxCount: 1,
  },
]);

export default uploadPartnerDocuments;