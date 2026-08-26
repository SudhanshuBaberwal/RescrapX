"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import {
  CheckCircle2,
  FileText,
  AlertCircle,
  PhoneCall,
  Upload,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Check,
  HelpCircle,
  Tag,
  Loader2,
  Home,
} from "lucide-react";
import { getVehiclePricing } from "@/services/vehicle.service";

interface StepComponentProps {
  onContinue?: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  currentStepNumber?: number;
  totalStepsCount?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VehicleInstantOfferPage({
  onContinue,
  onPrevious,
}: StepComponentProps) {
  const router = useRouter();
  const { userEstimatedPrice } = useSelector((state: RootState) => state.user);
  console.log(userEstimatedPrice);
  const estimatedData: any = userEstimatedPrice || {};

  const reduxVehicle =
    estimatedData?.vehicle || estimatedData?.data?.vehicle || {};

  const reduxPricing =
    estimatedData?.pricing || estimatedData?.data?.pricing || {};

  const params = useParams<{
    _id: string;
    step: string;
  }>();

  const vehicleId = params._id;

  const [pricing, setPricing] = useState<any>(reduxPricing);
  const [vehicle, setVehicle] = useState<any>(reduxVehicle);

  const [isPricingLoading, setIsPricingLoading] = useState(false);

  const [pricingError, setPricingError] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleId) return;

    let cancelled = false;

    const loadPricing = async () => {
      const cacheKey = `vehicle-pricing-${vehicleId}`;
      try {
        setIsPricingLoading(true);
        setPricingError(null);
        const cachedPricing = sessionStorage.getItem(cacheKey);

        if (cachedPricing) {
          const parsed = JSON.parse(cachedPricing);

          if (!cancelled) {
            setPricing(parsed?.pricing ?? parsed);

            if (parsed?.vehicle) {
              setVehicle(parsed.vehicle);
            }

            setIsPricingLoading(false);
          }

          return;
        }
        console.log("Fetching vehicle pricing:", vehicleId);

        const result = await getVehiclePricing(vehicleId);

        if (cancelled) return;

        console.log("Vehicle pricing response:", result);

        // ==========================================
        // 3. SAVE API RESULT TO SESSION STORAGE
        // ==========================================

        sessionStorage.setItem(cacheKey, JSON.stringify(result));

        // ==========================================
        // 4. SAVE TO REACT STATE
        // ==========================================

        setPricing(result?.pricing ?? result);

        if (result?.vehicle) {
          setVehicle(result.vehicle);
        }
      } catch (error: any) {
        console.error("Failed to fetch vehicle pricing:", error);

        if (!cancelled) {
          setPricingError(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to load vehicle pricing.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsPricingLoading(false);
        }
      }
    };

    loadPricing();

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  // Dynamic Vehicle Name
  const vehicleName =
    `${vehicle.manufacturer || ""} ${vehicle.model || "Swift"} ${vehicle.variant || "ZXI+"}`.trim();

  // Actual Final Offer Value
  const netAmount = pricing.lowerBound || pricing.netAmount || 26598;
  const formattedValue = `₹ ${Number(netAmount).toLocaleString("en-IN")}`;

  // Estimated Price Range
  const lowerBound = pricing.lowerBound || 26598;
  const upperBound = pricing.upperBound || 29458;
  const formattedRange = `₹ ${Number(lowerBound).toLocaleString("en-IN")} – ₹ ${Number(upperBound).toLocaleString("en-IN")}`;

  // Form State
  const [isAccepted, setIsAccepted] = useState<boolean>(true);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [bankProofFile, setBankProofFile] = useState<File | null>(null);

  // Preview URL States
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [panPreview, setPanPreview] = useState<string | null>(null);
  const [bankProofPreview, setBankProofPreview] = useState<string | null>(null);

  // Request status state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle preview creation & cleanup helper
  const handleFileChange = (
    file: File | null,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    currentPreview: string | null,
  ) => {
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }
    if (file) {
      setFile(file);
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (aadhaarPreview) URL.revokeObjectURL(aadhaarPreview);
      if (panPreview) URL.revokeObjectURL(panPreview);
      if (bankProofPreview) URL.revokeObjectURL(bankProofPreview);
    };
  }, [aadhaarPreview, panPreview, bankProofPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleId) {
      setErrorMessage(
        "Vehicle ID is missing. Please refresh or restart the flow.",
      );
      return;
    }

    if (!isAccepted) {
      alert("Please accept the final offer before submitting.");
      return;
    }

    if (!aadhaarFile || !panFile || !bankProofFile) {
      alert(
        "Please upload all mandatory documents (Aadhaar Card, PAN Card, Bank Proof).",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append("accepted", "true");
      formData.append("aadhaar", aadhaarFile);
      formData.append("pan", panFile);
      formData.append("bankProof", bankProofFile);

      const response = await axios.post(
        `${API_URL}/api/vehicle/register/owner/accept-offer?vehicleId=${vehicleId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        if (onContinue) {
          onContinue();
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Error submitting offer acceptance:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to submit documents. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentFields = [
    {
      label: "Aadhaar Card",
      sub: "Upload front side of Aadhaar card",
      state: aadhaarFile,
      preview: aadhaarPreview,
      onChange: (file: File | null) =>
        handleFileChange(
          file,
          setAadhaarFile,
          setAadhaarPreview,
          aadhaarPreview,
        ),
    },
    {
      label: "PAN Card",
      sub: "Upload PAN card",
      state: panFile,
      preview: panPreview,
      onChange: (file: File | null) =>
        handleFileChange(file, setPanFile, setPanPreview, panPreview),
    },
    {
      label: "Bank Proof",
      sub: "Upload cancelled cheque / passbook / bank statement",
      state: bankProofFile,
      preview: bankProofPreview,
      onChange: (file: File | null) =>
        handleFileChange(
          file,
          setBankProofFile,
          setBankProofPreview,
          bankProofPreview,
        ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-xs font-sans text-gray-800">
      {/* MAIN LEFT SECTION */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-6">
        {/* HERO TITLE HEADER */}
        <div className="space-y-1">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Accept Your Final Offer
          </h1>
          <p className="text-xs font-medium text-gray-500">
            Your vehicle has been picked up successfully.
          </p>
        </div>

        {/* SECTION 1: FINAL OFFER SUMMARY */}
        <div className="space-y-3 pt-2">


          {/* Offer Validity Strip */}
          <div className="bg-emerald-50/50 border border-emerald-100/80 p-3 rounded-xl flex items-center gap-2 text-[11px]">
            <HelpCircle size={15} className="text-[#0B5B32] shrink-0" />
            <p className="font-semibold text-gray-700">
              <span className="font-black text-[#0B5B32]">
                Offer valid for today only.
              </span>{" "}
              Please accept to proceed.
            </p>
          </div>
        </div>

        {/* SECTION 2: ACCEPT FINAL OFFER */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <h2 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
            <span>2.</span>
            <span>Accept Final Offer</span>
          </h2>

          <label className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3.5 cursor-pointer hover:border-emerald-200 transition-colors">
            <input
              type="checkbox"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0B5B32] focus:ring-[#0B5B32]"
            />
            <div className="space-y-0.5">
              <span className="font-black text-gray-900 text-[11px]">
                I have reviewed the final offer and accept the amount of{" "}
                {formattedValue} (Estimated Range: {formattedRange}).
              </span>
              <p className="text-[10px] text-gray-400 font-medium">
                By accepting, I confirm that all the details provided are
                correct and I agree to proceed for payment.
              </p>
            </div>
          </label>
        </div>

        {/* SECTION 3: UPLOAD DOCUMENTS TO RECEIVE PAYMENT */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="space-y-0.5">
            <h2 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <span>3.</span>
              <span>Upload Documents to Receive Payment</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-medium pl-4">
              To transfer the payment, please upload the following documents.
              All documents are mandatory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {documentFields.map((doc, idx) => (
              <div
                key={idx}
                className="border border-gray-100 rounded-xl p-3 bg-white space-y-2 text-center flex flex-col justify-between"
              >
                <div className="space-y-0.5">
                  <h4 className="font-black text-gray-900 text-[11px]">
                    {doc.label}
                  </h4>
                  <p className="text-[9px] text-gray-400 font-medium">
                    {doc.sub}
                  </p>
                </div>

                {doc.state ? (
                  /* UPLOADED SUCCESS STATE */
                  <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5 min-h-[110px]">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-[#0B5B32]" />
                    </div>
                    <span className="font-black text-[10px] text-[#0B5B32] uppercase tracking-wide">
                      Document Uploaded
                    </span>
                    <span
                      className="font-semibold text-[9px] text-gray-600 truncate max-w-[140px]"
                      title={doc.state.name}
                    >
                      {doc.state.name}
                    </span>
                  </div>
                ) : (
                  /* DEFAULT UPLOAD BOX */
                  <label className="border border-dashed border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:bg-emerald-50/30 transition-colors cursor-pointer flex flex-col items-center justify-center space-y-1 min-h-[110px]">
                    <Upload size={16} className="text-[#0B5B32]" />
                    <span className="font-black text-[10px] text-gray-700">
                      Click to upload
                    </span>
                    <span className="text-[8px] text-gray-400">
                      or drag and drop
                    </span>
                    <span className="text-[8px] text-gray-400">
                      JPG, PNG, PDF (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && doc.onChange(e.target.files[0])
                      }
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* Secure & Encrypted Banner */}
          <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5">
            <Lock size={15} className="text-[#0B5B32] shrink-0" />
            <div className="space-y-0.5">
              <h4 className="font-black text-[#0B5B32] text-[10px]">
                Your documents are secure and encrypted.
              </h4>
              <p className="text-[9px] text-gray-500 font-medium">
                We use them only for payment processing and verification.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: CONFIRM & SUBMIT */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="space-y-0.5">
            <h2 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <span>4.</span>
              <span>Confirm & Submit</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-medium pl-4">
              Once you accept the offer and upload documents, our team will
              verify and process your payment.
            </p>
          </div>

          {/* Payment SLA Notice */}
          <div className="bg-amber-50/60 border border-amber-200/80 p-3 rounded-xl flex items-center gap-2 text-amber-900">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span className="font-bold text-[10px]">
              Payment will be made within{" "}
              <span className="font-black">24–48 hours</span> after document
              verification.
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-[11px] font-semibold flex items-center gap-2">
              <AlertCircle size={15} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Action Submit Button */}
          <div className="flex justify-between pt-2">
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto bg-gray-500 disabled:opacity-60 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Home size={14} />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#0B5B32] hover:bg-[#094d2a] disabled:opacity-60 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting Offer...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Accept Offer & Submit Documents</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* BACK & FOOTER SAFEGUARD */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100 text-gray-400">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 text-[10px] font-medium">
            <Lock size={12} className="text-emerald-700" />
            <span>
              Your information is encrypted and safe with us. We never share
              your data with anyone.
            </span>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
        {/* BOOKING SUMMARY */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2 font-black text-gray-900 text-xs border-b border-gray-50 pb-2">
            <FileText size={15} className="text-[#0B5B32]" />
            <h3>Booking Summary</h3>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center text-gray-500">
              <span className="font-medium">Booking ID</span>
              <span className="font-black text-gray-800">
                {vehicleId ? vehicleId.substring(0, 18) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span className="font-medium">Vehicle</span>
              <span className="font-black text-gray-800">{vehicleName}</span>
            </div>

            {/* Expected Range */}
            <div className="flex justify-between items-center text-gray-500">
              <span className="font-medium">Expected Range</span>
              <span className="font-black text-[#0B5B32]">
                {formattedRange}
              </span>
            </div>

            {/* Final Offer Amount */}

            <div className="flex justify-between items-center text-gray-500 pt-1">
              <span className="font-medium">Status</span>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                Picked Up
              </span>
            </div>
          </div>

          {/* Status Check Banner */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-[#0B5B32] shrink-0" />
            <p className="text-[10px] font-black text-[#0B5B32]">
              Vehicle has been picked up. Inspection completed.
            </p>
          </div>
        </div>

        {/* WHAT HAPPENS NEXT TIMELINE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-3">
          <h4 className="font-black text-gray-900 text-xs">
            What happens next?
          </h4>

          <div className="space-y-4 relative border-l-2 border-emerald-100 ml-3.5 pl-4 py-1 text-[11px]">
            {[
              {
                num: 1,
                title: "Offer Accepted",
                desc: "You accept the final offer after pickup.",
                current: true,
              },
              {
                num: 2,
                title: "Documents Verification",
                desc: "We verify your documents.",
              },
              {
                num: 3,
                title: "Payment Initiated",
                desc: "Payment will be processed within 24–48 hours.",
              },
              {
                num: 4,
                title: "Payment Received",
                desc: "You will receive the amount directly in your bank account.",
              },
            ].map((stepItem) => (
              <div
                key={stepItem.num}
                className="relative flex items-start justify-between gap-2"
              >
                <div
                  className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                    stepItem.current
                      ? "bg-[#0B5B32] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {stepItem.num}
                </div>
                <div>
                  <h5
                    className={`font-black ${stepItem.current ? "text-[#0B5B32]" : "text-gray-800"}`}
                  >
                    {stepItem.num}. {stepItem.title}
                  </h5>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">
                    {stepItem.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEED HELP BOX */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-3 text-center">
          <div className="space-y-1">
            <h4 className="font-black text-gray-900 text-xs">Need Help?</h4>
            <p className="text-[10px] text-gray-400 font-medium">
              Our support team is here to help you at every step.
            </p>
          </div>
          <a
            href="tel:+919990856709"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-50 border border-emerald-200 text-[#0B5B32] font-black py-2.5 px-4 rounded-xl text-xs hover:bg-emerald-100/60 transition-colors"
          >
            <PhoneCall size={14} />
            <span>Call +91 99908 56709</span>
          </a>
        </div>

        {/* SECURE & TRANSPARENT FOOTER BADGES */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-black text-gray-900 text-xs">
            <ShieldCheck size={16} className="text-[#0B5B32]" />
            <h4>Secure & Transparent</h4>
          </div>
          <div className="space-y-1.5 text-[10px] text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Check size={12} className="text-[#0B5B32]" />
              <span>100% secure process</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className="text-[#0B5B32]" />
              <span>No hidden charges</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className="text-[#0B5B32]" />
              <span>Instant payment on verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className="text-[#0B5B32]" />
              <span>PAN India service</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
